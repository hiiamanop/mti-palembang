'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toggleKegiatanPublished, deleteKegiatanItem } from '../actions';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AdminAlert from '../components/AdminAlert';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

export default function KegiatanTable({ initialKegiatan = [] }) {
  const [kegiatan, setKegiatan] = useState(initialKegiatan);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return kegiatan.filter((item) => {
      return !q || item.title?.toLowerCase().includes(q) || item.summary?.toLowerCase().includes(q);
    });
  }, [kegiatan, search]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleToggle = (item) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleKegiatanPublished(item.id);
      if (res?.error) {
        setFeedback({ type: 'error', message: res.error });
        return;
      }
      setKegiatan((prev) =>
        prev.map((k) => (k.id === item.id ? { ...k, published: !k.published } : k))
      );
      setFeedback({
        type: 'success',
        message: `Status kegiatan berhasil diubah (${!item.published ? 'Tampil di Website' : 'Disembunyikan'})`,
        linkHref: '/kegiatan-mti'
      });
      router.refresh();
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteKegiatanItem(deleteTarget.id);
      if (res?.error) {
        setFeedback({ type: 'error', message: res.error });
      } else {
        setKegiatan((prev) => prev.filter((k) => k.id !== deleteTarget.id));
        setFeedback({ type: 'success', message: 'Kegiatan berhasil dihapus.' });
      }
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div>
      <AdminAlert {...feedback} />

      {/* ── Filter & Search Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', minWidth: 280, flex: '1 1 280px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kegiatan berdasarkan judul..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 13.5,
              background: '#fff'
            }}
          />
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          Menampilkan <strong>{filtered.length}</strong> dari {kegiatan.length} kegiatan
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adminCard" style={{ overflowX: 'auto' }}>
        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Foto</th>
              <th>Judul Kegiatan</th>
              <th style={{ width: 130 }}>Tanggal</th>
              <th style={{ width: 140 }}>Status Tampilan</th>
              <th style={{ width: 140 }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 64,
                          height: 44,
                          background: '#f1f5f9',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: '#94a3b8',
                          fontWeight: 700
                        }}
                      >
                        NO FOTO
                      </div>
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/admin/kegiatan/${item.id}`}
                      style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}
                    >
                      {item.title}
                    </Link>
                    {item.summary ? (
                      <div
                        style={{
                          fontSize: 12.5,
                          color: '#64748b',
                          marginTop: 4,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.summary}
                      </div>
                    ) : null}
                  </td>
                  <td style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{item.date}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      disabled={isPending}
                      className={`adminToggle ${item.published ? 'adminToggleOn' : ''}`}
                      title={item.published ? 'Klik untuk menyembunyikan' : 'Klik untuk menampilkan'}
                    >
                      {item.published ? '✓ Tampil di Web' : 'Disembunyikan'}
                    </button>
                  </td>
                  <td>
                    <div className="adminActionGroup">
                      <Link
                        href={`/admin/kegiatan/${item.id}`}
                        className="adminBtn adminBtnSmall adminBtnSecondary"
                      >
                        <Edit size={13} style={{ marginRight: 4 }} />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="adminBtn adminBtnSmall adminBtnDanger"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  Tidak ada kegiatan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Kegiatan"
        itemName={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isPending}
      />
    </div>
  );
}
