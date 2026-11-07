# Các Usecase chính
1. Use Case: Truy cập thực đơn qua QR Code (UC01)
Tác nhân chính: Khách hàng (Customer)

Mô tả: Cho phép khách hàng quét mã QR tại bàn để truy cập vào giao diện thực đơn tương ứng với số bàn được xác định.

Luồng sự kiện chính:

Khách hàng dùng camera điện thoại quét mã QR dán tại bàn ăn.

Hệ thống đọc thông tin từ mã QR (chứa table_id / ma_ban).

Hệ thống xác thực và ghi nhận phiên làm việc của khách hàng gắn với bàn tương ứng.

Hệ thống tải và hiển thị giao diện thực đơn (menu) của nhà hàng.

2. Use Case: Quản lý giỏ hàng (UC02)
Tác nhân chính: Khách hàng (Customer)

Mô tả: Cho phép khách hàng thêm món ăn, cập nhật số lượng, thêm ghi chú, xóa món và xem lại giỏ hàng kèm tính tiền tạm tính.

Luồng sự kiện chính:

Khách hàng chọn món ăn từ thực đơn và nhấn "Thêm vào giỏ".

Hệ thống kiểm tra trạng thái món (còn món hay hết món) và thêm vào giỏ hàng của phiên làm việc.

Khách hàng mở giỏ hàng để xem danh sách các món đã chọn, số lượng, đơn giá và tổng tiền tạm tính.

Khách hàng có thể thực hiện cập nhật số lượng, xóa món hoặc nhập ghi chú đặc biệt cho từng món (ví dụ: ít cay, không hành).

Hệ thống tự động tính toán lại tổng tiền tạm tính mỗi khi giỏ hàng thay đổi.

3. Use Case: Đặt món (UC03)
Tác nhân chính: Khách hàng (Customer)

Mô tả: Cho phép khách hàng xác nhận các món đã chọn từ giỏ hàng và gửi đơn hàng (order) đến hệ thống nhà hàng tiếp nhận, xử lý.

Luồng sự kiện chính:

Khách hàng mở giỏ hàng và kiểm tra lại danh sách các món đã chọn.

Khách hàng chọn "Xác nhận đặt món".

Hệ thống thực hiện kiểm tra giỏ hàng để đảm bảo giỏ hàng tồn tại các sản phẩm hợp lệ và không trống.

Hệ thống thực hiện tính tổng tiền đơn hàng dựa trên số lượng và đơn giá hiện hành tại thời điểm đặt.

Hệ thống thực hiện đặt đơn, ghi nhận thông tin đơn hàng (DonHang) cùng chi tiết món (ChiTietDonHang) vào cơ sở dữ liệu.

Hệ thống thông báo kết quả đặt món thành công, hiển thị thông báo và cung cấp mã đơn hàng (ma_don) cho khách hàng.

4. Use Case: Theo dõi trạng thái đơn hàng (UC04)
Tác nhân chính: Khách hàng (Customer)

Mô tả: Cho phép khách hàng theo dõi tiến độ xử lý đơn hàng đã đặt tại bàn.

Luồng sự kiện chính:

Khách hàng chọn chức năng theo dõi đơn hàng.

Hệ thống truy vấn lịch sử gọi món và danh sách các đơn hàng theo phiên bàn hiện tại.

Hệ thống hiển thị chi tiết các đơn gọi món kèm theo trạng thái thời gian thực (Ví dụ: Chờ xác nhận, Đang chuẩn bị, Đang phục vụ, Hoàn tất).

Hệ thống cập nhật tự động (real-time) khi nhân viên thay đổi trạng thái đơn hàng.

5. Use Case: Quản lý & Xác nhận đơn hàng (Dành cho Nhân viên/Quản lý)
Tác nhân chính:  Quản lý (Manager)

Mô tả: Cho phép nhân viên nhà hàng tiếp nhận order mới từ khách qua QR, cập nhật trạng thái chế biến và thanh toán.

Luồng sự kiện chính:

Hệ thống nhận order mới từ bàn và đẩy thông báo (real-time) lên màn hình quản lý của nhân viên.

Nhân viên mở danh sách đơn hàng chờ xử lý để xem chi tiết món và ghi chú của khách.

Nhân viên thực hiện xác nhận nhận đơn (chuyển trạng thái sang Đang chuẩn bị).

