import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const visibility = z.enum(['public', 'private', 'draft', 'reference-summary']).default('public');
const copyrightLevel = z
  .enum(['original-analysis', 'short-quote', 'external-reference', 'private-source'])
  .default('original-analysis');

const articleTypes = z.enum([
  'chapter-reading',
  'character-study',
  'motif-essay',
  'theme-essay',
  'intertext-study',
  'reference',
  'poem',
  'visual-map'
]);

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    type: articleTypes,
    status: z.enum(['published', 'draft']).default('published'),
    visibility,
    date: z.coerce.date(),
    summary: z.string(),
    chapters: z.array(z.number()).default([]),
    characters: z.array(z.string()).default([]),
    motifs: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    intertexts: z.array(z.string()).default([]),
    events: z.array(z.string()).default([]),
    cover: z.string().optional(),
    canonical: z.string().optional(),
    previousVersions: z.array(z.string()).default([]),
    copyrightLevel,
    searchable: z.boolean().default(true)
  })
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/chapters' }),
  schema: z.object({
    chapter: z.number(),
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    phase: z.string(),
    summary: z.string(),
    keywords: z.array(z.string()).default([]),
    events: z.array(z.string()).default([]),
    characters: z.array(z.string()).default([]),
    motifs: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([]),
    sourceVisibility: z.enum(['private']).default('private')
  })
});

const characters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/characters' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    generation: z.number(),
    lineageType: z.string(),
    role: z.string(),
    summary: z.string(),
    chapters: z.array(z.number()).default([]),
    motifs: z.array(z.string()).default([]),
    articles: z.array(z.string()).default([]),
    relations: z
      .object({
        spouse: z.array(z.string()).default([]),
        children: z.array(z.string()).default([]),
        parents: z.array(z.string()).default([]),
        mentors: z.array(z.string()).default([])
      })
      .default({})
  })
});

const motifs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/motifs' }),
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    summary: z.string(),
    firstAppearanceChapter: z.number().optional(),
    keyChapters: z.array(z.number()).default([]),
    coreMeanings: z.array(z.string()).default([]),
    characters: z.array(z.string()).default([]),
    events: z.array(z.string()).default([]),
    articles: z.array(z.string()).default([])
  })
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/events' }),
  schema: z.object({
    id: z.string(),
    chapter: z.number(),
    order: z.number(),
    title: z.string(),
    summary: z.string(),
    characters: z.array(z.string()).default([]),
    motifs: z.array(z.string()).default([]),
    themes: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([])
  })
});

export const collections = {
  articles,
  chapters,
  characters,
  motifs,
  events
};
