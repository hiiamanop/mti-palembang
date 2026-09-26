'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ORGANIZATION_GROUPS } from '../../../lib/organization-structure';
import { saveStrukturOrganisasi } from '../actions';

const GROUP_LABELS = {
  advisory: '1. Dewan Pembina',
  experts: '2. Majelis Pakar',
  leadership: '3. Pengurus Harian',
  divisions: '4. Bidang Teknis'
};

export default function StrukturOrganisasiForm({ names = {} }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('');
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await saveStrukturOrganisasi(formData);
      if (result?.error) {
        setStatus(result.error);
        return;
      }
      setStatus('Tersimpan!');
      router.refresh();
      setTimeout(() => setStatus(''), 2500);
    });
  };

  const isError = status && status !== 'Tersimpan!';

  return (
    <div>
      {status ? (
        <div className={`adminAlert ${isError ? 'adminAlertError' : 'adminAlertSuccess'}`}>
          {status}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="adminForm">
        {Object.entries(ORGANIZATION_GROUPS).map(([groupKey, positions]) => (
          <div className="adminCard" style={{ padding: 24, marginBottom: 24 }} key={groupKey}>
            <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{GROUP_LABELS[groupKey]}</h3>
            <p style={{ margin: '0 0 20px', color: '#667085', fontSize: 13.5 }}>
              Jabatan telah ditetapkan secara baku. Anda hanya perlu mengisi nama lengkap pengurus.
              (Jika dikosongkan, nama akan otomatis tampil sebagai tanda &ldquo;—&rdquo; di halaman publik).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {positions.map((pos) => (
                <div className="adminFormGroup" key={pos.key} style={{ margin: 0 }}>
                  <label htmlFor={pos.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span>{pos.role}</span>
                    {pos.badge ? (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          background: '#eef2fb',
                          color: '#112e81',
                          padding: '2px 6px',
                          borderRadius: 4
                        }}
                      >
                        {pos.badge}
                      </span>
                    ) : null}
                  </label>
                  <input
                    id={pos.key}
                    name={pos.key}
                    defaultValue={names[pos.key] || ''}
                    placeholder="Nama lengkap..."
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="adminFormActions" style={{ position: 'sticky', bottom: 20, zIndex: 10, background: '#ffffff', padding: '16px 20px', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' }}>
          <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending} style={{ padding: '12px 28px' }}>
            {isPending ? 'Menyimpan...' : 'Simpan Struktur Organisasi'}
          </button>
        </div>
      </form>
    </div>
  );
}