Khi món ăn sẵn sàng, nhân viên cập nhật trạng thái đơn thành Đang phục vụ hoặc Hoàn tất.

Nhân viên thực hiện quy trình thanh toán (tiền mặt hoặc tích hợp cổng VietQR) và đóng bàn khi khách hoàn tất.


# Các actor chính
1. Khách hàng (Customer)
Đặc điểm: Tác nhân không cần tạo tài khoản hay đăng nhập. Định danh thông qua phiên làm việc (Session/Token) gắn với số bàn sau khi quét mã QR.

Nhiệm vụ & Chức năng thực hiện:

Quét mã QR: Quét mã tại bàn để truy cập thẳng vào thực đơn của nhà hàng gắn với bàn đó.

Xem thực đơn: Xem danh sách nhóm món, chi tiết món ăn (tên, giá, hình ảnh, trạng thái còn/hết).

Quản lý giỏ hàng (UC02): Thêm món, điều chỉnh số lượng, thêm ghi chú (ví dụ: không cay, ít đá), xóa món và xem tổng tiền tạm tính.

Đặt món (UC03): Xác nhận gửi danh sách món ăn từ giỏ hàng xuống bếp/quầy thu ngân.

Theo dõi đơn hàng (UC04): Xem trạng thái thực tế của các món đã gọi (Chờ xác nhận ➔ Đang chế biến ➔ Đang phục vụ).

Thanh toán: Gửi yêu cầu thanh toán gọi nhân viên hoặc thực hiện quét mã VietQR để chuyển khoản.

2. Quản lý (Manager)
Đặc điểm: Cần đăng nhập vào hệ thống bằng tài khoản do Quản lý cấp. Thao tác chủ yếu trên giao diện theo dõi thời gian thực (Real-time Dashboard).

Nhiệm vụ & Chức năng thực hiện:

Đăng nhập: Truy cập hệ thống bằng tên tài khoản và mật khẩu.

Tiếp nhận Order: Nhận thông báo (thời gian thực) ngay khi có bàn gửi yêu cầu đặt món mới.

Xử lý đơn hàng:

Xác nhận đơn (chuyển cho bếp).

Hủy món/Từ chối món (nếu bếp báo hết nguyên liệu).

Cập nhật trạng thái món ăn khi đã bưng ra bàn (chuyển sang "Đã phục vụ").

Quản lý trạng thái bàn: Theo dõi sơ đồ bàn (Bàn trống, Bàn đang có khách, Bàn đang chờ thanh toán).

Xử lý thanh toán: Nhận yêu cầu tính tiền từ khách, xác nhận đã nhận tiền (tiền mặt/VietQR) và đóng đơn hàng (hoàn tất).

3. Quản lý (Admin)
Đặc điểm: Người có quyền hạn cao nhất trong hệ thống (Super User). Bao gồm toàn bộ quyền của Nhân viên cộng thêm các quyền quản trị, thiết lập hệ thống và xem báo cáo.

Nhiệm vụ & Chức năng thực hiện:

Quản lý Nhân viên: Tạo tài khoản mới, cập nhật thông tin, đổi mật khẩu, cấp quyền, khóa hoặc xóa tài khoản của nhân viên.

Quản lý Thực đơn (Menu): Thêm món ăn mới, sửa thông tin món (giá, ảnh, mô tả), ẩn món, chuyển trạng thái "Hết món", và quản lý danh mục (Nhóm món).

Quản lý Bàn ăn & Mã QR: Thêm bàn mới, đặt tên bàn, và sinh mã QR gắn liền với từng bàn (URL chứa tham số bàn) để mang đi in ấn.

Theo dõi doanh thu (Thống kê):

Xem báo cáo doanh thu theo ngày, tuần, tháng.

Xem thống kê món ăn bán chạy nhất.

Tra cứu lại lịch sử toàn bộ các đơn hàng và hóa đơn đã hoàn tất.

💡 Ghi chú dành cho AI Agent khi gen code:
Tầng Middleware: Cần tạo middleware verifyToken chung. Sau đó tạo thêm checkRole('Quản trị viênn') và checkRole('QuanLy') để bảo vệ các Endpoints tương ứng.

Tầng Database: Khách hàng không lưu vào bảng User, mà được định danh ẩn danh thông qua ma_ban trong bảng DonHang. Quản lý và Admin dùng chung bảng NhanVien phân biệt qua cột vai_tro.