import type { CollectionEntry } from 'astro:content';
import { articleHref, chapterHref, characterHref, isPublic, motifHref, themeHref, timelineHref } from './content';

type ArticleEntry = CollectionEntry<'articles'>;
type ChapterEntry = CollectionEntry<'chapters'>;
type CharacterEntry = CollectionEntry<'characters'>;
type MotifEntry = CollectionEntry<'motifs'>;
type EventEntry = CollectionEntry<'events'>;

type RelationKind = 'article' | 'chapter' | 'character' | 'event' | 'motif' | 'theme';
export type RelationMapNodeKind = 'chapter' | 'character' | 'motif';

export type RelationLink = {
  id: string;
  title: string;
  href: string;
  kind: RelationKind;
  summary?: string;
  meta?: string;
  count?: number;
  sortKey?: number | string;
};

export type ArchiveEvent = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  summary: string;
  href: string;
  characters: RelationLink[];
  motifs: RelationLink[];
  relatedArticles: RelationLink[];
};

export type EventTimelineFilterOption = RelationLink & {
  count: number;
  matchThemes?: string[];
};

export type EventTimelineEvent = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  summary: string;
  href: string;
  chapterLink: RelationLink;
  characters: RelationLink[];
  motifs: RelationLink[];
  relatedArticles: RelationLink[];
  themes: string[];
};

export type EventTimelineData = {
  events: EventTimelineEvent[];
  filters: {
    chapters: EventTimelineFilterOption[];
    characters: EventTimelineFilterOption[];
    motifs: EventTimelineFilterOption[];
    themes: EventTimelineFilterOption[];
  };
  stats: {
    events: number;
    chapters: number;
    characters: number;
    motifs: number;
    themes: number;
  };
};

export type CoOccurrenceItem = RelationLink & {
  count: number;
};

export type CharacterFateEvent = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  summary: string;
  href: string;
};

export type CharacterFatePhase = {
  id: string;
  title: string;
  chapterSpan: string;
  eventCount: number;
  functions: string[];
  motifs: CoOccurrenceItem[];
  events: CharacterFateEvent[];
};

export type CharacterFateLine = {
  characterId: string;
  phaseCount: number;
  eventCount: number;
  phases: CharacterFatePhase[];
};

export type MotifEvolutionEvent = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  summary: string;
  href: string;
};

export type MotifEvolutionPhase = {
  id: string;
  title: string;
  chapterSpan: string;
  eventCount: number;
  functions: string[];
  characters: CoOccurrenceItem[];
  events: MotifEvolutionEvent[];
};

export type MotifEvolutionLine = {
  motifId: string;
  phaseCount: number;
  eventCount: number;
  phases: MotifEvolutionPhase[];
};

export type ThemeDefinition = {
  id: string;
  name: string;
  summary: string;
  description: string;
  tags: string[];
  matchThemes: string[];
};

export type ThemeIndexItem = ThemeDefinition & {
  href: string;
  eventCount: number;
  chapterCount: number;
  articleCount: number;
};

export type ThemeEvolutionEvent = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  summary: string;
  href: string;
};

export type ThemeEvolutionPhase = {
  id: string;
  title: string;
  chapterSpan: string;
  eventCount: number;
  functions: string[];
  events: ThemeEvolutionEvent[];
};

export type ThemeEvolutionLine = {
  themeId: string;
  phaseCount: number;
  eventCount: number;
  phases: ThemeEvolutionPhase[];
};

export type CharacterArchive = {
  events: ArchiveEvent[];
  fateLine?: CharacterFateLine;
  chapters: RelationLink[];
  motifs: RelationLink[];
  articles: RelationLink[];
  coCharacters: CoOccurrenceItem[];
  coMotifs: CoOccurrenceItem[];
  chapterDensity: CoOccurrenceItem[];
};

export type MotifArchive = {
  events: ArchiveEvent[];
  evolutionLine?: MotifEvolutionLine;
  chapters: RelationLink[];
  characters: RelationLink[];
  articles: RelationLink[];
  coCharacters: CoOccurrenceItem[];
  coMotifs: CoOccurrenceItem[];
  chapterDensity: CoOccurrenceItem[];
};

export type ThemeArchive = {
  theme: ThemeDefinition;
  events: ArchiveEvent[];
  evolutionLine?: ThemeEvolutionLine;
  chapters: CoOccurrenceItem[];
  characters: CoOccurrenceItem[];
  motifs: CoOccurrenceItem[];
  articles: RelationLink[];
  stats: {
    events: number;
    chapters: number;
    characters: number;
    motifs: number;
    articles: number;
  };
};

export type RelationMapNode = {
  id: string;
  entityId: string;
  title: string;
  href: string;
  kind: RelationMapNodeKind;
  summary: string;
  meta: string;
  eventCount: number;
  core: boolean;
  rank: number;
  sortKey: number | string;
};

export type RelationMapEdgeEvent = {
  id: string;
  title: string;
  chapter: number;
  order: number;
  href: string;
};

export type RelationMapEdgeExplanation = {
  relationType: string;
  timeSpan: string;
  keyEvidence: RelationMapEdgeEvent[];
  literaryFunctions: string[];
};

export type RelationMapEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  events: RelationMapEdgeEvent[];
  eventIds: string[];
  eventTitles: string[];
  explanation: RelationMapEdgeExplanation;
};

export type RelationMapData = {
  nodes: RelationMapNode[];
  edges: RelationMapEdge[];
  stats: {
    events: number;
    nodes: number;
    edges: number;
    coreNodes: number;
    defaultEdges: number;
    characters: number;
    motifs: number;
    chapters: number;
    maxWeight: number;
  };
};

type ArchiveInput = {
  articles: ArticleEntry[];
  chapters: ChapterEntry[];
  characters: CharacterEntry[];
  events: EventEntry[];
  motifs: MotifEntry[];
};

export const THEME_REGISTRY = [
  {
    id: 'family',
    name: '家族',
    summary: '从创世、命名、婚姻到继承，追踪布恩迪亚家族如何把亲缘变成命运的封闭结构。',
    description:
      '家族主题把马孔多的开端、血缘秩序、婚姻选择与代际继承连在一起。它不是单纯的谱系记录，而是观察百年循环如何在家庭内部反复生成的入口。',
    tags: ['血缘', '命名', '继承', '婚姻'],
    matchThemes: ['family', 'genesis', 'origin', 'inheritance', 'legacy', 'marriage', 'identity']
  },
  {
    id: 'memory',
    name: '记忆',
    summary: '从失眠症、回返、历史创伤到阅读，追踪记忆如何保存事实，也如何被遗忘反复吞没。',
    description:
      '记忆主题把个人回忆、集体遗忘、历史创伤与文本阅读缝合在一起。它让事件不只是发生过，而是在叙事中被命名、被遮蔽、又被重新召回。',
    tags: ['回忆', '遗忘', '创伤', '阅读'],
    matchThemes: ['memory', 'historical-trauma', 'return', 'repetition', 'reading', 'literature']
  },
  {
    id: 'war',
    name: '战争',
    summary: '从国家秩序、权力、暴力到屠杀，追踪战争如何把个人热望推成制度化孤独。',
    description:
      '战争主题关注奥雷里亚诺上校的政治化、马孔多的权力结构，以及暴力如何从理想的外衣下显出空洞。它也是国家机器进入家族叙事的关键通道。',
    tags: ['权力', '暴力', '国家', '创伤'],
    matchThemes: ['war', 'state', 'power', 'massacre', 'violence', 'dictatorship', 'execution', 'discipline', 'historical-trauma']
  },
  {
    id: 'death',
    name: '死亡',
    summary: '从预兆、衰败、老去到哀悼，追踪死亡如何让马孔多的时间不断向终点倾斜。',
    description:
      '死亡主题并不只处理人物离场，也处理家宅、身体、记忆与共同体的衰败。它让全书的繁殖和繁荣始终带着终局阴影。',
    tags: ['衰败', '老去', '哀悼', '空虚'],
    matchThemes: ['death', 'decay', 'aging', 'mourning', 'emptiness']
  },
  {
    id: 'desire',
    name: '情欲',
    summary: '从爱情、美、拒绝、背叛到离弃，追踪情欲如何一次次生成亲密关系里的孤独。',
    description:
      '情欲主题把爱、美、罪感、婚姻和拒绝放在同一条线上。它关心欲望如何打开生活的热度，又如何被家族禁忌、阶序和错认阻断。',
    tags: ['爱情', '美', '拒绝', '罪感'],
    matchThemes: ['desire', 'love', 'beauty', 'betrayal', 'refusal', 'guilt', 'abandonment', 'marriage']
  },
  {
    id: 'modernity',
    name: '现代性',
    summary: '从迁徙、扩张、繁荣到殖民秩序，追踪外部世界如何改写马孔多的生活尺度。',
    description:
      '现代性主题处理外界进入马孔多的各种形式：道路、技术、商业、殖民公司与陌生秩序。它让村庄从神话空间转入被资本和制度丈量的历史现场。',
    tags: ['外部秩序', '扩张', '殖民', '繁荣'],
    matchThemes: ['modernity', 'expansion', 'prosperity', 'migration', 'colonialism', 'foreign-order', 'carnival']
  },
  {
    id: 'fate',
    name: '命运',
    summary: '从回返、重复、元叙事到终局，追踪预言如何在最后成为已经写好的历史。',
    description:
      '命运主题把回返、重复和羊皮卷的终局揭示连成一条线。它让人物行动看似自由，却不断靠近文本早已埋下的闭合结构。',
    tags: ['预言', '终局', '重复', '文本'],
    matchThemes: ['fate', 'ending', 'metafiction', 'return', 'repetition']
  },
  {
    id: 'time',
    name: '时间',
    summary: '从创世的回忆开场到老去、重复与回返，追踪马孔多时间如何弯折成圆环。',
    description:
      '时间主题关注全书最底层的叙事机制：未来回忆、代际复现、名字循环与历史回返。它让线性年代被不断拉弯，最终显出封闭的圆形。',
    tags: ['循环', '回返', '老去', '重复'],
    matchThemes: ['time', 'repetition', 'return', 'aging']
  }
] satisfies ThemeDefinition[];

