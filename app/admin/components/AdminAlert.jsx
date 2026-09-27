'use client';

import { CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function AdminAlert({ type = 'success', message, linkHref, linkLabel = 'Lihat Halaman Publik' }) {
  if (!message) return null;
  const isSuccess = type === 'success';

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '12px 18px',
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 14,
        fontWeight: 600,
        background: isSuccess ? '#ecfdf5' : '#fef2f2',
        border: `1.5px solid ${isSuccess ? '#a7f3d0' : '#fecaca'}`,
        color: isSuccess ? '#065f46' : '#991b1b',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isSuccess ? (
          <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
        ) : (
          <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
        )}
        <span>{message}</span>
      </div>

      {isSuccess && linkHref ? (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 6,
            background: '#065f46',
            color: '#ffffff',
            fontSize: 12.5,
            fontWeight: 800,
            textDecoration: 'none'
          }}
        >
          {linkLabel}
          <ExternalLink size={13} />
        </a>
      ) : null}
    </div>
  );
}
