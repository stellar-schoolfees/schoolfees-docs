import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const read = p => fs.readFileSync(p, 'utf8');
for (const name of ['logo.svg', 'logo-dark.svg']) {
  assert.equal(read('src/brand/' + name), read('brand/' + name), 'Book logo differs from canonical asset: ' + name);
}
assert.equal(read('theme/favicon.svg'), read('brand/favicon.svg'), 'Favicon differs from canonical asset');
const summary = read('src/SUMMARY.md');
const landing = /\]\(([^)]+\.md)\)/.exec(summary)?.[1];
assert.ok(landing, 'Missing landing page');
const page = read(path.join('src', landing));
for (const name of ['logo.svg', 'logo-dark.svg']) assert.ok(page.includes('src="brand/' + name + '"'), 'Missing landing logo ' + name);
assert.match(page, /alt="[^"\s][^"]+"/, 'Logo needs accessible alternative text');
assert.match(read('README.md'), /<picture>[\s\S]*prefers-color-scheme: dark[\s\S]*brand\/logo-dark\.svg[\s\S]*alt="[^"]+"[\s\S]*<\/picture>/);
assert.ok(read('book.toml').includes('additional-css = ["theme/brand.css"]'), 'Brand stylesheet is not configured');
assert.ok(read('theme/brand.css').includes('.navy'), 'Dark book themes must select the dark logo');
if (process.argv.includes('--built')) {
  for (const name of ['logo.svg', 'logo-dark.svg']) assert.equal(read('book/brand/' + name), read('brand/' + name), 'Built book is missing its logo');
  const output = fs.readdirSync('book', {recursive: true}).filter(n => fs.statSync(path.join('book', n)).isFile());
  assert.ok(output.some(n => n.startsWith('favicon') && n.endsWith('.svg') && read('book/' + n) === read('brand/favicon.svg')), 'Built favicon is missing or incorrect');
  assert.ok(output.some(n => path.basename(n).startsWith('brand') && n.endsWith('.css') && read('book/' + n) === read('theme/brand.css')), 'Built branding stylesheet is missing or incorrect');
  const html = read('book/' + landing.replace(/\.md$/, '.html'));
  assert.ok(html.includes('brand/logo.svg') && html.includes('brand/logo-dark.svg'), 'Landing HTML does not reference both logos');
}
console.log('Brand assets and references verified' + (process.argv.includes('--built') ? ' in built book.' : '.'));
