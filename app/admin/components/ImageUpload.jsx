'use client';

import { useState } from 'react';
import { Crosshair } from 'lucide-react';
import { uploadImage } from '../actions';
import { IMAGE_MAX_LABEL, IMAGE_TYPES, validateImage } from '../../../lib/image-upload';

function parsePosition(posStr) {
  if (!posStr) return { x: 50, y: 50 };
  const s = String(posStr).trim().toLowerCase();
  if (s === 'center center' || s === 'center') return { x: 50, y: 50 };
  if (s === 'center top' || s === 'top center' || s === 'top') return { x: 50, y: 0 };
  if (s === 'center bottom' || s === 'bottom center' || s === 'bottom') return { x: 50, y: 100 };
  if (s === 'left center' || s === 'center left' || s === 'left') return { x: 0, y: 50 };
  if (s === 'right center' || s === 'center right' || s === 'right') return { x: 100, y: 50 };
  const parts = s.split(/\s+/);
  if (parts.length === 2) {
    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    if (!isNaN(x) && !isNaN(y)) {
      return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
    }
  }
  return { x: 50, y: 50 };
}

const PRESETS = [
  { label: 'Tengah', x: 50, y: 50 },
  { label: 'Fokus Atas', x: 50, y: 15 },
  { label: 'Paling Atas', x: 50, y: 0 },
  { label: 'Fokus Bawah', x: 50, y: 85 },
  { label: 'Paling Bawah', x: 50, y: 100 },
  { label: 'Kiri', x: 15, y: 50 },
  { label: 'Kanan', x: 85, y: 50 }
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
  const initialPos = parsePosition(defaultPosition);
  const [posX, setPosX] = useState(initialPos.x);
  const [posY, setPosY] = useState(initialPos.y);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const currentPositionStr = `${posX}% ${posY}%`;

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

  const handlePinClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPosX(Math.max(0, Math.min(100, clickX)));
    setPosY(Math.max(0, Math.min(100, clickY)));
  };

  return (
    <div className="adminUpload">
      <input type="hidden" name={name} value={url} />
      {withPosition && <input type="hidden" name={positionName} value={currentPositionStr} />}

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

      {/* ── Pengaturan Manual Posisi Fokus & Live Preview ── */}
      {withPosition && (
        <div
          style={{
            marginTop: 16,
            padding: '18px 20px',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
              <Crosshair size={18} style={{ color: '#112e81' }} />
              <span>Atur Manual Posisi Fokus Gambar (Focal Point)</span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 700,
                background: '#e0e7ff',
                color: '#3730a3',
                padding: '3px 10px',
                borderRadius: 6
              }}
            >
              X: {posX}% &bull; Y: {posY}%
            </span>
          </div>

          {/* Preset Cepat */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {PRESETS.map((p) => {
              const active = posX === p.x && posY === p.y;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setPosX(p.x);
                    setPosY(p.y);
                  }}
                  style={{
                    padding: '5px 11px',
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: active ? '#112e81' : '#cbd5e1',
                    background: active ? '#112e81' : '#ffffff',
                    color: active ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Dual Sliders: Vertikal Y & Horizontal X */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
            {/* Slider Vertikal Y */}
            <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                <span>Geser Posisi Vertikal (Y)</span>
                <span style={{ color: '#112e81' }}>{posY}% {posY <= 30 ? '(Atas)' : posY >= 70 ? '(Bawah)' : '(Tengah)'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                <span>0% (Paling Atas)</span>
                <span>50% (Tengah)</span>
                <span>100% (Paling Bawah)</span>
              </div>
            </div>

            {/* Slider Horizontal X */}
            <div style={{ background: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                <span>Geser Posisi Horizontal (X)</span>
                <span style={{ color: '#112e81' }}>{posX}% {posX <= 30 ? '(Kiri)' : posX >= 70 ? '(Kanan)' : '(Tengah)'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                <span>0% (Paling Kiri)</span>
                <span>50% (Tengah)</span>
                <span>100% (Paling Kanan)</span>
              </div>
            </div>
          </div>

          {url ? (
            <div>
              {/* Petunjuk Klik Pin Interaktif */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
                  🎯 Klik Langsung pada Foto di bawah untuk menentukan titik fokus:
                </span>
                <small style={{ color: '#64748b' }}>Titik merah = titik fokus kamera</small>
              </div>

              {/* Foto Interaktif dengan Pin Crosshair */}
              <div
                onClick={handlePinClick}
                title="Klik di mana saja pada foto ini untuk memindahkan titik fokus"
                style={{
                  position: 'relative',
                  width: '100%',
                  maxHeight: 180,
                  borderRadius: 8,
                  overflow: 'hidden',
                  cursor: 'crosshair',
                  background: '#0f172a',
                  border: '2px solid #cbd5e1',
                  marginBottom: 16
                }}
              >
                <img
                  src={url}
                  alt="interactive pin picker"
                  style={{ width: '100%', height: '100%', maxHeight: 180, objectFit: 'contain', display: 'block', opacity: 0.9 }}
                />
                {/* Pin Target Marker */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: '2.5px solid #ffffff',
                    background: '#dc2626',
                    boxShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 0 3px rgba(220,38,38,0.4)',
                    pointerEvents: 'none'
                  }}
                />
              </div>

              {/* ── Live Banner Preview ── */}
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                Pratinjau Nyata Hero Banner (Tampilan Publik yang Cerah):
              </div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 150,
                  borderRadius: 10,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 28px',
                  border: '1px solid #cbd5e1',
                  background: '#0b1330',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <img
                  src={url}
                  alt="hero preview banner"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: currentPositionStr,
                    zIndex: 1
                  }}
                />
                <span className="dialogHeroShade" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                <div style={{ position: 'relative', zIndex: 3, color: '#ffffff', maxWidth: 540 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: 'rgba(6, 14, 36, 0.45)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: 4,
                      display: 'inline-block',
                      marginBottom: 6,
                      textTransform: 'uppercase'
                    }}
                  >
                    Label Hero
                  </span>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      textShadow: '0 2px 12px rgba(0,0,0,0.65)',
                      lineHeight: 1.25,
                      marginBottom: 4
                    }}
                  >
                    {previewTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '0 1px 6px rgba(0,0,0,0.6)',
                      lineHeight: 1.4
                    }}
                  >
                    Foto tampil lebih cerah di belakang teks judul dengan posisi fokus {posX}% &bull; {posY}%.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#64748b', fontStyle: 'italic' }}>
              Unggah atau masukkan URL gambar di atas untuk melihat simulasi visual dan mengatur posisi fokusnya.
            </p>
          )}
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
