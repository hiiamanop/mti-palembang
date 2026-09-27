'use client';

import { useState } from 'react';
import { uploadImage } from '../actions';
import { IMAGE_MAX_LABEL, IMAGE_TYPES, validateImage } from '../../../lib/image-upload';

const POSITIONS = [
  { label: 'Tengah (Default)', val: 'center center' },
  { label: 'Atas', val: 'center top' },
  { label: 'Bawah', val: 'center bottom' },
  { label: 'Kiri', val: 'left center' },
  { label: 'Kanan', val: 'right center' }
];

export default function ImageUpload({
  name,
  defaultValue = '',
  withPosition = false,
  positionName = 'imagePosition',
  defaultPosition = 'center center',
  previewTitle = 'Judul Banner Halaman'
}) {
  const [url, setUrl] = useState(defaultValue);
  const [position, setPosition] = useState(defaultPosition || 'center center');
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
      {withPosition && <input type="hidden" name={positionName} value={position} />}

      <input
        type="file"
        accept={IMAGE_TYPES.join(',')}
        onChange={handleFile}
        disabled={busy}
      />
      <small style={{ display: 'block', marginTop: 6 }}>
        Format JPG, PNG, atau WebP. Maksimal {IMAGE_MAX_LABEL}.
      </small>
      {busy && <small style={{ color: '#2563eb', fontWeight: 700 }}> Mengupload...</small>}
      {err && <div className="adminAlert adminAlertError">{err}</div>}

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="atau tempel URL gambar langsung di sini"
        style={{ display: 'block', width: '100%', marginTop: 8 }}
      />

      {/* ── Position Selector & Mini Hero Preview (untuk Hero Banners) ── */}
      {withPosition && (
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Posisi Fokus Gambar (Focal Alignment)
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {POSITIONS.map((pos) => (
              <button
                key={pos.val}
                type="button"
                onClick={() => setPosition(pos.val)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: position === pos.val ? '#112e81' : '#cbd5e1',
                  background: position === pos.val ? '#112e81' : '#ffffff',
                  color: position === pos.val ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease'
                }}
              >
                {pos.label}
              </button>
            ))}
          </div>

          {url ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Pratinjau Tampilan Hero Banner (Posisi: <strong style={{ color: '#112e81' }}>{position}</strong>):
              </div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 140,
                  borderRadius: 10,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 24px',
                  border: '1px solid #cbd5e1',
                  background: '#0b1330'
                }}
              >
                <img
                  src={url}
                  alt="hero preview"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: position,
                    zIndex: 1
                  }}
                />
                <span className="dialogHeroShade" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                <div style={{ position: 'relative', zIndex: 3, color: '#ffffff' }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      background: 'rgba(255,255,255,0.2)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      display: 'inline-block',
                      marginBottom: 4,
                      textTransform: 'uppercase'
                    }}
                  >
                    Label
                  </span>
                  <div style={{ fontSize: 16, fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.6)', lineHeight: 1.2 }}>
                    {previewTitle}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 4px rgba(0,0,0,0.6)', marginTop: 2 }}>
                    Teks deskripsi pengantar di atas latar bayangan cerah...
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Standard Image Thumbnail (ketika without position) ── */}
      {url && !withPosition && (
        <img
          src={url}
          alt="preview"
          style={{ display: 'block', maxWidth: 180, maxHeight: 110, marginTop: 8, borderRadius: 6, objectFit: 'cover' }}
        />
      )}
    </div>
  );
}