const THEME_LABELS: Record<string, string> = {
  abandonment: '离弃',
  aging: '老去',
  beauty: '美',
  betrayal: '背叛',
  carnival: '狂欢',
  colonialism: '殖民秩序',
  death: '死亡',
  decay: '衰败',
  desire: '情欲',
  dictatorship: '独裁',
  discipline: '规训',
  emptiness: '空虚',
  ending: '终局',
  execution: '处决',
  expansion: '扩张',
  family: '家族',
  fate: '命运',
  'foreign-order': '外部秩序',
  genesis: '创世',
  guilt: '罪感',
  'historical-trauma': '历史创伤',
  identity: '身份',
  inheritance: '继承',
  legacy: '遗产',
  literature: '文学',
  love: '爱情',
  marriage: '婚姻',
  massacre: '屠杀',
  memory: '记忆',
  metafiction: '元叙事',
  migration: '迁徙',
  modernity: '现代性',
  mourning: '哀悼',
  origin: '起源',
  power: '权力',
  prosperity: '繁荣',
  reading: '阅读',
  refusal: '拒绝',
  repetition: '重复',
  return: '回返',
  state: '国家',
  time: '时间',
  violence: '暴力',
  war: '战争'
};

const RELATION_MAP_KIND_LABELS: Record<RelationMapNodeKind, string> = {
  character: '人物',
  motif: '意象',
  chapter: '章节'
};

const RELATION_TYPE_ORDER: Record<RelationMapNodeKind, number> = {
  character: 1,
  motif: 2,
  chapter: 3
};

const LITERARY_FUNCTION_RULES = [
  {
    label: '战争化 / 国家暴力',
    themes: ['war', 'state', 'power', 'massacre', 'violence', 'dictatorship', 'execution', 'discipline', 'historical-trauma']
  },
  {
    label: '记忆回返 / 叙事自证',
    themes: ['memory', 'return', 'repetition', 'time', 'reading', 'metafiction', 'literature']
  },
  {
    label: '家族封闭 / 血缘继承',
    themes: ['family', 'inheritance', 'marriage', 'legacy', 'origin', 'genesis', 'identity']
  },
  {
    label: '死亡预兆 / 衰败终局',
    themes: ['death', 'decay', 'aging', 'ending', 'fate', 'mourning', 'emptiness']
  },
  {
    label: '情欲阻断 / 孤独生成',
    themes: ['love', 'desire', 'beauty', 'betrayal', 'refusal', 'guilt', 'abandonment']
  },
  {
    label: '现代性侵入 / 外部秩序',
    themes: ['modernity', 'expansion', 'prosperity', 'migration', 'colonialism', 'foreign-order', 'carnival']
  }
];

const FATE_PHASE_NAMES = ['开端', '扩张', '转折', '回落', '终局'];
const MOTIF_EVOLUTION_PHASE_NAMES = ['初现', '扩散', '变形', '回潮', '终局'];

const FATE_FUNCTION_RULES = [
  {
    label: '出走',
    motifs: ['train'],
    themes: ['abandonment', 'migration', 'return'],
    titleKeywords: ['出走', '远征', '离家', '远行', '归来', '放逐']
  },
  {
    label: '守护家族',
    motifs: ['family', 'pig-tail'],
    themes: ['family', 'inheritance', 'legacy', 'origin', 'genesis', 'identity'],
    titleKeywords: ['家族', '家宅', '家业', '命名', '出生', '婚姻', '整顿']
  },
  {
    label: '战争化',
    motifs: ['war', 'power'],
    themes: ['war', 'state', 'power', 'massacre', 'violence', 'dictatorship', 'execution', 'discipline', 'historical-trauma'],
    titleKeywords: ['战争', '起义', '停战', '枪决', '处决', '暴力', '权力']
  },
  {
    label: '情欲阻断',
    motifs: ['desire', 'yellow-butterflies'],
    themes: ['love', 'desire', 'beauty', 'betrayal', 'refusal', 'guilt', 'abandonment', 'marriage'],
    titleKeywords: ['婚礼', '情欲', '爱情', '拒绝', '姐妹', '新娘']
  },
  {
    label: '现代性侵入',
    motifs: ['banana-company', 'train'],
    themes: ['modernity', 'expansion', 'prosperity', 'migration', 'colonialism', 'foreign-order', 'carnival'],
    titleKeywords: ['外界', '繁荣', '公司', '火车', '狂欢', '秩序']
  },
  {
    label: '记忆失明',
    motifs: ['memory', 'insomnia', 'parchment', 'time'],
    themes: ['memory', 'return', 'repetition', 'time', 'reading', 'metafiction', 'literature'],
    titleKeywords: ['记忆', '失明', '失眠', '羊皮卷', '破译', '时间', '遗忘']
  },
  {
    label: '死亡预兆',
    motifs: ['death', 'ants'],
    themes: ['death', 'decay', 'aging', 'fate', 'mourning', 'emptiness'],
    titleKeywords: ['死亡', '临终', '衰退', '预兆', '死']
  },
  {
    label: '终局回返',
    motifs: ['hurricane', 'parchment', 'time'],
    themes: ['ending', 'fate', 'return', 'repetition', 'metafiction'],
    titleKeywords: ['终局', '结尾', '闭环', '回返', '揭示', '循环']
  }
];

