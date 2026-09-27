'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { addJurnalItem, saveJurnalItem, deleteJurnalItem, toggleJurnalVisible } from '../actions';
import ImageUpload from '../components/ImageUpload';
import Pagination from '../components/Pagination';

const PAGE_SIZE = 10;

export default function JurnalForm({ jurnal: initialJurnal }) {
  const [jurnal, setJurnal] = useState(initialJurnal);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState('');

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return jurnal.slice(start, start + PAGE_SIZE);
  }, [jurnal, currentPage]);

  const saveStatus = () => {
    setStatus('Tersimpan!');
    setTimeout(() => setStatus(''), 2000);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(async () => {
      await addJurnalItem(new FormData(e.target));
      setShowAdd(false);
      saveStatus();
    });
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    startTransition(async () => {
      await saveJurnalItem(id, new FormData(e.target));
      setEditId(null);
      saveStatus();
    });
  };

  const handleDelete = (id) => {
    if (!confirm('Hapus jurnal ini?')) return;
    startTransition(async () => {
      await deleteJurnalItem(id);
      setJurnal((prev) => prev.filter((j) => j.id !== id));
    });
  };

  const handleToggle = (id) => {
    startTransition(async () => {
      await toggleJurnalVisible(id);
      setJurnal((prev) =>
        prev.map((j) => (j.id === id ? { ...j, visible: !j.visible } : j))
      );
    });
  };

  return (
    <div>
      {status && <div className="adminAlert adminAlertSuccess">{status}</div>}

      <div style={{ marginBottom: 20 }}>
        <button
          className="adminBtn adminBtnPrimary"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? 'Batal' : '+ Tambah Jurnal'}
        </button>
      </div>

      {showAdd && (
        <div className="adminCard" style={{ padding: '24px', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>Tambah Jurnal Baru</h3>
          <form onSubmit={handleAdd} className="adminForm">
            <JurnalFields item={null} />
            <div className="adminFormActions">
              <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="adminCard">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Edisi</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{item.title}</td>
                  <td>{item.edition}</td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className={`adminToggle ${item.visible ? 'adminToggleOn' : ''}`}
                      onClick={() => handleToggle(item.id)}
                      disabled={isPending}
                    >
                      {item.visible ? 'Tampil' : 'Tersembunyi'}
                    </button>
                  </td>
                  <td>
                    <div className="adminActionGroup">
                      <button
                        className="adminBtn adminBtnSmall adminBtnSecondary"
                        onClick={() => setEditId(editId === item.id ? null : item.id)}
                      >
                        {editId === item.id ? 'Tutup' : 'Edit'}
                      </button>
                      <button
                        className="adminBtn adminBtnSmall adminBtnDanger"
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                {editId === item.id && (
                  <tr key={`edit-${item.id}`}>
                    <td colSpan={5} style={{ background: '#f8faff', padding: 20 }}>
                      <form onSubmit={(e) => handleEdit(e, item.id)} className="adminForm">
                        <JurnalFields item={item} />
                        <div className="adminFormActions">
                          <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
                            {isPending ? 'Menyimpan...' : 'Simpan'}
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <Pagination
          totalItems={jurnal.length}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function JurnalFields({ item }) {
  return (
    <>
      <div className="adminFormRow">
        <div className="adminFormGroup">
          <label>Judul</label>
          <input name="title" defaultValue={item?.title || ''} required placeholder="AKSES Nusantara Edisi 36" />
        </div>
        <div className="adminFormGroup">
          <label>Edisi</label>
          <input name="edition" defaultValue={item?.edition || ''} placeholder="Edisi 36" />
        </div>
      </div>
      <div className="adminFormRow">
        <div className="adminFormGroup">
          <label>Tanggal</label>
          <input name="date" defaultValue={item?.date || ''} placeholder="Maret 2026" />
        </div>
        <div className="adminFormGroup">
          <label>Topik</label>
          <input name="topic" defaultValue={item?.topic || ''} placeholder="Transportasi Publik" />
        </div>
      </div>
      <div className="adminFormGroup">
        <label>Deskripsi</label>
        <textarea name="description" defaultValue={item?.description || ''} rows={3} />
      </div>
      <div className="adminFormRow">
        <div className="adminFormGroup">
          <label>Cover (upload atau tempel URL)</label>
          <ImageUpload name="cover" defaultValue={item?.cover || ''} />
        </div>
        <div className="adminFormGroup">
          <label>URL Download</label>
          <input name="downloadUrl" defaultValue={item?.downloadUrl || '#'} />
        </div>
      </div>
    </>
  );
}
