import { getCollection } from 'astro:content';

type AnyEntry = {
  data: Record<string, any>;
  id: string;
};

export type RelatedArticleItem = {
  title: string;
  href: string;
  summary: string;
  reasons?: string[];
};

export const articleHref = (slug: string) => `/articles/${slug}`;
export const chapterHref = (chapter: number) => `/chapters/${String(chapter).padStart(2, '0')}`;
export const characterHref = (slug: string) => `/characters/${slug}`;
export const motifHref = (slug: string) => `/motifs/${slug}`;
export const themeHref = (id: string) => `/themes/${id}`;

export type TimelineHrefFilters = {
  chapter?: number | string | null;
  character?: string | null;
  motif?: string | null;
  theme?: string | null;
};

export function timelineHref(filters: TimelineHrefFilters = {}, eventId?: string) {
  const params = new URLSearchParams();
  const chapter = cleanParam(filters.chapter);
  const character = cleanParam(filters.character);
  const motif = cleanParam(filters.motif);
  const theme = cleanParam(filters.theme);

  if (chapter) params.set('chapter', chapter);
  if (character) params.set('character', character);
  if (motif) params.set('motif', motif);
  if (theme) params.set('theme', theme);

  const query = params.toString();
  const hash = eventId ? `#${eventId}` : '';
  return `/timeline${query ? `?${query}` : ''}${hash}`;
}

export function isPublic(data: Record<string, any>) {
  return data.status !== 'draft' && data.visibility === 'public';
}

export async function getPublicArticles() {
  const articles = await getCollection('articles', ({ data }) => isPublic(data));
  return articles.sort((a, b) => Number(b.data.date) - Number(a.data.date));
}

export function collectArticleTags(article: AnyEntry) {
  return [
    ...article.data.chapters.map((chapter: number) => `第${chapter}章`),
    ...article.data.characters,
    ...article.data.motifs,
    ...article.data.themes
  ].slice(0, 10);
}

export function getRelatedArticles(current: AnyEntry, articles: AnyEntry[], limit = 4) {
  const score = (candidate: AnyEntry) => {
    if (candidate.data.slug === current.data.slug) return -1;
    let value = 0;
    value += overlap(current.data.chapters, candidate.data.chapters) * 6;
    value += overlap(current.data.events, candidate.data.events) * 5;
    value += overlap(current.data.characters, candidate.data.characters) * 4;
    value += overlap(current.data.motifs, candidate.data.motifs) * 4;
    value += overlap(current.data.themes, candidate.data.themes) * 3;
    value += overlap(current.data.intertexts, candidate.data.intertexts) * 3;
    if (candidate.data.type === current.data.type) value += 1;
    return value;
  };

  return articles
    .map((article) => ({ article, score: score(article) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => toRelatedArticle(current, article));
}

export function getChapterRelatedArticles(chapter: AnyEntry, articles: AnyEntry[], limit = 6) {
  const manualSlugs = new Set(chapter.data.relatedArticles ?? []);
  const score = (candidate: AnyEntry) => {
    let value = 0;
    if (candidate.data.chapters?.includes(chapter.data.chapter)) value += 8;
    value += overlap(chapter.data.characters, candidate.data.characters) * 4;
    value += overlap(chapter.data.motifs, candidate.data.motifs) * 4;
    value += overlap(chapter.data.events, candidate.data.events) * 3;
    if (manualSlugs.has(candidate.data.slug)) value += 20;
    return value;
  };

  return articles
    .map((article) => ({ article, score: score(article) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => toRelatedArticle(chapter, article));
}

export function bySlug<T extends AnyEntry>(entries: T[]) {
  return new Map(entries.map((entry) => [entry.data.slug ?? entry.data.id, entry]));
}

export function byId<T extends AnyEntry>(entries: T[]) {
  return new Map(entries.map((entry) => [entry.data.id ?? entry.data.slug, entry]));
}

function overlap(a: unknown[] = [], b: unknown[] = []) {
  const bSet = new Set(b);
  return a.filter((item) => bSet.has(item)).length;
}

function cleanParam(value: number | string | null | undefined) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function intersection<T>(a: T[] = [], b: T[] = []) {
  const bSet = new Set(b);
  return a.filter((item) => bSet.has(item));
}

function toRelatedArticle(current: AnyEntry, article: AnyEntry): RelatedArticleItem {
  return {
    title: article.data.title,
    href: articleHref(article.data.slug),
    summary: article.data.summary,
    reasons: relatedReasons(current, article)
  };
}

function relatedReasons(current: AnyEntry, candidate: AnyEntry) {
  const reasons: string[] = [];
  const sharedChapters = intersection(current.data.chapters, candidate.data.chapters);
  const chapterNumber = current.data.chapter;
  if (chapterNumber && candidate.data.chapters?.includes(chapterNumber)) {
    reasons.push(`同第${chapterNumber}章`);
  } else {
    reasons.push(...sharedChapters.slice(0, 2).map((chapter) => `同第${chapter}章`));
  }
  if (overlap(current.data.characters, candidate.data.characters) > 0) reasons.push('同人物');
  if (overlap(current.data.motifs, candidate.data.motifs) > 0) reasons.push('同意象');
  if (overlap(current.data.events, candidate.data.events) > 0) reasons.push('同事件');
  if (overlap(current.data.themes, candidate.data.themes) > 0) reasons.push('同主题');
  return [...new Set(reasons)].slice(0, 3);
}
