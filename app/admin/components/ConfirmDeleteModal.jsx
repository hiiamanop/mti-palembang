'use client';

import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  title = 'Konfirmasi Hapus',
  itemName = '',
  onConfirm,
  onCancel,
  isPending = false
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 14,
          maxWidth: 440,
          width: '100%',
          padding: 24,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#dc2626' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <h3 id="delete-dialog-title" style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ margin: '0 0 8px', fontSize: 14.5, color: '#334155', lineHeight: 1.5 }}>
          Apakah Anda yakin ingin menghapus <strong>&ldquo;{itemName || 'item ini'}&rdquo;</strong>?
        </p>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: '#64748b' }}>
          Tindakan ini permanen dan konten akan langsung terhapus dari database serta website publik.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            style={{
              padding: '9px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: 13.5,
              fontWeight: 800,
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            {isPending ? 'Menghapus...' : 'Ya, Hapus Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
