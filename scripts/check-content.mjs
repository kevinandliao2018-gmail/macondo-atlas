import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredDirs = ['content/articles', 'content/chapters', 'content/characters', 'content/motifs', 'content/events'];

for (const dir of requiredDirs) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) {
    throw new Error(`Missing content directory: ${dir}`);
  }
}

const originalDir = path.join(root, '原文');
if (!fs.existsSync(originalDir)) {
  throw new Error('Expected private source directory 原文/ to remain in place.');
}

const publicOriginalRoute = path.join(root, 'src/pages/original');
if (fs.existsSync(publicOriginalRoute)) {
  throw new Error('原文/ must not have a public Astro route.');
}

const chapters = readCollection('content/chapters');
const events = readCollection('content/events');
const characters = readCollection('content/characters');
const motifs = readCollection('content/motifs');
const articles = readCollection('content/articles');

if (chapters.length !== 20) {
  throw new Error(`Expected 20 chapter files, found ${chapters.length}.`);
}

const eventIds = new Set(events.map((entry) => entry.data.id));
const characterIds = new Set(characters.map((entry) => entry.data.id));
const motifIds = new Set(motifs.map((entry) => entry.data.id));
const articleSlugs = new Set(articles.map((entry) => entry.data.slug));
const chapterNumbers = new Set(chapters.map((entry) => entry.data.chapter));
const eventById = new Map(events.map((entry) => [entry.data.id, entry]));
const chapterByNumber = new Map(chapters.map((entry) => [entry.data.chapter, entry]));

for (const chapter of chapters) {
  assertArray(chapter, 'events');
  assertArray(chapter, 'characters');
  assertArray(chapter, 'motifs');
  if (chapter.data.events.length === 0) {
    throw new Error(`${chapter.file} must have at least one event.`);
  }
  for (const id of chapter.data.events) {
    assertKnown(chapter, 'events', id, eventIds);
    const event = eventById.get(id);
    if (event && event.data.chapter !== chapter.data.chapter) {
      throw new Error(`${chapter.file} lists ${id}, but that event belongs to chapter ${event.data.chapter}.`);
    }
  }
  for (const id of chapter.data.characters) assertKnown(chapter, 'characters', id, characterIds);
  for (const id of chapter.data.motifs) assertKnown(chapter, 'motifs', id, motifIds);
}

for (const event of events) {
  assertKnown(event, 'chapter', event.data.chapter, chapterNumbers);
  const chapter = chapterByNumber.get(event.data.chapter);
  if (chapter && !chapter.data.events.includes(event.data.id)) {
    throw new Error(`${event.file} belongs to chapter ${event.data.chapter}, but the chapter does not list it.`);
  }
  for (const id of event.data.characters ?? []) assertKnown(event, 'characters', id, characterIds);
  for (const id of event.data.motifs ?? []) assertKnown(event, 'motifs', id, motifIds);
  for (const slug of event.data.relatedArticles ?? []) assertKnown(event, 'relatedArticles', slug, articleSlugs);
}

for (const character of characters) {
  for (const chapter of character.data.chapters ?? []) assertKnown(character, 'chapters', chapter, chapterNumbers);
  for (const id of character.data.motifs ?? []) assertKnown(character, 'motifs', id, motifIds);
  for (const slug of character.data.articles ?? []) assertKnown(character, 'articles', slug, articleSlugs);
}

for (const motif of motifs) {
  for (const chapter of motif.data.keyChapters ?? []) assertKnown(motif, 'keyChapters', chapter, chapterNumbers);
  if (motif.data.firstAppearanceChapter) assertKnown(motif, 'firstAppearanceChapter', motif.data.firstAppearanceChapter, chapterNumbers);
  for (const id of motif.data.characters ?? []) assertKnown(motif, 'characters', id, characterIds);
  for (const id of motif.data.events ?? []) assertKnown(motif, 'events', id, eventIds);
  for (const slug of motif.data.articles ?? []) assertKnown(motif, 'articles', slug, articleSlugs);
}

for (const article of articles) {
  for (const chapter of article.data.chapters ?? []) assertKnown(article, 'chapters', chapter, chapterNumbers);
  for (const id of article.data.events ?? []) assertKnown(article, 'events', id, eventIds);
  for (const id of article.data.characters ?? []) assertKnown(article, 'characters', id, characterIds);
  for (const id of article.data.motifs ?? []) assertKnown(article, 'motifs', id, motifIds);
}

console.log(
  `Content directories, private-source boundary, and reading map refs look good: ${chapters.length} chapters, ${events.length} events.`
);

function readCollection(relativeDir) {
  return fs
    .readdirSync(path.join(root, relativeDir))
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => ({
      file: `${relativeDir}/${file}`,
      data: parseFrontmatter(fs.readFileSync(path.join(root, relativeDir, file), 'utf8'))
    }));
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const lines = match[1].split('\n');
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyMatch = line.match(/^([A-Za-z][\w-]*):(?:\s*(.*))?$/);
    if (!keyMatch) continue;

    const [, key, rawValue = ''] = keyMatch;
    if (rawValue === '') {
      const items = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const itemMatch = lines[cursor].match(/^\s+-\s+(.+)$/);
        if (!itemMatch) break;
        items.push(parseScalar(itemMatch[1]));
        cursor += 1;
      }
      data[key] = items;
      index = cursor - 1;
    } else {
      data[key] = parseScalar(rawValue);
    }
  }

  return data;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === '[]') return [];
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function assertArray(entry, key) {
  if (!Array.isArray(entry.data[key])) {
    throw new Error(`${entry.file} must define ${key} as an array.`);
  }
}

function assertKnown(entry, key, id, knownIds) {
  if (!knownIds.has(id)) {
    throw new Error(`${entry.file} references missing ${key} id: ${id}`);
  }
}
