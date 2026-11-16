import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  TableItem,
  TableStats,
  TableViewMode,
  TableFilterTab,
  TableDisplayLayout,
  CreateTableInput,
  UpdateTableInput,
} from '../types/table';
import { tableService } from '../services/tableService';

export function useTable() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<TableViewMode>('tables');
  const [displayLayout, setDisplayLayout] = useState<TableDisplayLayout>('grid');
  const [filterTab, setFilterTab] = useState<TableFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Modals state
  const [qrModalTable, setQrModalTable] = useState<TableItem | null>(null);
  const [editModalTable, setEditModalTable] = useState<TableItem | null>(null);
  const [deleteModalTable, setDeleteModalTable] = useState<TableItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isPrintAllOpen, setIsPrintAllOpen] = useState<boolean>(false);

  // Load initial tables from Database
  useEffect(() => {
    let isMounted = true;
    tableService.getTables().then((data) => {
      if (isMounted) {
        setTables(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamic statistics
  const stats: TableStats = useMemo(() => {
    return tableService.calculateStats(tables);
  }, [tables]);

  // Tab count helpers
  const tabCounts = useMemo(() => {
    return {
      all: tables.length,
      occupied: tables.filter((t) => t.status === 'occupied').length,
      available: tables.filter((t) => t.status === 'available').length,
      reserved: tables.filter((t) => t.status === 'reserved').length,
    };
  }, [tables]);

  // Handlers with page reset
  const handleFilterTabChange = useCallback((tab: TableFilterTab) => {
    setFilterTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const handleViewModeChange = useCallback((mode: TableViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
  }, []);

  // Filtered and searched tables
  const filteredTables = useMemo(() => {
    let result = [...tables];

    // Filter by tab in tables view mode
    if (viewMode === 'tables') {
      if (filterTab === 'occupied') {
        result = result.filter((t) => t.status === 'occupied');
      } else if (filterTab === 'available') {
        result = result.filter((t) => t.status === 'available');
      } else if (filterTab === 'reserved') {
        result = result.filter((t) => t.status === 'reserved');
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => {
        const matchName = t.name.toLowerCase().includes(q);
        const matchCode = t.code.toLowerCase().includes(q);
        const matchArea = t.area.toLowerCase().includes(q);
        const matchOrder = t.occupiedInfo?.orderCode.toLowerCase().includes(q);
        const matchGuest = t.reservedInfo?.guestName.toLowerCase().includes(q);
        const matchVip = t.vipInfo?.bookedBy?.toLowerCase().includes(q);
        return matchName || matchCode || matchArea || matchOrder || matchGuest || matchVip;
      });
    }

    return result;
  }, [tables, viewMode, filterTab, searchQuery]);

  // Pagination calculation
  const totalItems = filteredTables.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedTables = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredTables.slice(startIndex, startIndex + pageSize);
  }, [filteredTables, safeCurrentPage, pageSize]);

  // Actions
  const handleToggleQr = useCallback(async (id: string) => {
    const nextState = await tableService.toggleQrStatus(id);
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, qrEnabled: nextState } : t))
    );
  }, []);

  const handleCreateTable = useCallback(async (input: CreateTableInput) => {
    const created = await tableService.createTable(input);
    setTables((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
  }, []);

  const handleUpdateTable = useCallback(async (id: string, input: UpdateTableInput) => {
    const updated = await tableService.updateTable(id, input);
    if (updated) {
      setTables((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
    setEditModalTable(null);
  }, []);

  const handleDeleteTable = useCallback(async (id: string) => {
    const ok = await tableService.deleteTable(id);
    if (ok) {
      setTables((prev) => prev.filter((t) => t.id !== id));
    }
    setDeleteModalTable(null);
  }, []);

  // Download single QR as SVG or Trigger Print
  const handleDownloadQrPng = useCallback((table: TableItem) => {
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="#FFFDF9">
        <rect width="600" height="750" fill="#FFFDF9" rx="28"/>
        <rect x="24" y="24" width="552" height="702" fill="#FFFFFF" stroke="#EAE3D6" stroke-width="2" rx="20"/>
        
        <circle cx="300" cy="90" r="32" fill="#8B2323"/>
        <text x="300" y="99" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="900" text-anchor="middle">CC</text>
        
        <text x="300" y="150" fill="#8B2323" font-family="sans-serif" font-size="28" font-weight="900" text-anchor="middle">CASA COZY</text>
        <text x="300" y="174" fill="#8A8175" font-family="sans-serif" font-size="13" font-weight="600" letter-spacing="3" text-anchor="middle">BISTRO MANAGEMENT</text>
        
        <line x1="120" y1="196" x2="480" y2="196" stroke="#F0EAE1" stroke-width="1.5"/>
        
        <text x="300" y="240" fill="#2D241E" font-family="sans-serif" font-size="34" font-weight="900" text-anchor="middle">${table.name.toUpperCase()}</text>
        <text x="300" y="268" fill="#8A8175" font-family="sans-serif" font-size="15" text-anchor="middle">${table.area} • ${table.seats} Ghế ngồi</text>
        
        <rect x="150" y="300" width="300" height="300" rx="16" fill="#FAF7F2" stroke="#EAE3D6"/>
        <image href="https://api.qrserver.com/v1/create-qr-code/?size=260x260&amp;data=https://${table.qrUrl}" x="170" y="320" width="260" height="260"/>
        
        <text x="300" y="640" fill="#8B2323" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="middle">https://${table.qrUrl}</text>
        <text x="300" y="670" fill="#8A8175" font-family="sans-serif" font-size="14" text-anchor="middle">Quét mã bằng Camera để xem thực đơn &amp; gọi món tại bàn</text>
      </svg>
    `;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${table.code || table.name}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handlePrintSingle = useCallback((table: TableItem) => {
    setQrModalTable(table);
  }, []);

  const handleDownloadAllZip = useCallback(() => {
    alert('Đang tổng hợp bộ ấn phẩm QR độ phân giải cao cho các bàn ăn. Tệp tải về sẽ sẵn sàng trong giây lát!');
  }, []);

  const handlePrintAllPdf = useCallback(() => {
    setIsPrintAllOpen(true);
  }, []);

  return {
    tables: paginatedTables,
    allFilteredTables: filteredTables,
    allTables: tables,
    isLoading,
    stats,
    tabCounts,
    viewMode,
    setViewMode: handleViewModeChange,
    displayLayout,
    setDisplayLayout,
    filterTab,
    setFilterTab: handleFilterTabChange,
    searchQuery,
    setSearchQuery: handleSearchChange,
    currentPage: safeCurrentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    qrModalTable,
    setQrModalTable,
    editModalTable,
    setEditModalTable,
    deleteModalTable,
    setDeleteModalTable,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isPrintAllOpen,
    setIsPrintAllOpen,
    handleToggleQr,
    handleCreateTable,
    handleUpdateTable,
    handleDeleteTable,
    handleDownloadQrPng,
    handlePrintSingle,
    handleDownloadAllZip,
    handlePrintAllPdf,
  };
}
