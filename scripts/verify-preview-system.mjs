import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

// 1. Verify files exist
await access(new URL('../lib/preview-storage.js', import.meta.url));
await access(new URL('../app/components/shared/PreviewBanner.jsx', import.meta.url));
await access(new URL('../app/admin/components/AdminAlert.jsx', import.meta.url));
await access(new URL('../app/admin/components/ConfirmDeleteModal.jsx', import.meta.url));
await access(new URL('../app/admin/components/useUnsavedChanges.js', import.meta.url));

// 2. Verify preview-storage exports
const previewSource = await readFile(new URL('../lib/preview-storage.js', import.meta.url), 'utf8');
assert.ok(previewSource.includes('export function savePreviewDraft'), 'must export savePreviewDraft');
assert.ok(previewSource.includes('export function loadPreviewDraft'), 'must export loadPreviewDraft');
assert.ok(previewSource.includes('export function clearPreviewDraft'), 'must export clearPreviewDraft');

// 3. Verify PreviewBanner markup
const bannerSource = await readFile(new URL('../app/components/shared/PreviewBanner.jsx', import.meta.url), 'utf8');
assert.ok(bannerSource.includes('MODE PRATINJAU'), 'PreviewBanner must mention MODE PRATINJAU');

console.log('Preview system and admin feedback components contract verified.');
