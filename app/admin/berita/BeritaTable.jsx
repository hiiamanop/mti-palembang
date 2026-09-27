'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Edit } from 'lucide-react';
import { BeritaToggle, BeritaDelete } from './BeritaActions';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

export default function BeritaTable({ initialBerita = [] }) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialBerita.filter((item) => {
      return !q || item.title?.toLowerCase().includes(q) || item.cat?.toLowerCase().includes(q) || item.excerpt?.toLowerCase().includes(q);
    });
  }, [initialBerita, query]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: 280, flex: '1 1 280px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari judul atau kategori berita..."
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 13.5, background: '#fff' }}
          />
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          Menampilkan <strong>{filtered.length}</strong> berita
        </div>
      </div>

      <div className="adminCard" style={{ overflowX: 'auto' }}>
        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 70 }}>Gambar</th>
              <th>Judul Berita</th>
              <th style={{ width: 120 }}>Kategori</th>
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
                    {item.img ? (
                      <img
                        src={item.img}
                        alt=""
                        style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 6, display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: 60, height: 45, background: '#f0f2f8', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
                        NO FOTO
                      </div>
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/berita/${item.id}`} className="adminTableLink">
                      {item.title}
                    </Link>
                    {item.excerpt ? (
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.excerpt}
                      </div>
                    ) : null}
                  </td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 4 }}>
                      {item.cat}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>{item.date || '—'}</td>
                  <td>
                    <BeritaToggle id={item.id} published={item.published} />
                  </td>
                  <td>
                    <div className="adminActionGroup">
                      <Link
                        href={`/admin/berita/${item.id}`}
                        className="adminBtn adminBtnSmall adminBtnSecondary"
                      >
                        <Edit size={13} style={{ marginRight: 4 }} />
                        Edit
                      </Link>
                      <BeritaDelete id={item.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  Tidak ada berita yang ditemukan.
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
    </div>
  );
}
