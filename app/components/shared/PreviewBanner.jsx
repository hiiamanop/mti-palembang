'use client';

import { X, Eye } from 'lucide-react';

export default function PreviewBanner({ onExit }) {
  const handleClose = () => {
    if (onExit) {
      onExit();
      return;
    }
    if (typeof window !== 'undefined') {
      if (window.opener) {
        window.close();
      } else {
        const url = new URL(window.location.href);
        url.searchParams.delete('preview');
        window.location.href = url.pathname + url.search;
      }
    }
  };

  return (
    <aside
      aria-label="Mode Pratinjau Draf"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: '#fef3c7',
        borderBottom: '2px solid #f59e0b',
        color: '#92400e',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, fontWeight: 700 }}>
        <Eye size={18} style={{ color: '#d97706', flexShrink: 0 }} />
        <span>
          <strong>MODE PRATINJAU DRAFT</strong> &mdash; Halaman ini merender draf yang sedang diedit dan{' '}
          <u>belum tayang ke publik</u>.
        </span>
      </div>

      <button
        type="button"
        onClick={handleClose}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#d97706',
          color: '#ffffff',
          border: 'none',
          padding: '6px 14px',
          borderRadius: 6,
          fontSize: 12.5,
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        <X size={14} />
        Tutup Pratinjau
      </button>
    </aside>
  );
}
