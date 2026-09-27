'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  totalItems = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) return null;

  // Build page numbers array (up to 7 items with clean sliding window)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="adminPagination">
      <div className="adminPaginationInfo">
        Menampilkan <strong>{startItem}</strong> &ndash; <strong>{endItem}</strong> dari <strong>{totalItems}</strong> data
      </div>

      {totalPages > 1 ? (
        <div className="adminPaginationButtons">
          <button
            type="button"
            className="adminPageBtn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={15} />
            <span className="desktopOnly">Sebelumnya</span>
          </button>

          {pages.map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="adminPageEllipsis">
                &hellip;
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`adminPageBtn ${currentPage === p ? 'adminPageBtnActive' : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={currentPage === p ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            className="adminPageBtn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Halaman selanjutnya"
          >
            <span className="desktopOnly">Selanjutnya</span>
            <ChevronRight size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
