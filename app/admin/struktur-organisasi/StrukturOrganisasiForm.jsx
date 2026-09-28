'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ORGANIZATION_GROUPS } from '../../../lib/organization-structure';
import { saveStrukturOrganisasi } from '../actions';

const GROUP_LABELS = {
  direction: '1. Pengarah',
  daily: '2. Pengurus Harian',
  organization: '3. Bidang Organisasi',
  special: '4. Bidang Khusus',
  secretariat: '5. Sekretariat'
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
      setStatus('Tersimpan! Struktur organisasi sudah tampil di website publik.');
      router.refresh();
      setTimeout(() => setStatus(''), 3000);
    });
  };

  const isError = status && !status.startsWith('Tersimpan!');

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
              Jabatan sudah ditetapkan. Isi satu nama lengkap untuk setiap jabatan. Nama kosong tetap
              tampil sebagai tanda &ldquo;—&rdquo; di halaman publik.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 16
              }}
            >
              {positions.map((pos) => (
                <div className="adminFormGroup" key={pos.key} style={{ margin: 0 }}>
                  <label htmlFor={pos.key} style={{ fontSize: 13 }}>
                    {pos.role}
                  </label>
                  <input
                    id={pos.key}
                    name={pos.key}
                    defaultValue={names[pos.key] || ''}
                    placeholder={`Nama lengkap ${pos.role}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div
          className="adminFormActions"
          style={{
            position: 'sticky',
            bottom: 20,
            zIndex: 10,
            background: '#ffffff',
            padding: '16px 20px',
            borderRadius: 12,
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            border: '1px solid #e2e8f0'
          }}
        >
          <button
            type="submit"
            className="adminBtn adminBtnPrimary"
            disabled={isPending}
            style={{ padding: '12px 28px' }}
          >
            {isPending ? 'Menyimpan...' : 'Simpan 17 Posisi Struktur Organisasi'}
          </button>
        </div>
      </form>
    </div>
  );
}
