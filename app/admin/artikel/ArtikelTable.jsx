'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2 } from 'lucide-react';
import { toggleArtikelVisible, deleteArtikelItem } from '../actions';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import AdminAlert from '../components/AdminAlert';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;
const CATEGORIES = ['Semua', 'Opini', 'Berita Wilayah', 'Analisis'];

export default function ArtikelTable({ initialArtikel = [] }) {
  const [artikel, setArtikel] = useState(initialArtikel);
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    return artikel.filter((item) => {
      const matchCat =
        selectedCat === 'Semua' || (item.kategori && item.kategori.toLowerCase() === selectedCat.toLowerCase());
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q || item.title?.toLowerCase().includes(q) || item.ringkasan?.toLowerCase().includes(q) || item.daerah?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [artikel, selectedCat, search]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleToggle = (item) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleArtikelVisible(item.id);
      if (res?.error) {
        setFeedback({ type: 'error', message: res.error });
        return;
      }
      setArtikel((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, visible: !a.visible } : a))
      );
      setFeedback({
        type: 'success',
        message: `Status artikel berhasil diubah (${!item.visible ? 'Tampil di Website' : 'Disembunyikan'})`,
        linkHref: '/artikel'
      });
      router.refresh();
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteArtikelItem(deleteTarget.id);
      if (res?.error) {
        setFeedback({ type: 'error', message: res.error });
      } else {
        setArtikel((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setFeedback({ type: 'success', message: 'Artikel berhasil dihapus.' });
      }
      setDeleteTarget(null);
      router.refresh();
    });
  };

  return (
    <div>
      <AdminAlert {...feedback} />

      {/* ── Toolbar: Filter Kategori & Search ── */}
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
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCat(cat);
                setCurrentPage(1);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: selectedCat === cat ? '#112e81' : '#cbd5e1',
                background: selectedCat === cat ? '#112e81' : '#ffffff',
                color: selectedCat === cat ? '#ffffff' : '#475569'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 260, flex: '1 1 260px' }}>
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
            placeholder="Cari judul atau topik artikel..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: 8,
              border: '1.5px solid #cbd5e1',
              fontSize: 13,
              background: '#fff'
            }}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adminCard" style={{ overflowX: 'auto' }}>
        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Cover</th>
              <th>Judul Artikel</th>
              <th style={{ width: 120 }}>Kategori</th>
              <th style={{ width: 120 }}>Daerah / Penulis</th>
              <th style={{ width: 130 }}>Tanggal</th>
              <th style={{ width: 140 }}>Status Tampilan</th>
              <th style={{ width: 130 }}>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.gambar ? (
                      <img
                        src={item.gambar}
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
                        NO COVER
                      </div>
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/admin/artikel/${item.id}`}
                      style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}
                    >
                      {item.title}
                    </Link>
                    {item.ringkasan ? (
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
                        {item.ringkasan}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
                      {item.kategori}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#475569' }}>{item.daerah || '—'}</td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>{item.date || '—'}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      disabled={isPending}
                      className={`adminToggle ${item.visible ? 'adminToggleOn' : ''}`}
                    >
                      {item.visible ? '✓ Tampil di Web' : 'Disembunyikan'}
                    </button>
                  </td>
                  <td>
                    <div className="adminActionGroup">
                      <Link
                        href={`/admin/artikel/${item.id}`}
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
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  Tidak ada artikel yang ditemukan.
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
        title="Hapus Artikel"
        itemName={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isPending={isPending}
      />
    </div>
  );
}
