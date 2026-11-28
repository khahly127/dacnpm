'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { extractTableIdFromQRText, CheckInTab } from '@/types/checkin';

// Khai báo BarcodeDetector cho TypeScript
declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

interface UseQrScannerOptions {
  onTableDetected: (tableId: string) => void;
}

export function useQrScanner({ onTableDetected }: UseQrScannerOptions) {
  const [activeTab, setActiveTab] = useState<CheckInTab>('CAMERA');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [manualTableNumber, setManualTableNumber] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [detectedSuccess, setDetectedSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionRef = useRef<number>(0);
  const activeTabRef = useRef<CheckInTab>(activeTab);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Lưu callback vào ref để tránh việc startCamera bị tạo mới lại khi re-render
  const onTableDetectedRef = useRef(onTableDetected);
  useEffect(() => {
    onTableDetectedRef.current = onTableDetected;
  }, [onTableDetected]);

  // Dừng camera
  const stopCamera = useCallback(() => {
    // 1. Tăng mã phiên làm việc để hủy bỏ ngay lập tức mọi lệnh getUserMedia đang chờ dở dang
    sessionRef.current++;

    // 2. Dừng chu kỳ quét BarcodeDetector
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    // 3. Khóa tín hiệu và tắt hẳn từng track phần cứng
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.enabled = false;
          track.stop();
        } catch {}
      });
      streamRef.current = null;
    }

    // 4. Rút nguồn và tạm dừng thẻ video để Windows tắt đèn LED
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch {}
    }

    setIsCameraActive(false);
  }, []);

  // Khởi động Camera / Webcam
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    const currentSession = ++sessionRef.current;

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError('Trình duyệt không hỗ trợ truy cập Camera/Webcam.');
      return;
    }

    try {
      let stream: MediaStream | null = null;
      try {
        // 1. Thử yêu cầu camera với độ phân giải và ưu tiên camera sau
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      } catch (firstErr: any) {
        // 2. Dự phòng: Nếu laptop/PC không hỗ trợ ràng buộc trên, fallback về cấu hình mặc định
        console.warn('Thử lại với cấu hình camera cơ bản do constraints:', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
      }

      // CHỐT CHẶN PHIÊN & TRẠNG THÁI TAB:
      // Nếu trong lúc chờ getUserMedia mà người dùng đã bấm sang tab khác hoặc có phiên mới đè lên
      if (currentSession !== sessionRef.current || activeTabRef.current !== 'CAMERA') {
        if (stream) {
          stream.getTracks().forEach((track) => {
            try {
              track.enabled = false;
              track.stop();
            } catch {}
          });
        }
        return;
      }

      if (!stream) {
        setCameraError('Không thể kết nối đến Camera/Webcam.');
        return;
      }

      streamRef.current = stream;

      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;

        // Đợi dữ liệu video nạp xong metadata rồi mới tiến hành phát
        videoEl.onloadedmetadata = () => {
          if (currentSession !== sessionRef.current || activeTabRef.current !== 'CAMERA') {
            stopCamera();
            return;
          }

          videoEl
            .play()
            .then(() => {
              if (currentSession !== sessionRef.current || activeTabRef.current !== 'CAMERA') {
                stopCamera();
                return;
              }
              setIsCameraActive(true);

              // Bắt đầu vòng quét BarcodeDetector nếu trình duyệt hỗ trợ
              if ('BarcodeDetector' in window) {
                try {
                  const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });

                  scanIntervalRef.current = setInterval(async () => {
                    if (!videoRef.current || videoRef.current.readyState < 2) return;

                    try {
                      const barcodes = await barcodeDetector.detect(videoRef.current);
                      if (barcodes && barcodes.length > 0) {
                        const rawValue = barcodes[0].rawValue;
                        const tableId = extractTableIdFromQRText(rawValue);
                        if (tableId) {
                          stopCamera();
                          setDetectedSuccess(true);
                          onTableDetectedRef.current(tableId);
                        }
                      }
                    } catch {
                      // Bỏ qua lỗi khung hình lẻ khi camera đang di chuyển
                    }
                  }, 300);
                } catch {
                  // Không hỗ trợ BarcodeDetector
                }
              }
            })
            .catch((playErr: any) => {
              if (playErr.name === 'AbortError') return;
              console.warn('Lỗi khi phát video:', playErr);
              setCameraError('Không thể phát hình từ Camera. Vui lòng thử lại.');
            });
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      if (currentSession !== sessionRef.current || activeTabRef.current !== 'CAMERA') return;

      console.warn('Lỗi mở camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Bạn đã từ chối quyền truy cập Camera. Vui lòng cấp quyền trên trình duyệt hoặc tải ảnh mã QR / nhập số bàn.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Không tìm thấy Camera hoặc Webcam trên thiết bị này.');
      } else {
        setCameraError('Không thể kết nối đến Camera. Vui lòng thử tải ảnh QR hoặc nhập số bàn.');
      }
    }
  }, [stopCamera]);

  // Quét mã QR từ file ảnh tải lên
  const decodeImageFile = useCallback(
    async (file: File) => {
      setImageError(null);
      setIsProcessingImage(true);

      try {
        // 1. Thử giải mã bằng BarcodeDetector gốc của trình duyệt
        if ('BarcodeDetector' in window) {
          try {
            const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const bitmap = await createImageBitmap(file);
            const barcodes = await barcodeDetector.detect(bitmap);

            if (barcodes && barcodes.length > 0) {
              const rawValue = barcodes[0].rawValue;
              const tableId = extractTableIdFromQRText(rawValue);
              if (tableId) {
                setDetectedSuccess(true);
                onTableDetectedRef.current(tableId);
                setIsProcessingImage(false);
                return;
              }
            }
          } catch (e) {
            console.warn('BarcodeDetector ảnh thất bại:', e);
          }
        }

        // 2. Dự phòng thông minh: Kiểm tra tên file (ví dụ: QR_BAN-01.svg, QR_Bàn 05.png...)
        const fileNameMatch = extractTableIdFromQRText(file.name);
        if (fileNameMatch) {
          setDetectedSuccess(true);
          onTableDetectedRef.current(fileNameMatch);
          setIsProcessingImage(false);
          return;
        }

        // 3. Nếu là file SVG (file QR tải từ Admin Web), đọc nội dung text của SVG để trích URL
        if (file.type.includes('svg') || file.name.endsWith('.svg')) {
          const text = await file.text();
          const svgTableMatch = extractTableIdFromQRText(text);
          if (svgTableMatch) {
            setDetectedSuccess(true);
            onTableDetectedRef.current(svgTableMatch);
            setIsProcessingImage(false);
            return;
          }
        }

        setImageError('Không tìm thấy mã QR bàn ăn hợp lệ trong ảnh này. Vui lòng thử ảnh rõ nét hơn hoặc nhập số bàn.');
      } catch {
        setImageError('Lỗi khi đọc file ảnh. Vui lòng thử lại.');
      } finally {
        setIsProcessingImage(false);
      }
    },
    []
  );

  // Xử lý nhập số bàn thủ công (Hướng 1: 1 đến 100 bàn)
  const submitManualTable = useCallback(
    (inputStr?: string) => {
      const val = (inputStr ?? manualTableNumber).trim();
      setManualError(null);

      if (!val) {
        setManualError('Vui lòng nhập số bàn của bạn.');
        return;
      }

      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0 || num > 100) {
        setManualError('Số bàn không hợp lệ. Nhà hàng phục vụ từ bàn 01 đến bàn 100.');
        return;
      }

      setDetectedSuccess(true);
      onTableDetectedRef.current(String(num));
    },
    [manualTableNumber]
  );

  // Hàm chuyển tab ngắt camera ngay tức thì
  const handleTabChange = useCallback(
    (newTab: CheckInTab) => {
      if (newTab !== 'CAMERA') {
        stopCamera();
      }
      setActiveTab(newTab);
    },
    [stopCamera]
  );

  // Tự động bật camera khi chuyển sang tab CAMERA, tắt khi rời tab
  useEffect(() => {
    if (activeTab === 'CAMERA') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, startCamera, stopCamera]);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    videoRef,
    isCameraActive,
    cameraError,
    retryCamera: startCamera,
    isProcessingImage,
    imageError,
    decodeImageFile,
    manualTableNumber,
    setManualTableNumber,
    manualError,
    submitManualTable,
    detectedSuccess,
  };
}
