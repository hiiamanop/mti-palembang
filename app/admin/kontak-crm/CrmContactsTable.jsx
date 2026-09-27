'use client';

import { useMemo, useState, useTransition } from 'react';
import { Mail, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteCrmContact, updateCrmContactStatus } from '../actions';
import AdminAlert from '../components/AdminAlert';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const FILTERS = [
  ['semua', 'Semua'],
  ['baru', 'Baru'],
  ['sudah_dihubungi', 'Sudah Dihubungi'],
  ['selesai', 'Selesai']
];

const STATUS_LABELS = {
  baru: 'Baru',
  sudah_dihubungi: 'Sudah Dihubungi',
  selesai: 'Selesai'
};

function EmailBadge({ status }) {
  const good = status === 'terkirim';
  const pending = status === 'pending';
  return (
    <span className={`adminBadge ${good ? 'adminBadgeGreen' : 'adminBadgeGray'}`} style={!good && !pending ? { background: '#fef2f2', color: '#b91c1c' } : undefined}>
      {good ? 'Terkirim' : pending ? 'Menunggu' : 'Gagal'}
    </span>
  );
}

export default function CrmContactsTable({ initialContacts = [] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [filter, setFilter] = useState('semua');
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((contact) => {
      const statusMatch = filter === 'semua' || contact.status === filter;
      const queryMatch =
        !q ||
        contact.name.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.institution.toLowerCase().includes(q);
      return statusMatch && queryMatch;
    });
  }, [contacts, filter, query]);

  function changeStatus(contact, status) {
    setFeedback(null);
    startTransition(async () => {
      const result = await updateCrmContactStatus(contact.id, status);
      if (result?.error) {
        setFeedback({ type: 'error', message: result.error });
        return;
      }
      setContacts((current) => current.map((item) => (item.id === contact.id ? { ...item, status } : item)));
      setFeedback({ type: 'success', message: `Status ${contact.name} diubah menjadi ${STATUS_LABELS[status]}.` });
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteCrmContact(deleteTarget.id);
      if (result?.error) setFeedback({ type: 'error', message: result.error });
      else {
        setContacts((current) => current.filter((item) => item.id !== deleteTarget.id));
        setFeedback({ type: 'success', message: 'Kontak CRM berhasil dihapus.' });
      }
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div>
      <AdminAlert {...feedback} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`adminBtn adminBtnSmall ${filter === value ? 'adminBtnPrimary' : 'adminBtnSecondary'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', minWidth: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, email, atau institusi..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 13.5 }}
          />
        </div>
      </div>

      <div className="adminCard" style={{ overflowX: 'auto' }}>
        <table className="adminTable">
          <thead>
            <tr>
              <th>Kontak</th>
              <th>Institusi</th>
              <th>Waktu Masuk</th>
              <th>Status Tindak Lanjut</th>
              <th>Email Internal</th>
              <th>Konfirmasi Pengirim</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <strong style={{ display: 'block', color: '#0f172a' }}>{contact.name}</strong>
                  <a href={`mailto:${contact.email}`} style={{ color: '#2563eb', fontSize: 12.5 }}>{contact.email}</a>
                </td>
                <td>{contact.institution}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(contact.created_at).toLocaleString('id-ID')}</td>
                <td>
                  <select
                    value={contact.status}
                    onChange={(event) => changeStatus(contact, event.target.value)}
                    disabled={isPending}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12.5 }}
                  >
                    <option value="baru">Baru</option>
                    <option value="sudah_dihubungi">Sudah Dihubungi</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </td>
                <td><EmailBadge status={contact.internal_email_status} /></td>
                <td><EmailBadge status={contact.confirmation_email_status} /></td>
                <td>
                  <div className="adminActionGroup">
                    <a href={`mailto:${contact.email}`} className="adminBtn adminBtnSmall adminBtnSecondary"><Mail size={13} /> Balas</a>
                    <button type="button" onClick={() => setDeleteTarget(contact)} className="adminBtn adminBtnSmall adminBtnDanger"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Belum ada kontak yang cocok.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Kontak CRM"
        itemName={deleteTarget?.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isPending}
      />
    </div>
  );
}
