#!/usr/bin/env node
//
// Checks the schoolfees-docs mdBook. Two things must hold:
//   1. every link in `src/SUMMARY.md` points at a file that exists (so every
//      entry in the book's table of contents is real), and
//   2. every relative link in every markdown file in the repository resolves,
//      including its `#anchor` when it has one.
//
// Links to external sites (http, https, mailto, ...) are skipped: this script
// never touches the network. No dependencies beyond Node's built-ins.
//
// Usage:
//   node scripts/check-links.mjs
//
// Exits non-zero when the SUMMARY is missing or a link does not resolve.

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** The book's source directory, as mdBook is configured in `book.toml`. */
export const SRC_DIR = 'src';

/** The table of contents mdBook requires. */
export const SUMMARY_FILE = 'src/SUMMARY.md';

/** Directories that never contain book sources. */
const IGNORED_DIRS = new Set(['.git', 'book', 'node_modules', 'target']);

/** True for links this checker must not follow (external schemes, `//host`). */
export function isExternal(dest) {
  return /^[a-z][a-z0-9+.-]*:/i.test(dest) || dest.startsWith('//');
}

/**
 * Turns a heading's text into its anchor id, following the common
 * GitHub/mdBook rules closely enough for this repository: lowercase, drop
 * punctuation and formatting marks, spaces to hyphens.
 */
export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Tracks ``` / ~~~ fenced code blocks so their contents are not parsed. */
function forEachContentLine(markdown, visit) {
  const lines = markdown.split(/\r?\n/);
  let fence = '';
  lines.forEach((line, index) => {
    const open = /^\s*(```+|~~~+)/.exec(line);
    if (open) {
      const marker = open[1][0];
      if (fence === '') fence = marker;
      else if (fence === marker) fence = '';
      return;
    }
    if (fence !== '') return;
    visit(line, index + 1);
  });
}

/** Every anchor id defined by the headings in a markdown string. */
export function extractHeadings(markdown) {
  const anchors = new Set();
  forEachContentLine(markdown, (line) => {
    const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) anchors.add(slugify(heading[2]));
  });
  return anchors;
}

/**
 * Every inline markdown link in a markdown string, as `{ dest, line }`.
 * Image links count too, because their paths also have to exist.
 */
export function parseLinks(markdown) {
  const links = [];
  forEachContentLine(markdown, (line, lineNumber) => {
    const pattern = /\[[^\]]*\]\(\s*([^)]*?)\s*\)/g;
    let match;
    while ((match = pattern.exec(line)) !== null) {
      let dest = match[1].trim();
      if (dest.startsWith('<') && dest.endsWith('>')) dest = dest.slice(1, -1);
      const space = dest.search(/\s/);
      if (space !== -1) dest = dest.slice(0, space); // drop an optional "title"
      links.push({ dest, line: lineNumber });
    }
  });
  return links;
}

/** Decodes percent-escapes without throwing on stray `%` characters. */
function decodePath(rawPath) {
  try {
    return decodeURIComponent(rawPath);
  } catch {
    return rawPath;
  }
}

/**
 * Resolves a markdown destination against the file it appears in.
 * Returns `{ target, anchor }`, where `target` is a repository-relative path.
 */
export function resolveTarget(fromFile, dest) {
  const hash = dest.indexOf('#');
  const rawPath = hash === -1 ? dest : dest.slice(0, hash);
  const anchor = hash === -1 ? '' : dest.slice(hash + 1);

  if (rawPath === '') return { target: fromFile, anchor };

  let resolved = decodePath(rawPath);
  if (resolved.startsWith('/')) {
    // A root-relative link resolves against the book root inside the book.
    const base = fromFile.startsWith(`${SRC_DIR}/`) ? SRC_DIR : '';
    resolved = path.posix.join(base, resolved);
  } else {
    resolved = path.posix.join(path.posix.dirname(fromFile), resolved);
  }
  return { target: path.posix.normalize(resolved), anchor };
}