const MOTIF_EVOLUTION_FUNCTION_RULES = [
  {
    label: '创世奇迹',
    motifs: ['ice', 'mirror', 'family'],
    themes: ['genesis', 'origin', 'family']
  },
  {
    label: '记忆回返',
    motifs: ['memory', 'insomnia', 'parchment', 'time'],
    themes: ['memory', 'return', 'repetition', 'time', 'reading', 'metafiction', 'literature']
  },
  {
    label: '战争阴影',
    motifs: ['war', 'power', 'banana-company'],
    themes: ['war', 'state', 'power', 'massacre', 'violence', 'dictatorship', 'execution', 'discipline', 'historical-trauma']
  },
  {
    label: '情欲阻断',
    motifs: ['desire', 'yellow-butterflies', 'music'],
    themes: ['love', 'desire', 'beauty', 'betrayal', 'refusal', 'guilt', 'abandonment', 'marriage']
  },
  {
    label: '现代性侵入',
    motifs: ['train', 'banana-company'],
    themes: ['modernity', 'expansion', 'prosperity', 'migration', 'colonialism', 'foreign-order', 'carnival']
  },
  {
    label: '衰败预兆',
    motifs: ['death', 'ants', 'rain', 'decay'],
    themes: ['death', 'decay', 'aging', 'mourning', 'emptiness']
  },
  {
    label: '终局揭示',
    motifs: ['parchment', 'hurricane', 'pig-tail'],
    themes: ['ending', 'fate', 'metafiction', 'reading']
  }
];

export function buildEventTimeline({
  articles,
  chapters,
  characters,
  events,
  motifs
}: ArchiveInput): EventTimelineData {
  const context = createContext({ articles, chapters, characters, events, motifs });
  const timelineEvents = [...events]
    .sort(sortEvents)
    .map((event) => toTimelineEvent(event, context))
    .filter(isEventTimelineEvent);
  const chapterCounts = new Map<number, number>();
  const characterCounts = new Map<string, number>();
  const motifCounts = new Map<string, number>();
  const themeCounts = new Map<string, number>();

  for (const event of timelineEvents) {
    chapterCounts.set(event.chapter, (chapterCounts.get(event.chapter) ?? 0) + 1);
    for (const character of event.characters) {
      characterCounts.set(character.id, (characterCounts.get(character.id) ?? 0) + 1);
    }
    for (const motif of event.motifs) {
      motifCounts.set(motif.id, (motifCounts.get(motif.id) ?? 0) + 1);
    }
    for (const theme of THEME_REGISTRY) {
      if (event.themes.some((themeId) => theme.matchThemes.includes(themeId))) {
        themeCounts.set(theme.id, (themeCounts.get(theme.id) ?? 0) + 1);
      }
    }
  }

  return {
    events: timelineEvents,
    filters: {
      chapters: [...chapters]
        .sort((a, b) => a.data.chapter - b.data.chapter)
        .map((chapter) => withCount(chapterLink(chapter.data.chapter, context), chapterCounts.get(chapter.data.chapter) ?? 0))
        .filter(isEventTimelineFilterOption),
      characters: [...characters]
        .sort(sortCharactersForTimelineFilter)
        .map((character) => withCount(characterLink(character.data.id, context), characterCounts.get(character.data.id) ?? 0))
        .filter(isEventTimelineFilterOption),
      motifs: [...motifs]
        .sort((a, b) => a.data.name.localeCompare(b.data.name, 'zh-CN'))
        .map((motif) => withCount(motifLink(motif.data.id, context), motifCounts.get(motif.data.id) ?? 0))
        .filter(isEventTimelineFilterOption),
      themes: THEME_REGISTRY.map((theme) => themeFilterOption(theme, themeCounts.get(theme.id) ?? 0))
    },
    stats: {
      events: timelineEvents.length,
      chapters: chapters.length,
      characters: characters.length,
      motifs: motifs.length,
      themes: THEME_REGISTRY.length
    }
  };
}

export function buildCharacterArchive({
  character,
  articles,
  chapters,
  characters,
  events,
  motifs
}: ArchiveInput & { character: CharacterEntry }): CharacterArchive {
  const context = createContext({ articles, chapters, characters, events, motifs });
  const characterEvents = events
    .filter((event) => event.data.characters.includes(character.data.id))
    .sort(sortEvents);
  const archiveEvents = characterEvents.map((event) => toArchiveEvent(event, context));

  const eventIds = archiveEvents.map((event) => event.id);
  const chapterNumbers = uniqueNumbers([...character.data.chapters, ...archiveEvents.map((event) => event.chapter)]);
  const motifIds = uniqueStrings([
    ...character.data.motifs,
    ...archiveEvents.flatMap((event) => event.motifs.map((motif) => motif.id))
  ]);
  const eventRelatedArticleSlugs = archiveEvents.flatMap((event) =>
    event.relatedArticles.map((article) => article.id)
  );

  return {
    events: archiveEvents,
    fateLine: buildCharacterFateLine(character.data.id, characterEvents, context),
    chapters: chapterNumbers.map((chapter) => chapterLink(chapter, context)).filter(isRelationLink),
    motifs: motifIds.map((id) => motifLink(id, context)).filter(isRelationLink),
    articles: collectArticleLinks({
      articles,
      manualSlugs: character.data.articles,
      eventRelatedSlugs: eventRelatedArticleSlugs,
      eventIds,
      chapterNumbers,
      characterIds: [character.data.id],
      motifIds
    }),
    coCharacters: collectCoOccurrences(archiveEvents, 'characters', context, character.data.id),
    coMotifs: collectCoOccurrences(archiveEvents, 'motifs', context),
    chapterDensity: collectChapterDensity(archiveEvents, context)
  };
}

export function buildMotifArchive({
  motif,
  articles,
  chapters,
  characters,
  events,
  motifs
}: ArchiveInput & { motif: MotifEntry }): MotifArchive {
  const context = createContext({ articles, chapters, characters, events, motifs });
  const manualEventIds = new Set(motif.data.events);
  const motifEvents = events
    .filter((event) => manualEventIds.has(event.data.id) || event.data.motifs.includes(motif.data.id))
    .sort(sortEvents);
  const archiveEvents = motifEvents.map((event) => toArchiveEvent(event, context));

  const eventIds = archiveEvents.map((event) => event.id);
  const chapterNumbers = uniqueNumbers([
    ...motif.data.keyChapters,
    ...(motif.data.firstAppearanceChapter ? [motif.data.firstAppearanceChapter] : []),
    ...archiveEvents.map((event) => event.chapter)
  ]);
  const characterIds = uniqueStrings([
    ...motif.data.characters,
    ...archiveEvents.flatMap((event) => event.characters.map((character) => character.id))
  ]);
  const eventRelatedArticleSlugs = archiveEvents.flatMap((event) =>
    event.relatedArticles.map((article) => article.id)
  );

  return {
    events: archiveEvents,
    evolutionLine: buildMotifEvolutionLine(motif.data.id, motifEvents, context),
    chapters: chapterNumbers.map((chapter) => chapterLink(chapter, context)).filter(isRelationLink),
    characters: characterIds.map((id) => characterLink(id, context)).filter(isRelationLink),
    articles: collectArticleLinks({
      articles,
      manualSlugs: motif.data.articles,
      eventRelatedSlugs: eventRelatedArticleSlugs,
      eventIds,
      chapterNumbers,
      characterIds,
      motifIds: [motif.data.id]
    }),
    coCharacters: collectCoOccurrences(archiveEvents, 'characters', context),
    coMotifs: collectCoOccurrences(archiveEvents, 'motifs', context, motif.data.id),
    chapterDensity: collectChapterDensity(archiveEvents, context)
  };
}

export function getThemeRegistry() {
  return THEME_REGISTRY;
}

export function buildThemeIndex({
  articles,
  events
}: Pick<ArchiveInput, 'articles' | 'events'>): ThemeIndexItem[] {
  return THEME_REGISTRY.map((theme) => {
    const themeEvents = collectThemeEvents(theme, events);
    const themeEventIds = themeEvents.map((event) => event.data.id);
    const chapterNumbers = uniqueNumbers(themeEvents.map((event) => event.data.chapter));

    return {
      ...theme,
      href: themeHref(theme.id),
      eventCount: themeEvents.length,
      chapterCount: chapterNumbers.length,
      articleCount: collectThemeArticleLinks({
        articles,
        theme,
        eventIds: themeEventIds,
        chapterNumbers,
        limit: Number.POSITIVE_INFINITY
      }).length
    };
  });
}

