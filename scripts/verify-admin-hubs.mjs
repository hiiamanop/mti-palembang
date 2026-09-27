import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

// 1. Verify files exist
await access(new URL('../app/admin/layout.jsx', import.meta.url));
await access(new URL('../app/admin/tentang-kami/page.jsx', import.meta.url));
await access(new URL('../app/admin/tentang-kami/struktur-organisasi/page.jsx', import.meta.url));
await access(new URL('../app/admin/hero-kegiatan/page.jsx', import.meta.url));

// 2. Verify sidebar contains categorized navigation
const sidebarSource = await readFile(new URL('../app/admin/AdminSidebar.jsx', import.meta.url), 'utf8');
assert.ok(sidebarSource.includes('/admin/tentang-kami'), 'sidebar must link to /admin/tentang-kami');
assert.ok(sidebarSource.includes('/admin/hero-kegiatan'), 'sidebar must link to /admin/hero-kegiatan');
assert.ok(sidebarSource.includes('PENGELOLAAN HALAMAN'), 'sidebar must have PENGELOLAAN HALAMAN section');
assert.ok(sidebarSource.includes('KONTEN BERKALA'), 'sidebar must have KONTEN BERKALA section');

console.log('Admin hubs and sidebar navigation contract verified.');
