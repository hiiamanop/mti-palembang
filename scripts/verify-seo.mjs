import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

// 1. Verify favicon and icon files exist
await access(new URL('../public/favicon.ico', import.meta.url));
await access(new URL('../public/icon.png', import.meta.url));
await access(new URL('../public/apple-icon.png', import.meta.url));
await access(new URL('../app/favicon.ico', import.meta.url));
await access(new URL('../app/icon.png', import.meta.url));
await access(new URL('../app/apple-icon.png', import.meta.url));
await access(new URL('../public/images/og-mti-sumsel.png', import.meta.url));

// 2. Verify layout.jsx contains rich metadata
const layout = await readFile(new URL('../app/layout.jsx', import.meta.url), 'utf8');
assert.ok(layout.includes('metadataBase'), 'layout must define metadataBase');
assert.ok(layout.includes('openGraph'), 'layout must define openGraph');
assert.ok(layout.includes('twitter'), 'layout must define twitter metadata');
assert.ok(layout.includes('og-mti-sumsel.png'), 'layout must include og-mti-sumsel.png');
assert.ok(layout.includes('icons:'), 'layout must include icons');
assert.ok(layout.includes('robots:'), 'layout must include robots metadata');
assert.equal(layout.includes('newsletter'), false, 'layout description must not contain obsolete newsletter reference');

// 3. Verify sitemap and robots
await access(new URL('../app/sitemap.js', import.meta.url));
await access(new URL('../app/robots.js', import.meta.url));

console.log('SEO metadata, favicon, and sitemap contract verified.');