/**
 * Checks a `Map<path, content>` of repository files and returns
 * `{ problems, checkedFiles, checkedLinks }`. Pure: no filesystem access, so
 * tests can feed it a fake tree. Only markdown is scanned for links.
 */
export function checkFiles(files) {
  const problems = [];
  let checkedFiles = 0;
  let checkedLinks = 0;

  if (!files.has(SUMMARY_FILE)) {
    return {
      problems: [
        {
          file: SUMMARY_FILE,
          line: 0,
          dest: SUMMARY_FILE,
          message: `${SUMMARY_FILE} is missing; mdBook needs a table of contents`,
        },
      ],
      checkedFiles: 0,
      checkedLinks: 0,
    };
  }

  const targetExists = (target) => {
    if (files.has(target)) return true;
    if (files.has(path.posix.join(target, 'README.md'))) return true;
    if (files.has(path.posix.join(target, 'index.md'))) return true;
    const prefix = target.endsWith('/') ? target : `${target}/`;
    for (const key of files.keys()) {
      if (key.startsWith(prefix)) return true;
    }
    return false;
  };

  for (const [file, content] of files) {
    if (!file.endsWith('.md') || typeof content !== 'string') continue;
    checkedFiles += 1;

    for (const link of parseLinks(content)) {
      const { dest } = link;
      if (dest === '' || isExternal(dest)) continue;
      checkedLinks += 1;

      const { target, anchor } = resolveTarget(file, dest);

      if (target === file && anchor === '') continue; // a bare "#" link

      if (!targetExists(target)) {
        problems.push({
          file,
          line: link.line,
          dest,
          message: `target does not exist: ${target}`,
        });
        continue;
      }

      if (anchor !== '' && target.endsWith('.md') && typeof files.get(target) === 'string') {
        const anchors = extractHeadings(files.get(target));
        if (!anchors.has(slugify(anchor))) {
          problems.push({
            file,
            line: link.line,
            dest,
            message: `anchor not found in ${target}: #${anchor}`,
          });
        }
      }
    }
  }

  return { problems, checkedFiles, checkedLinks };
}

/** True when a `checkFiles`/`checkRepo` result has no problems. */
export function isClean(result) {
  return result.problems.length === 0;
}

/** Formats a `checkFiles`/`checkRepo` result as a readable report. */
export function formatReport(result) {
  if (isClean(result)) {
    return `links OK: ${result.checkedLinks} relative links across ${result.checkedFiles} markdown files resolve`;
  }

  const lines = [
    `${result.problems.length} unresolved link${result.problems.length === 1 ? '' : 's'} in the book:`,
    '',
  ];
  for (const problem of result.problems) {
    const where = problem.line > 0 ? `${problem.file}:${problem.line}` : problem.file;
    lines.push(`  ${where}: [${problem.dest}] - ${problem.message}`);
  }
  lines.push('');
  lines.push('Fix the link or the missing page, then run this check again.');
  return lines.join('\n');
}

/**
 * Walks the repository and returns `Map<path, content>` for every file, where
 * `content` is the file's text for markdown and `null` otherwise. Non-markdown
 * files are kept so that links to things like `LICENSE` can resolve.
 */
export function readBook(rootDir) {
  const files = new Map();

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        walk(absolute);
      } else if (entry.isFile()) {
        // Every file counts for existence checks; only markdown is scanned.
        const relative = path.relative(rootDir, absolute).split(path.sep).join('/');
        files.set(relative, entry.name.endsWith('.md') ? readFileSync(absolute, 'utf8') : null);
      }
    }
  };

  walk(rootDir);
  return files;
}

/** Reads the repository's markdown files and checks them. */
export function checkRepo(rootDir) {
  return checkFiles(readBook(rootDir));
}

function main() {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  try {
    const result = checkRepo(rootDir);
    const report = formatReport(result);
    if (isClean(result)) {
      console.log(report);
      return 0;
    }
    console.error(report);
    return 1;
  } catch (error) {
    console.error(`check-links: ${error.message}`);
    return 1;
  }
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exitCode = main();
}
