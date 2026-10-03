import { mkdir, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const key = process.env.WEREAD_API_KEY;
if (!key) throw new Error('Set WEREAD_API_KEY to sync the reading shelf.');

const response = await fetch('https://i.weread.qq.com/api/agent/gateway', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ api_name: '/shelf/sync', skill_version: '1.0.4' }),
  signal: AbortSignal.timeout(30_000),
});
if (!response.ok) throw new Error(`WeRead request failed (${response.status}).`);
const result = await response.json();
if (result.upgrade_info)
  throw new Error('WeRead skill upgrade required; update the integration before syncing.');
if (result.errcode) throw new Error('WeRead rejected the request; check the API key.');
const shelf = result.data ?? result;
if (!Array.isArray(shelf.books))
  throw new Error('Unexpected WeRead shelf response; existing data preserved.');

function safeUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

// Publish only explicitly public, finished books and an allowlist of display fields.
// No private books, account details, notes, or credentials enter the static bundle.
const books = shelf.books
  .filter((book) => book.finishReading === 1 && book.secret === 0)
  .sort((a, b) => (b.readUpdateTime ?? 0) - (a.readUpdateTime ?? 0))
  .map((book) => ({
    id: String(book.bookId),
    title: String(book.title ?? ''),
    author: String(book.author ?? ''),
    cover: safeUrl(book.cover),
    url: safeUrl(book.deepLink),
  }));
const directory = fileURLToPath(new URL('../src/data/', import.meta.url));
await mkdir(directory, { recursive: true });
const target = `${directory}reading.json`;
await writeFile(
  `${target}.tmp`,
  `${JSON.stringify({ syncedAt: new Date().toISOString(), books }, null, 2)}\n`
);
await rename(`${target}.tmp`, target);
console.log(`Synced ${books.length} public finished books.`);