export function buildThemeArchive({
  theme,
  articles,
  chapters,
  characters,
  events,
  motifs
}: ArchiveInput & { theme: ThemeDefinition }): ThemeArchive {
  const context = createContext({ articles, chapters, characters, events, motifs });
  const themeEvents = collectThemeEvents(theme, events);
  const archiveEvents = themeEvents.map((event) => toArchiveEvent(event, context));
  const eventIds = archiveEvents.map((event) => event.id);
  const chapterNumbers = uniqueNumbers(archiveEvents.map((event) => event.chapter));
  const characterIds = uniqueStrings(archiveEvents.flatMap((event) => event.characters.map((character) => character.id)));
  const motifIds = uniqueStrings(archiveEvents.flatMap((event) => event.motifs.map((motif) => motif.id)));
  const articlesForTheme = collectThemeArticleLinks({
    articles,
    theme,
    eventIds,
    chapterNumbers
  });

  return {
    theme,
    events: archiveEvents,
    evolutionLine: buildThemeEvolutionLine(theme, themeEvents),
    chapters: collectThemeChapterLinks(archiveEvents, context),
    characters: collectThemeEntityLinks(archiveEvents, 'characters', context).slice(0, 12),
    motifs: collectThemeEntityLinks(archiveEvents, 'motifs', context).slice(0, 12),
    articles: articlesForTheme,
    stats: {
      events: archiveEvents.length,
      chapters: chapterNumbers.length,
      characters: characterIds.length,
      motifs: motifIds.length,
      articles: articlesForTheme.length
    }
  };
}

export function buildRelationMap({
  chapters,
  characters,
  events,
  motifs
}: Pick<ArchiveInput, 'chapters' | 'characters' | 'events' | 'motifs'>): RelationMapData {
  const context = createContext({ articles: [], chapters, characters, events, motifs });
  const eventCounts = new Map<string, number>();
  const edgeEvents = new Map<string, { source: string; target: string; events: EventEntry[] }>();

  for (const event of events) {
    const eventNodeIds = uniqueStrings([
      ...event.data.characters
        .filter((id) => context.characterMap.has(id))
        .map((id) => relationMapNodeId('character', id)),
      ...event.data.motifs
        .filter((id) => context.motifMap.has(id))
        .map((id) => relationMapNodeId('motif', id)),
      relationMapNodeId('chapter', String(event.data.chapter))
    ]);

    for (const nodeId of eventNodeIds) {
      eventCounts.set(nodeId, (eventCounts.get(nodeId) ?? 0) + 1);
    }

    for (let index = 0; index < eventNodeIds.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < eventNodeIds.length; nextIndex += 1) {
        const [source, target] = [eventNodeIds[index], eventNodeIds[nextIndex]].sort();
        const edgeId = `${source}|${target}`;
        const existing = edgeEvents.get(edgeId);
        if (existing) {
          existing.events.push(event);
        } else {
          edgeEvents.set(edgeId, { source, target, events: [event] });
        }
      }
    }
  }

  const coreCharacterIds = new Set(
    [...characters]
      .sort((a, b) => sortEntriesByEventCount(a, b, eventCounts, 'character'))
      .slice(0, 12)
      .map((character) => relationMapNodeId('character', character.data.id))
  );
  const coreMotifIds = new Set(
    [...motifs]
      .sort((a, b) => sortEntriesByEventCount(a, b, eventCounts, 'motif'))
      .slice(0, 10)
      .map((motif) => relationMapNodeId('motif', motif.data.id))
  );

  const chapterNodes = [...chapters]
    .sort((a, b) => a.data.chapter - b.data.chapter)
    .map((chapter, index) => {
      const id = relationMapNodeId('chapter', String(chapter.data.chapter));
      return {
        id,
        entityId: String(chapter.data.chapter),
        title: `第${chapter.data.chapter}章`,
        href: chapterHref(chapter.data.chapter),
        kind: 'chapter' as const,
        summary: chapter.data.summary,
        meta: chapter.data.subtitle,
        eventCount: eventCounts.get(id) ?? 0,
        core: true,
        rank: index + 1,
        sortKey: chapter.data.chapter
      };
    });

  const characterNodes = [...characters]
    .sort((a, b) => sortEntriesByEventCount(a, b, eventCounts, 'character'))
    .map((character, index) => {
      const id = relationMapNodeId('character', character.data.id);
      return {
        id,
        entityId: character.data.id,
        title: character.data.name,
        href: characterHref(character.data.slug),
        kind: 'character' as const,
        summary: character.data.summary,
        meta: `第 ${character.data.generation} 代 · ${character.data.role}`,
        eventCount: eventCounts.get(id) ?? 0,
        core: coreCharacterIds.has(id),
        rank: index + 1,
        sortKey: character.data.generation
      };
    });

  const motifNodes = [...motifs]
    .sort((a, b) => sortEntriesByEventCount(a, b, eventCounts, 'motif'))
    .map((motif, index) => {
      const id = relationMapNodeId('motif', motif.data.id);
      return {
        id,
        entityId: motif.data.id,
        title: motif.data.name,
        href: motifHref(motif.data.slug),
        kind: 'motif' as const,
        summary: motif.data.summary,
        meta: motif.data.coreMeanings.slice(0, 2).join(' / ') || '意象',
        eventCount: eventCounts.get(id) ?? 0,
        core: coreMotifIds.has(id),
        rank: index + 1,
        sortKey: motif.data.name
      };
    });

  const nodes = [...chapterNodes, ...characterNodes, ...motifNodes];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const edges = [...edgeEvents.values()]
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map(({ source, target, events }) => {
      const sourceNode = nodesById.get(source);
      const targetNode = nodesById.get(target);
      const sortedEvents = [...events].sort(sortEvents);
      const edgeEvidence =
        sourceNode && targetNode
          ? sortedEvents.map((event) => toRelationMapEdgeEvent(event, sourceNode, targetNode))
          : [];

      return {
        id: `${source}|${target}`,
        source,
        target,
        weight: sortedEvents.length,
        events: edgeEvidence,
        eventIds: edgeEvidence.map((event) => event.id),
        eventTitles: edgeEvidence.slice(0, 4).map((event) => event.title),
        explanation:
          sourceNode && targetNode
            ? buildRelationMapEdgeExplanation(sourceNode, targetNode, sortedEvents, edgeEvidence)
            : emptyRelationMapEdgeExplanation()
      };
    })
    .sort(sortRelationMapEdges);
  const coreNodeIds = new Set(nodes.filter((node) => node.core).map((node) => node.id));
  const defaultEdges = edges.filter((edge) => coreNodeIds.has(edge.source) && coreNodeIds.has(edge.target)).slice(0, 100);

  return {
    nodes,
    edges,
    stats: {
      events: events.length,
      nodes: nodes.length,
      edges: edges.length,
      coreNodes: coreNodeIds.size,
      defaultEdges: defaultEdges.length,
      characters: characterNodes.length,
      motifs: motifNodes.length,
      chapters: chapterNodes.length,
      maxWeight: edges[0]?.weight ?? 0
    }
  };
}

function createContext(input: ArchiveInput) {
  return {
    articleMap: new Map(input.articles.map((article) => [article.data.slug, article])),
    chapterMap: new Map(input.chapters.map((chapter) => [chapter.data.chapter, chapter])),
    characterMap: new Map(input.characters.map((character) => [character.data.id, character])),
    motifMap: new Map(input.motifs.map((motif) => [motif.data.id, motif]))
  };
}

type RelationContext = ReturnType<typeof createContext>;

function toArchiveEvent(event: EventEntry, context: RelationContext): ArchiveEvent {
  return {
    id: event.data.id,
    chapter: event.data.chapter,
    order: event.data.order,
    title: event.data.title,
    summary: event.data.summary,
    href: `${chapterHref(event.data.chapter)}#${event.data.id}`,
    characters: event.data.characters.map((id) => characterLink(id, context)).filter(isRelationLink),
    motifs: event.data.motifs.map((id) => motifLink(id, context)).filter(isRelationLink),
    relatedArticles: event.data.relatedArticles.map((slug) => articleLink(slug, context)).filter(isRelationLink)
  };
}

