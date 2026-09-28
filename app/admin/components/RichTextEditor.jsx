'use client';

import { useRef } from 'react';
import { Bold, Italic, Heading2, Quote, List, CornerDownLeft, Sparkles } from 'lucide-react';

export default function RichTextEditor({ value = '', onChange, name = 'konten', placeholder = '' }) {
  const textareaRef = useRef(null);

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || 'teks';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const insertParagraphBreak = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const text = textarea.value;
    const replacement = '\n\n';
    const newValue = text.substring(0, start) + replacement + text.substring(start);
    onChange(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2);
    }, 10);
  };

  const paragraphs = String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const wordCount = (value || '').trim() ? (value.trim().match(/\S+/g) || []).length : 0;

  return (
    <div className="adminRichEditor" style={{ border: '1.5px solid #cbd5e1', borderRadius: 10, background: '#ffffff', overflow: 'hidden' }}>
      {/* ── Visual Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 6,
          padding: '8px 12px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            title="Tebal (Bold)"
            style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
          >
            <Bold size={14} /> Tebal
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            title="Miring (Italic)"
            style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
          >
            <Italic size={14} /> Miring
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n## ', '\n')}
            title="Subjudul (H2)"
            style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
          >
            <Heading2 size={14} /> Subjudul
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n> ', '\n')}
            title="Kutipan Poin"
            style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
          >
            <Quote size={14} /> Kutipan
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n• ', '\n')}
            title="Daftar Poin"
            style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
          >
            <List size={14} /> Poin
          </button>
          <button
            type="button"
            onClick={insertParagraphBreak}
            title="Pisah Paragraf Baru"
            style={{ padding: '6px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
          >
            <CornerDownLeft size={13} /> + Paragraf Baru
          </button>
        </div>

        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>
          {paragraphs.length} Paragraf &bull; {wordCount} Kata
        </div>
      </div>

      {/* ── Textarea ── */}
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 16px',
          border: 'none',
          outline: 'none',
          fontSize: 14.5,
          lineHeight: 1.7,
          color: '#1e293b',
          resize: 'vertical',
          boxSizing: 'border-box',
          fontFamily: 'inherit'
        }}
      />

      <div style={{ padding: '8px 14px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b' }}>
        💡 <strong>Panduan Paragraf:</strong> Tekan <strong>Enter</strong> satu kali atau gunakan tombol <strong>+ Paragraf Baru</strong>. Setiap jeda baris otomatis dirender sebagai paragraf terpisah di halaman baca.
      </div>
    </div>
  );
}
