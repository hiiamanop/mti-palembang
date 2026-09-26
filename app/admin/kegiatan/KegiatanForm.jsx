'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  addKegiatanItem,
  deleteKegiatanItem,
  saveKegiatanItem,
  toggleKegiatanPublished
} from '../actions';
import ImageUpload from '../components/ImageUpload';

export default function KegiatanForm({ kegiatan }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function run(action, onSuccess) {
    setStatus('');
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setStatus(result.error);
        return;
      }
      onSuccess?.();
      setStatus('Tersimpan!');
      router.refresh();
    });
  }

  function submitAdd(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(() => addKegiatanItem(formData), () => setShowAdd(false));
  }

  function submitEdit(event, id) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(() => saveKegiatanItem(id, formData), () => setEditId(null));
  }

  function toggle(id) {
    run(() => toggleKegiatanPublished(id));
  }

  function remove(id) {
    if (!confirm('Hapus kegiatan ini?')) return;
    run(() => deleteKegiatanItem(id));
  }

  const isError = status && status !== 'Tersimpan!';

  return (
    <div>
      {status ? (
        <div className={`adminAlert ${isError ? 'adminAlertError' : 'adminAlertSuccess'}`}>
          {status}
        </div>
      ) : null}

      <div style={{ marginBottom: 20 }}>
        <button type="button" className="adminBtn adminBtnPrimary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Batal' : '+ Tambah Kegiatan'}
        </button>
      </div>

      {showAdd ? (
        <div className="adminCard" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>Tambah Kegiatan</h3>
          <form className="adminForm" onSubmit={submitAdd}>
            <KegiatanFields />
            <FormActions isPending={isPending} />
          </form>
        </div>
      ) : null}

      <div className="adminCard">
        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Gambar</th>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kegiatan.map((item) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt="" style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                    ) : '—'}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      type="button"
                      className={`adminToggle ${item.published ? 'adminToggleOn' : ''}`}
                      disabled={isPending}
                      onClick={() => toggle(item.id)}
                    >
                      {item.published ? 'Publik' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <div className="adminActionGroup">
                      <button
                        type="button"
                        className="adminBtn adminBtnSmall adminBtnSecondary"
                        onClick={() => setEditId(editId === item.id ? null : item.id)}
                      >
                        {editId === item.id ? 'Tutup' : 'Edit'}
                      </button>
                      <button
                        type="button"
                        className="adminBtn adminBtnSmall adminBtnDanger"
                        disabled={isPending}
                        onClick={() => remove(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
                {editId === item.id ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 20, background: '#f8faff' }}>
                      <form className="adminForm" onSubmit={(event) => submitEdit(event, item.id)}>
                        <KegiatanFields item={item} />
                        <FormActions isPending={isPending} />
                      </form>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KegiatanFields({ item }) {
  return (
    <>
      <div className="adminFormRow">
        <div className="adminFormGroup">
          <label>Judul</label>
          <input name="title" defaultValue={item?.title || ''} required />
        </div>
        <div className="adminFormGroup">
          <label>Tanggal Kegiatan</label>
          <input name="date" type="date" defaultValue={item?.date || ''} required />
        </div>
      </div>
      <div className="adminFormGroup">
        <label>Gambar</label>
        <ImageUpload name="image" defaultValue={item?.image || ''} />
      </div>
      <div className="adminFormGroup">
        <label>Ringkasan</label>
        <textarea name="summary" defaultValue={item?.summary || ''} rows={4} />
      </div>
    </>
  );
}

function FormActions({ isPending }) {
  return (
    <div className="adminFormActions">
      <button type="submit" className="adminBtn adminBtnPrimary" disabled={isPending}>
        {isPending ? 'Menyimpan...' : 'Simpan'}
      </button>
    </div>
  );
}