function buildCharacterFateLine(
  characterId: string,
  events: EventEntry[],
  context: RelationContext
): CharacterFateLine | undefined {
  if (events.length < 3) return undefined;

  const phaseCount = characterFatePhaseCount(events.length);
  const phaseEvents = splitCharacterFateEvents(events, phaseCount);
  const phaseNames = characterFatePhaseNames(phaseEvents.length);
  const phases = phaseEvents.map((eventsInPhase, index) => {
    const functions = characterFateFunctions(eventsInPhase);
    const primaryFunction = functions[0] ?? '叙事共现';

    return {
      id: `${characterId}-fate-${index + 1}`,
      title: `${phaseNames[index]} · ${primaryFunction}`,
      chapterSpan: characterFateChapterSpan(eventsInPhase),
      eventCount: eventsInPhase.length,
      functions,
      motifs: collectCharacterFateMotifs(eventsInPhase, context),
      events: pickCharacterFateEvents(eventsInPhase).map((event) =>
        toCharacterFateEvent(event, characterId)
      )
    };
  });

  return {
    characterId,
    phaseCount: phases.length,
    eventCount: events.length,
    phases
  };
}

function characterFatePhaseCount(eventCount: number) {
  if (eventCount < 3) return 0;
  if (eventCount <= 7) return 3;
  if (eventCount <= 18) return 4;
  return 5;
}

function splitCharacterFateEvents(events: EventEntry[], phaseCount: number) {
  const boundaries = [0];

  for (let phaseIndex = 1; phaseIndex < phaseCount; phaseIndex += 1) {
    const remainingPhases = phaseCount - phaseIndex;
    const minBoundary = boundaries[phaseIndex - 1] + 1;
    const maxBoundary = events.length - remainingPhases;
    const targetBoundary = clamp(
      Math.round((events.length * phaseIndex) / phaseCount),
      minBoundary,
      maxBoundary
    );
    boundaries.push(snapCharacterFateBoundary(events, targetBoundary, minBoundary, maxBoundary));
  }

  boundaries.push(events.length);

  return boundaries.slice(0, -1).map((start, index) => events.slice(start, boundaries[index + 1]));
}

function snapCharacterFateBoundary(
  events: EventEntry[],
  targetBoundary: number,
  minBoundary: number,
  maxBoundary: number
) {
  let bestBoundary = targetBoundary;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let boundary = minBoundary; boundary <= maxBoundary; boundary += 1) {
    const previousEvent = events[boundary - 1];
    const nextEvent = events[boundary];
    if (!previousEvent || !nextEvent || previousEvent.data.chapter === nextEvent.data.chapter) continue;

    const distance = Math.abs(boundary - targetBoundary);
    if (distance > 2) continue;
    if (distance < bestDistance || (distance === bestDistance && boundary >= targetBoundary)) {
      bestBoundary = boundary;
      bestDistance = distance;
    }
  }

  return bestBoundary;
}

function characterFatePhaseNames(phaseCount: number) {
  if (phaseCount <= 3) return ['开端', '转折', '终局'];
  if (phaseCount === 4) return ['开端', '扩张', '回落', '终局'];
  return FATE_PHASE_NAMES;
}

function characterFateChapterSpan(events: EventEntry[]) {
  const chapters = uniqueNumbers(events.map((event) => event.data.chapter));
  if (chapters.length === 0) return '暂无章节';
  if (chapters.length === 1) return `第${chapters[0]}章`;

  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];
  const isConsecutive = chapters.every((chapter, index) => index === 0 || chapter === chapters[index - 1] + 1);

  if (isConsecutive) return `第${firstChapter}至${lastChapter}章`;
  if (chapters.length <= 3) return `第${chapters.join('、')}章`;
  return `第${firstChapter}至${lastChapter}章，共${chapters.length}个章节`;
}

function characterFateFunctions(events: EventEntry[]) {
  const scores = FATE_FUNCTION_RULES.map((rule, ruleIndex) => ({
    label: rule.label,
    score: 0,
    firstEventIndex: Number.POSITIVE_INFINITY,
    ruleIndex
  }));

  events.forEach((event, eventIndex) => {
    const motifs = new Set(event.data.motifs);
    const themes = new Set(event.data.themes);

    FATE_FUNCTION_RULES.forEach((rule, ruleIndex) => {
      let eventScore = 0;
      eventScore += rule.themes.filter((theme) => themes.has(theme)).length * 2;
      eventScore += rule.motifs.filter((motif) => motifs.has(motif)).length * 2;
      if (rule.titleKeywords.some((keyword) => event.data.title.includes(keyword))) eventScore += 1;

      if (eventScore === 0) return;
      scores[ruleIndex].score += eventScore;
      scores[ruleIndex].firstEventIndex = Math.min(scores[ruleIndex].firstEventIndex, eventIndex);
    });
  });

  const labels = scores
    .filter((score) => score.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.firstEventIndex - b.firstEventIndex ||
        a.ruleIndex - b.ruleIndex ||
        a.label.localeCompare(b.label, 'zh-CN')
    )
    .slice(0, 3)
    .map((score) => score.label);

  return labels.length > 0 ? labels : ['叙事共现'];
}

function collectCharacterFateMotifs(events: EventEntry[], context: RelationContext) {
  const counts = new Map<string, { count: number; firstEventIndex: number }>();

  events.forEach((event, eventIndex) => {
    event.data.motifs.forEach((id) => {
      if (!context.motifMap.has(id)) return;
      const existing = counts.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(id, { count: 1, firstEventIndex: eventIndex });
      }
    });
  });

  return [...counts.entries()]
    .map(([id, value]) => {
      const link = motifLink(id, context);
      return link ? { ...link, count: value.count, sortKey: value.firstEventIndex } : undefined;
    })
    .filter(isCoOccurrenceItem)
    .sort(
      (a, b) =>
        b.count - a.count ||
        Number(a.sortKey ?? 0) - Number(b.sortKey ?? 0) ||
        a.title.localeCompare(b.title, 'zh-CN')
    )
    .slice(0, 4);
}

function pickCharacterFateEvents(events: EventEntry[]) {
  if (events.length <= 4) return events;

  const lastIndex = events.length - 1;
  const indices =
    events.length >= 7
      ? [0, Math.floor(lastIndex / 3), Math.floor((lastIndex * 2) / 3), lastIndex]
      : [0, Math.floor(lastIndex / 2), lastIndex];

  return uniqueIndexes(indices).map((index) => events[index]).filter(isEventEntry);
}

function toCharacterFateEvent(event: EventEntry, characterId: string): CharacterFateEvent {
  return {
    id: event.data.id,
    chapter: event.data.chapter,
    order: event.data.order,
    title: event.data.title,
    summary: event.data.summary,
    href: timelineHref({ chapter: event.data.chapter, character: characterId }, event.data.id)
  };
}

function buildMotifEvolutionLine(
  motifId: string,
  events: EventEntry[],
  context: RelationContext
): MotifEvolutionLine | undefined {
  if (events.length < 6) return undefined;

  const phaseCount = motifEvolutionPhaseCount(events.length);
  const phaseEvents = splitMotifEvolutionEvents(events, phaseCount);
  const phaseNames = motifEvolutionPhaseNames(phaseEvents.length);
  const phases = phaseEvents.map((eventsInPhase, index) => {
    const functions = motifEvolutionFunctions(eventsInPhase);
    const primaryFunction = functions[0] ?? '叙事共现';

    return {
      id: `${motifId}-evolution-${index + 1}`,
      title: `${phaseNames[index]} · ${primaryFunction}`,
      chapterSpan: characterFateChapterSpan(eventsInPhase),
      eventCount: eventsInPhase.length,
      functions,
      characters: collectMotifEvolutionCharacters(eventsInPhase, context),
      events: pickMotifEvolutionEvents(eventsInPhase).map((event) =>
        toMotifEvolutionEvent(event, motifId)
      )
    };
  });

  return {
    motifId,
    phaseCount: phases.length,
    eventCount: events.length,
    phases
  };
}

function motifEvolutionPhaseCount(eventCount: number) {
  if (eventCount < 6) return 0;
  if (eventCount <= 7) return 3;
  if (eventCount <= 18) return 4;
  return 5;
}

