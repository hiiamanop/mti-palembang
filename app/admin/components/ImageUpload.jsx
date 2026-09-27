'use client';

import { useState } from 'react';
import { uploadImage } from '../actions';
import { IMAGE_MAX_LABEL, IMAGE_TYPES, validateImage } from '../../../lib/image-upload';

export default function ImageUpload({ name, defaultValue = '' }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImage(file);
    if (validationError) {
      setErr(validationError);
      e.target.value = '';
      return;
    }

    setBusy(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadImage(fd);
      if (res?.error) {
        setErr(`Upload gagal: ${res.error}`);
        return;
      }
      setUrl(res.url);
    } catch {
      setErr('Upload gagal karena koneksi atau server bermasalah. Silakan coba kembali.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adminUpload">
      <input type="hidden" name={name} value={url} />
      <input
        type="file"
        accept={IMAGE_TYPES.join(',')}
        onChange={handleFile}
        disabled={busy}
      />
      <small style={{ display: 'block', marginTop: 6 }}>
        Format JPG, PNG, atau WebP. Maksimal {IMAGE_MAX_LABEL}.
      </small>
      {busy && <small> Mengupload...</small>}
      {err && <div className="adminAlert adminAlertError">{err}</div>}
      {url && (
        <img
          src={url}
          alt="preview"
          style={{ display: 'block', maxWidth: 160, marginTop: 8, borderRadius: 6, objectFit: 'cover' }}
        />
      )}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="atau tempel URL gambar"
        style={{ display: 'block', width: '100%', marginTop: 6 }}
      />
    </div>
  );
}
