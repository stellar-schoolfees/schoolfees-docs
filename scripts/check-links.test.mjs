// Tests for the dependency-free link checker, run with `node --test`.
//
// The pure functions take a `Map<path, markdown>`, so the fixtures below are
// complete little fake repositories. The last test runs the checker against the
// real book.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import {
  checkFiles,
  checkRepo,
  extractHeadings,
  formatReport,
  isClean,
  isExternal,
  parseLinks,
  resolveTarget,
  slugify,
  SUMMARY_FILE,
} from './check-links.mjs';

test('slugify lowercases, drops punctuation and hyphenates spaces', () => {
  assert.equal(slugify('About the reference'), 'about-the-reference');
  assert.equal(slugify('3. Core protocol objects'), '3-core-protocol-objects');
  assert.equal(slugify('`Fee` — persistent, key'), 'fee-persistent-key');
});

test('extractHeadings collects one anchor per heading and skips code fences', () => {
  const anchors = extractHeadings(
    ['# Title', '', '## Second one', '', '```', '# not a heading', '```', '### Third'].join('\n'),
  );
  assert.deepEqual([...anchors].sort(), ['second-one', 'third', 'title']);
});

test('parseLinks finds inline and image links, and ignores fenced code', () => {
  const markdown = [
    'See [quickstart](quickstart.md) and [part](architecture.md#4-lifecycle).',
    '',
    '```',
    '[not a link](missing.md)',
    '```',
    '',
    '![an image](img/logo.png)',
  ].join('\n');

  const links = parseLinks(markdown);
  assert.deepEqual(
    links.map((link) => link.dest),
    ['quickstart.md', 'architecture.md#4-lifecycle', 'img/logo.png'],
  );
  assert.deepEqual(
    links.map((link) => link.line),
    [1, 1, 7],
  );
});

test('isExternal recognises schemes and protocol-relative links', () => {
  assert.equal(isExternal('https://example.com/a'), true);
  assert.equal(isExternal('mailto:someone@example.com'), true);
  assert.equal(isExternal('//example.com/a'), true);
  assert.equal(isExternal('quickstart.md'), false);
  assert.equal(isExternal('../README.md'), false);
});

test('resolveTarget resolves against the containing file and the book root', () => {
  assert.deepEqual(resolveTarget('src/faq.md', 'quickstart.md'), {
    target: 'src/quickstart.md',
    anchor: '',
  });
  assert.deepEqual(resolveTarget('src/pilots/README.md', '../limitations.md'), {
    target: 'src/limitations.md',
    anchor: '',
  });
  assert.deepEqual(resolveTarget('src/faq.md', '#some-anchor'), {
    target: 'src/faq.md',
    anchor: 'some-anchor',
  });
  assert.deepEqual(resolveTarget('src/faq.md', '/img/x.png'), {
    target: 'src/img/x.png',
    anchor: '',
  });
});

const cleanBook = () =>
  new Map([
    [SUMMARY_FILE, ['# Summary', '', '- [Quickstart](quickstart.md)', '- [FAQ](faq.md)'].join('\n')],
    ['src/quickstart.md', '# Quickstart\n\nBack to the [FAQ](faq.md#still-asking).'],
    ['src/faq.md', '# FAQ\n\n## Still asking\n\nSee [quickstart](quickstart.md).'],
  ]);

test('a small well-formed book is clean', () => {
  const result = checkFiles(cleanBook());
  assert.equal(isClean(result), true);
  assert.equal(result.checkedFiles, 3);
  assert.match(formatReport(result), /links OK/);
});

test('a missing SUMMARY.md is reported', () => {
  const files = cleanBook();
  files.delete(SUMMARY_FILE);
  const result = checkFiles(files);
  assert.equal(isClean(result), false);
  assert.match(result.problems[0].message, /SUMMARY\.md is missing/);
});

test('a SUMMARY entry with no page is reported', () => {
  const files = cleanBook();
  files.set(
    SUMMARY_FILE,
    ['# Summary', '', '- [Quickstart](quickstart.md)', '- [Ghost](ghost.md)'].join('\n'),
  );
  const result = checkFiles(files);
  assert.equal(isClean(result), false);
  assert.equal(result.problems.length, 1);
  assert.equal(result.problems[0].file, SUMMARY_FILE);
  assert.equal(result.problems[0].line, 4);
  assert.match(result.problems[0].message, /ghost\.md/);
});

test('a relative link to a missing page is reported', () => {
  const files = cleanBook();
  files.set('src/faq.md', '# FAQ\n\n## Still asking\n\nSee [nowhere](nowhere.md).');
  const result = checkFiles(files);
  assert.equal(isClean(result), false);
  assert.equal(result.problems[0].message, 'target does not exist: src/nowhere.md');
});

test('an anchor that is not a heading is reported', () => {
  const files = cleanBook();
  files.set('src/faq.md', '# FAQ\n\n## Still asking\n\nSee [quickstart](quickstart.md#not-a-heading).');
  const result = checkFiles(files);
  assert.equal(isClean(result), false);
  assert.match(result.problems[0].message, /anchor not found in src\/quickstart\.md/);
});

test('external links are not checked and do not count as problems', () => {
  const files = cleanBook();
  files.set(
    'src/faq.md',
    '# FAQ\n\n## Still asking\n\n[Repo](https://github.com/stellar-schoolfees/schoolfees-docs) and [mail](mailto:x@example.com).',
  );
  const result = checkFiles(files);
  assert.equal(isClean(result), true);
});

test('a directory link resolves when the directory has an index page', () => {
  const files = cleanBook();
  files.set('src/faq.md', '# FAQ\n\n## Still asking\n\nSee [pilots](pilots/README.md).');
  files.set('src/pilots/README.md', '# Pilots\n\nNo pilot has happened yet.');
  const result = checkFiles(files);
  assert.equal(isClean(result), true);
});

test('the real book has no unresolved links', () => {
  const rootDir = fileURLToPath(new URL('..', import.meta.url));
  const result = checkRepo(rootDir);
  assert.equal(
    isClean(result),
    true,
    isClean(result) ? undefined : formatReport(result),
  );
});