function splitMotifEvolutionEvents(events: EventEntry[], phaseCount: number) {
  const minPhaseSize = 2;
  const boundaries = [0];

  for (let phaseIndex = 1; phaseIndex < phaseCount; phaseIndex += 1) {
    const remainingPhases = phaseCount - phaseIndex;
    const minBoundary = boundaries[phaseIndex - 1] + minPhaseSize;
    const maxBoundary = events.length - remainingPhases * minPhaseSize;
    const targetBoundary = clamp(
      Math.round((events.length * phaseIndex) / phaseCount),
      minBoundary,
      maxBoundary
    );
    boundaries.push(snapCharacterFateBoundary(events, targetBoundary, minBoundary, maxBoundary));
  }

  boundaries.push(events.length);

  return boundaries.slice(0, -1).map((start, index) => events.slice(start, boundaries[index + 1]));
}

function motifEvolutionPhaseNames(phaseCount: number) {
  if (phaseCount <= 3) return ['初现', '变形', '终局'];
  if (phaseCount === 4) return ['初现', '扩散', '回潮', '终局'];
  return MOTIF_EVOLUTION_PHASE_NAMES;
}

function motifEvolutionFunctions(events: EventEntry[]) {
  const scores = MOTIF_EVOLUTION_FUNCTION_RULES.map((rule, ruleIndex) => ({
    label: rule.label,
    score: 0,
    firstEventIndex: Number.POSITIVE_INFINITY,
    ruleIndex
  }));

  events.forEach((event, eventIndex) => {
    const motifs = new Set(event.data.motifs);
    const themes = new Set(event.data.themes);

    MOTIF_EVOLUTION_FUNCTION_RULES.forEach((rule, ruleIndex) => {
      let eventScore = 0;
      eventScore += rule.themes.filter((theme) => themes.has(theme)).length * 2;
      eventScore += rule.motifs.filter((motif) => motifs.has(motif)).length * 2;

      if (eventScore === 0) return;
      scores[ruleIndex].score += eventScore;
      scores[ruleIndex].firstEventIndex = Math.min(scores[ruleIndex].firstEventIndex, eventIndex);
    });
  });

  const labels = scores
    .filter((score) => score.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.firstEventIndex - b.firstEventIndex ||
        a.ruleIndex - b.ruleIndex ||
        a.label.localeCompare(b.label, 'zh-CN')
    )
    .slice(0, 3)
    .map((score) => score.label);

  return labels.length > 0 ? labels : ['叙事共现'];
}

function collectMotifEvolutionCharacters(events: EventEntry[], context: RelationContext) {
  const counts = new Map<string, { count: number; firstEventIndex: number }>();

  events.forEach((event, eventIndex) => {
    event.data.characters.forEach((id) => {
      if (!context.characterMap.has(id)) return;
      const existing = counts.get(id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(id, { count: 1, firstEventIndex: eventIndex });
      }
    });
  });

  return [...counts.entries()]
    .map(([id, value]) => {
      const link = characterLink(id, context);
      return link ? { ...link, count: value.count, sortKey: value.firstEventIndex } : undefined;
    })
    .filter(isCoOccurrenceItem)
    .sort(
      (a, b) =>
        b.count - a.count ||
        Number(a.sortKey ?? 0) - Number(b.sortKey ?? 0) ||
        a.title.localeCompare(b.title, 'zh-CN')
    )
    .slice(0, 6);
}

function pickMotifEvolutionEvents(events: EventEntry[]) {
  if (events.length <= 4) return events;

  const lastIndex = events.length - 1;
  const indices = [0, Math.floor(lastIndex / 3), Math.floor((lastIndex * 2) / 3), lastIndex];

  return uniqueIndexes(indices).map((index) => events[index]).filter(isEventEntry);
}

function toMotifEvolutionEvent(event: EventEntry, motifId: string): MotifEvolutionEvent {
  return {
    id: event.data.id,
    chapter: event.data.chapter,
    order: event.data.order,
    title: event.data.title,
    summary: event.data.summary,
    href: timelineHref({ chapter: event.data.chapter, motif: motifId }, event.data.id)
  };
}

function collectThemeEvents(theme: ThemeDefinition, events: EventEntry[]) {
  const matchThemes = new Set(theme.matchThemes);
  return events
    .filter((event) => event.data.themes.some((themeId) => matchThemes.has(themeId)))
    .sort(sortEvents);
}

function buildThemeEvolutionLine(theme: ThemeDefinition, events: EventEntry[]): ThemeEvolutionLine | undefined {
  if (events.length < 6) return undefined;

  const phaseCount = themeEvolutionPhaseCount(events.length);
  const phaseEvents = splitThemeEvolutionEvents(events, phaseCount);
  const phaseNames = themeEvolutionPhaseNames(phaseEvents.length);
  const phases = phaseEvents.map((eventsInPhase, index) => {
    const functions = themeEvolutionFunctions(eventsInPhase, theme);
    const primaryFunction = functions[0] ?? theme.name;

    return {
      id: `${theme.id}-evolution-${index + 1}`,
      title: `${phaseNames[index]} · ${primaryFunction}`,
      chapterSpan: characterFateChapterSpan(eventsInPhase),
      eventCount: eventsInPhase.length,
      functions,
      events: pickThemeEvolutionEvents(eventsInPhase).map((event) => toThemeEvolutionEvent(event, theme.id))
    };
  });

  return {
    themeId: theme.id,
    phaseCount: phases.length,
    eventCount: events.length,
    phases
  };
}

function themeEvolutionPhaseCount(eventCount: number) {
  if (eventCount < 6) return 0;
  if (eventCount <= 7) return 3;
  if (eventCount <= 18) return 4;
  return 5;
}

function splitThemeEvolutionEvents(events: EventEntry[], phaseCount: number) {
  const minPhaseSize = 2;
  const boundaries = [0];

  for (let phaseIndex = 1; phaseIndex < phaseCount; phaseIndex += 1) {
    const remainingPhases = phaseCount - phaseIndex;
    const minBoundary = boundaries[phaseIndex - 1] + minPhaseSize;
    const maxBoundary = events.length - remainingPhases * minPhaseSize;
    const targetBoundary = clamp(
      Math.round((events.length * phaseIndex) / phaseCount),
      minBoundary,
      maxBoundary
    );
    boundaries.push(snapCharacterFateBoundary(events, targetBoundary, minBoundary, maxBoundary));
  }

  boundaries.push(events.length);

  return boundaries.slice(0, -1).map((start, index) => events.slice(start, boundaries[index + 1]));
}

function themeEvolutionPhaseNames(phaseCount: number) {
  if (phaseCount <= 3) return ['生成', '转向', '闭合'];
  if (phaseCount === 4) return ['生成', '扩散', '回返', '闭合'];
  return ['生成', '扩散', '转向', '回返', '闭合'];
}

function themeEvolutionFunctions(events: EventEntry[], theme: ThemeDefinition) {
  const matchThemes = new Set(theme.matchThemes);
  const counts = new Map<string, { count: number; firstEventIndex: number; registryIndex: number }>();

  events.forEach((event, eventIndex) => {
    event.data.themes.forEach((themeId) => {
      if (!matchThemes.has(themeId)) return;
      const existing = counts.get(themeId);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(themeId, {
          count: 1,
          firstEventIndex: eventIndex,
          registryIndex: theme.matchThemes.indexOf(themeId)
        });
      }
    });
  });

  const labels = [...counts.entries()]
    .sort(
      (a, b) =>
        b[1].count - a[1].count ||
        a[1].firstEventIndex - b[1].firstEventIndex ||
        a[1].registryIndex - b[1].registryIndex ||
        a[0].localeCompare(b[0], 'zh-CN')
    )
    .slice(0, 3)
    .map(([themeId]) => themeLabel(themeId));

  return labels.length > 0 ? labels : [theme.name];
}

function pickThemeEvolutionEvents(events: EventEntry[]) {
  if (events.length <= 4) return events;

  const lastIndex = events.length - 1;
  const indices = [0, Math.floor(lastIndex / 3), Math.floor((lastIndex * 2) / 3), lastIndex];

  return uniqueIndexes(indices).map((index) => events[index]).filter(isEventEntry);
}

