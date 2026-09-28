import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteConfig = await readFile(new URL('../lib/site-config.js', import.meta.url), 'utf8');
assert.ok(siteConfig.includes("label: 'Artikel & Berita'"));
assert.equal(siteConfig.includes("label: 'Artikel & Opini'"), false);

const editor = await readFile(new URL('../app/admin/artikel/ArtikelEditorForm.jsx', import.meta.url), 'utf8');
assert.ok(editor.includes('<option value="Artikel">Artikel</option>'));
assert.ok(editor.includes('<option value="Berita">Berita</option>'));
assert.equal(editor.includes('<option value="Analisis">'), false);
assert.ok(editor.includes('Pratinjau Langsung'));
assert.ok(editor.includes('<RichTextEditor'));

const newsEditor = await readFile(new URL('../app/admin/berita/[id]/BeritaForm.jsx', import.meta.url), 'utf8');
assert.ok(newsEditor.includes('<RichTextEditor'));
const actions = await readFile(new URL('../app/admin/actions.js', import.meta.url), 'utf8');
assert.ok(actions.includes('function parseParagraphs'));
assert.ok(actions.includes("kategori: rawCat === 'Berita' ? 'Berita' : 'Artikel'"));

const sidebar = await readFile(new URL('../app/admin/AdminSidebar.jsx', import.meta.url), 'utf8');
assert.ok(sidebar.includes('/images/mti-logo-emblem.png'));
assert.ok(sidebar.includes('Artikel & Berita'));

console.log('Article & Berita editor, rich text paragraphs, live preview, and CMS logo contract verified.');