function toThemeEvolutionEvent(event: EventEntry, themeId: string): ThemeEvolutionEvent {
  return {
    id: event.data.id,
    chapter: event.data.chapter,
    order: event.data.order,
    title: event.data.title,
    summary: event.data.summary,
    href: timelineHref({ chapter: event.data.chapter, theme: themeId }, event.data.id)
  };
}

function collectThemeChapterLinks(events: ArchiveEvent[], context: RelationContext) {
  const counts = new Map<number, number>();

  events.forEach((event) => {
    counts.set(event.chapter, (counts.get(event.chapter) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([chapter, count]) => {
      const link = chapterLink(chapter, context);
      return link ? { ...link, count } : undefined;
    })
    .filter(isCoOccurrenceItem)
    .sort((a, b) => b.count - a.count || Number(a.sortKey ?? 0) - Number(b.sortKey ?? 0));
}

function collectThemeEntityLinks(
  events: ArchiveEvent[],
  kind: 'characters' | 'motifs',
  context: RelationContext
) {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    event[kind].forEach((item) => {
      counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([id, count]) => {
      const link = kind === 'characters' ? characterLink(id, context) : motifLink(id, context);
      return link ? { ...link, count } : undefined;
    })
    .filter(isCoOccurrenceItem)
    .sort(sortCoOccurrences);
}

function collectThemeArticleLinks({
  articles,
  theme,
  eventIds,
  chapterNumbers,
  limit = 8
}: {
  articles: ArticleEntry[];
  theme: ThemeDefinition;
  eventIds: string[];
  chapterNumbers: number[];
  limit?: number;
}) {
  return articles
    .filter((article) => isPublic(article.data))
    .map((article) => {
      const directThemeMatch = article.data.themes.includes(theme.id);
      const themeOverlap = overlap(article.data.themes, theme.matchThemes);
      const eventOverlap = overlap(article.data.events, eventIds);
      const chapterOverlap = overlap(article.data.chapters, chapterNumbers);
      const baseScore = (directThemeMatch ? 70 : 0) + themeOverlap * 18 + eventOverlap * 14 + chapterOverlap * 4;
      const score = baseScore + (article.data.type === 'theme-essay' ? 8 : 0);

      return {
        baseScore,
        link: {
          id: article.data.slug,
          title: article.data.title,
          href: articleHref(article.data.slug),
          kind: 'article' as const,
          summary: article.data.summary,
          meta: article.data.type,
          sortKey: Number(article.data.date)
        },
        score
      };
    })
    .filter((item) => item.baseScore > 0)
    .sort((a, b) => b.score - a.score || Number(b.link.sortKey ?? 0) - Number(a.link.sortKey ?? 0))
    .slice(0, limit)
    .map((item) => item.link);
}

function themeLabel(themeId: string) {
  return THEME_LABELS[themeId] ?? themeId;
}

function toRelationMapEdgeEvent(
  event: EventEntry,
  sourceNode: RelationMapNode,
  targetNode: RelationMapNode
): RelationMapEdgeEvent {
  return {
    id: event.data.id,
    title: event.data.title,
    chapter: event.data.chapter,
    order: event.data.order,
    href: timelineHref(relationMapTimelineFilters(event, sourceNode, targetNode), event.data.id)
  };
}

function buildRelationMapEdgeExplanation(
  sourceNode: RelationMapNode,
  targetNode: RelationMapNode,
  events: EventEntry[],
  evidence: RelationMapEdgeEvent[]
): RelationMapEdgeExplanation {
  return {
    relationType: relationMapEdgeType(sourceNode, targetNode),
    timeSpan: relationMapTimeSpan(events),
    keyEvidence: pickRelationMapKeyEvidence(evidence),
    literaryFunctions: relationMapLiteraryFunctions(events)
  };
}

function emptyRelationMapEdgeExplanation(): RelationMapEdgeExplanation {
  return {
    relationType: '关系',
    timeSpan: '暂无结构化时间跨度',
    keyEvidence: [],
    literaryFunctions: ['叙事共现']
  };
}

function relationMapEdgeType(sourceNode: RelationMapNode, targetNode: RelationMapNode) {
  return [sourceNode.kind, targetNode.kind]
    .sort((a, b) => RELATION_TYPE_ORDER[a] - RELATION_TYPE_ORDER[b])
    .map((kind) => RELATION_MAP_KIND_LABELS[kind])
    .join('-');
}

function relationMapTimeSpan(events: EventEntry[]) {
  const chapters = uniqueNumbers(events.map((event) => event.data.chapter));
  if (chapters.length === 0) return '暂无结构化时间跨度';
  if (chapters.length === 1) return `集中在第${chapters[0]}章`;

  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];
  const chapterSpan = lastChapter - firstChapter;

  if (firstChapter <= 2 && lastChapter >= 19) return `横跨第${firstChapter}至${lastChapter}章，接近全书跨度`;
  if (chapterSpan >= 12 || chapters.length >= 8) return `横跨第${firstChapter}至${lastChapter}章，贯穿多个叙事阶段`;
  if (chapters.length <= 3 && chapterSpan <= 4) return `集中在第${chapters.join('、')}章`;

  return `分布在第${firstChapter}至${lastChapter}章，共${chapters.length}个章节`;
}

function pickRelationMapKeyEvidence(evidence: RelationMapEdgeEvent[]) {
  if (evidence.length <= 3) return evidence;

  const chapters = uniqueNumbers(evidence.map((event) => event.chapter));
  const chapterSpan = chapters[chapters.length - 1] - chapters[0];
  if (chapters.length >= 3 || chapterSpan >= 4) {
    return uniqueRelationMapEdgeEvents([
      evidence[0],
      evidence[Math.floor((evidence.length - 1) / 2)],
      evidence[evidence.length - 1]
    ]);
  }

  return evidence.slice(0, 3);
}

function uniqueRelationMapEdgeEvents(events: RelationMapEdgeEvent[]) {
  const seen = new Set<string>();
  return events.filter((event) => {
    if (seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  });
}

function relationMapLiteraryFunctions(events: EventEntry[]) {
  const scores = LITERARY_FUNCTION_RULES.map((rule, ruleIndex) => ({
    label: rule.label,
    count: 0,
    firstEventIndex: Number.POSITIVE_INFINITY,
    ruleIndex
  }));

  events.forEach((event, eventIndex) => {
    const themes = new Set(event.data.themes);
    LITERARY_FUNCTION_RULES.forEach((rule, ruleIndex) => {
      if (!rule.themes.some((theme) => themes.has(theme))) return;
      scores[ruleIndex].count += 1;
      scores[ruleIndex].firstEventIndex = Math.min(scores[ruleIndex].firstEventIndex, eventIndex);
    });
  });

  const labels = scores
    .filter((score) => score.count > 0)
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.firstEventIndex - b.firstEventIndex ||
        a.ruleIndex - b.ruleIndex ||
        a.label.localeCompare(b.label, 'zh-CN')
    )
    .slice(0, 3)
    .map((score) => score.label);

  return labels.length > 0 ? labels : ['叙事共现'];
}

function relationMapTimelineFilters(
  event: EventEntry,
  sourceNode: RelationMapNode,
  targetNode: RelationMapNode
) {
  const filters: { chapter: number; character?: string; motif?: string } = {
    chapter: event.data.chapter
  };
  const edgeNodes = [sourceNode, targetNode];
  const characters = edgeNodes.filter((node) => node.kind === 'character');
  const motifs = edgeNodes.filter((node) => node.kind === 'motif');

  if (characters.length === 1) filters.character = characters[0].entityId;
  if (motifs.length === 1) filters.motif = motifs[0].entityId;

  return filters;
}

function toTimelineEvent(event: EventEntry, context: RelationContext): EventTimelineEvent | undefined {
  const link = chapterLink(event.data.chapter, context);
  if (!link) return undefined;

  return {
    id: event.data.id,
    chapter: event.data.chapter,
    order: event.data.order,
    title: event.data.title,
    summary: event.data.summary,
    href: timelineHref({}, event.data.id),
    chapterLink: link,
    characters: event.data.characters.map((id) => characterLink(id, context)).filter(isRelationLink),
    motifs: event.data.motifs.map((id) => motifLink(id, context)).filter(isRelationLink),
    relatedArticles: event.data.relatedArticles.map((slug) => articleLink(slug, context)).filter(isRelationLink),
    themes: event.data.themes
  };
}

function collectArticleLinks({
  articles,
  manualSlugs,
  eventRelatedSlugs,
  eventIds,
  chapterNumbers,
  characterIds,
  motifIds
}: {
  articles: ArticleEntry[];
  manualSlugs: string[];
  eventRelatedSlugs: string[];
  eventIds: string[];
  chapterNumbers: number[];
  characterIds: string[];
  motifIds: string[];
}) {
  const manualSet = new Set(manualSlugs);
  const eventRelatedSet = new Set(eventRelatedSlugs);

  return articles
    .filter((article) => isPublic(article.data))
    .map((article) => {
      let score = 0;
      if (manualSet.has(article.data.slug)) score += 100;
      if (eventRelatedSet.has(article.data.slug)) score += 80;
      score += overlap(article.data.events, eventIds) * 12;
      score += overlap(article.data.characters, characterIds) * 10;
      score += overlap(article.data.motifs, motifIds) * 8;
      score += overlap(article.data.chapters, chapterNumbers) * 4;

      return {
        link: {
          id: article.data.slug,
          title: article.data.title,
          href: articleHref(article.data.slug),
          kind: 'article' as const,
          summary: article.data.summary,
          meta: article.data.type,
          sortKey: Number(article.data.date)
        },
        score
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.link.sortKey ?? 0) - Number(a.link.sortKey ?? 0))
    .map((item) => item.link);
}

function collectCoOccurrences(
  events: ArchiveEvent[],
  kind: 'characters' | 'motifs',
  context: RelationContext,
  excludeId?: string
): CoOccurrenceItem[] {
  const counts = new Map<string, number>();

  for (const event of events) {
    for (const item of event[kind]) {
      if (item.id === excludeId) continue;
      counts.set(item.id, (counts.get(item.id) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([id, count]) => {
      const link = kind === 'characters' ? characterLink(id, context) : motifLink(id, context);
      return link ? { ...link, count } : undefined;
    })
    .filter(isCoOccurrenceItem)
    .sort(sortCoOccurrences);
}

function collectChapterDensity(events: ArchiveEvent[], context: RelationContext): CoOccurrenceItem[] {
  const counts = new Map<number, number>();

  for (const event of events) {
    counts.set(event.chapter, (counts.get(event.chapter) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([chapter, count]) => {
      const link = chapterLink(chapter, context);
      return link ? { ...link, count } : undefined;
    })
    .filter(isCoOccurrenceItem)
    .sort((a, b) => Number(a.sortKey ?? 0) - Number(b.sortKey ?? 0));
}

function articleLink(slug: string, context: RelationContext): RelationLink | undefined {
  const article = context.articleMap.get(slug);
  if (!article || !isPublic(article.data)) return undefined;
  return {
    id: article.data.slug,
    title: article.data.title,
    href: articleHref(article.data.slug),
    kind: 'article',
    summary: article.data.summary,
    meta: article.data.type,
    sortKey: Number(article.data.date)
  };
}

function chapterLink(chapterNumber: number, context: RelationContext): RelationLink | undefined {
  const chapter = context.chapterMap.get(chapterNumber);
  if (!chapter) return undefined;
  return {
    id: String(chapter.data.chapter),
    title: `第${chapter.data.chapter}章：${chapter.data.subtitle}`,
    href: chapterHref(chapter.data.chapter),
    kind: 'chapter',
    summary: chapter.data.summary,
    meta: chapter.data.phase,
    sortKey: chapter.data.chapter
  };
}

function characterLink(id: string, context: RelationContext): RelationLink | undefined {
  const character = context.characterMap.get(id);
  if (!character) return undefined;
  return {
    id: character.data.id,
    title: character.data.name,
    href: characterHref(character.data.slug),
    kind: 'character',
    summary: character.data.summary,
    meta: `第 ${character.data.generation} 代`,
    sortKey: character.data.generation
  };
}

function motifLink(id: string, context: RelationContext): RelationLink | undefined {
  const motif = context.motifMap.get(id);
  if (!motif) return undefined;
  return {
    id: motif.data.id,
    title: motif.data.name,
    href: motifHref(motif.data.slug),
    kind: 'motif',
    summary: motif.data.summary,
    meta: motif.data.coreMeanings.slice(0, 2).join(' / '),
    sortKey: motif.data.name
  };
}

function themeFilterOption(theme: ThemeDefinition, count: number): EventTimelineFilterOption {
  return {
    id: theme.id,
    title: theme.name,
    href: themeHref(theme.id),
    kind: 'theme',
    summary: theme.summary,
    meta: theme.tags.join(' / '),
    sortKey: theme.id,
    count,
    matchThemes: theme.matchThemes
  };
}

function sortEvents(a: EventEntry, b: EventEntry) {
  return a.data.chapter - b.data.chapter || a.data.order - b.data.order;
}

function sortCharactersForTimelineFilter(a: CharacterEntry, b: CharacterEntry) {
  return a.data.generation - b.data.generation || a.data.name.localeCompare(b.data.name, 'zh-CN');
}

function sortCoOccurrences(a: CoOccurrenceItem, b: CoOccurrenceItem) {
  return b.count - a.count || a.title.localeCompare(b.title, 'zh-CN');
}

function sortRelationMapEdges(a: RelationMapEdge, b: RelationMapEdge) {
  return b.weight - a.weight || a.id.localeCompare(b.id, 'zh-CN');
}

function sortEntriesByEventCount(
  a: CharacterEntry | MotifEntry,
  b: CharacterEntry | MotifEntry,
  eventCounts: Map<string, number>,
  kind: 'character' | 'motif'
) {
  const aCount = eventCounts.get(relationMapNodeId(kind, a.data.id)) ?? 0;
  const bCount = eventCounts.get(relationMapNodeId(kind, b.data.id)) ?? 0;
  if (aCount !== bCount) return bCount - aCount;

  if (kind === 'character') {
    const aGeneration = 'generation' in a.data ? a.data.generation : 0;
    const bGeneration = 'generation' in b.data ? b.data.generation : 0;
    if (aGeneration !== bGeneration) return aGeneration - bGeneration;
  }

  const aTitle = 'name' in a.data ? a.data.name : a.data.id;
  const bTitle = 'name' in b.data ? b.data.name : b.data.id;
  return aTitle.localeCompare(bTitle, 'zh-CN');
}

function relationMapNodeId(kind: RelationMapNodeKind, id: string) {
  if (kind === 'chapter') return `${kind}:${String(id).padStart(2, '0')}`;
  return `${kind}:${id}`;
}

function overlap<T>(a: T[] = [], b: T[] = []) {
  const bSet = new Set(b);
  return a.filter((item) => bSet.has(item)).length;
}

function uniqueNumbers(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function uniqueStrings(values: string[]) {
  return [...new Set(values)].filter(Boolean);
}

function uniqueIndexes(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function withCount(link: RelationLink | undefined, count: number): EventTimelineFilterOption | undefined {
  return link ? { ...link, count } : undefined;
}

function isRelationLink(value: RelationLink | undefined): value is RelationLink {
  return Boolean(value);
}

function isEventTimelineEvent(value: EventTimelineEvent | undefined): value is EventTimelineEvent {
  return Boolean(value);
}

function isEventEntry(value: EventEntry | undefined): value is EventEntry {
  return Boolean(value);
}

function isEventTimelineFilterOption(
  value: EventTimelineFilterOption | undefined
): value is EventTimelineFilterOption {
  return Boolean(value);
}

function isCoOccurrenceItem(value: CoOccurrenceItem | undefined): value is CoOccurrenceItem {
  return Boolean(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
