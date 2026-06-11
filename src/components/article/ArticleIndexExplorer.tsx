import { BookOpen, CircleDot, Files, FilterX, Tags, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { ArticleIndexData, ArticleIndexFilterOption } from '@lib/relations';

type Props = {
  data: ArticleIndexData;
};

type Filters = {
  type: string;
  chapter: string;
  character: string;
  motif: string;
  theme: string;
};

const EMPTY_FILTERS: Filters = {
  type: '',
  chapter: '',
  character: '',
  motif: '',
  theme: ''
};

export default function ArticleIndexExplorer({ data }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') ?? '';
    const chapter = normalizeChapter(params.get('chapter'));
    const character = params.get('character') ?? '';
    const motif = params.get('motif') ?? '';
    const theme = params.get('theme') ?? '';

    setFilters({
      type: hasOption(data.filters.types, type) ? type : '',
      chapter: hasOption(data.filters.chapters, chapter) ? chapter : '',
      character: hasOption(data.filters.characters, character) ? character : '',
      motif: hasOption(data.filters.motifs, motif) ? motif : '',
      theme: hasOption(data.filters.themes, theme) ? theme : ''
    });
    setReady(true);
  }, [data.filters.chapters, data.filters.characters, data.filters.motifs, data.filters.themes, data.filters.types]);

  useEffect(() => {
    if (!ready) return;

    const url = new URL(window.location.href);
    syncParam(url.searchParams, 'type', filters.type);
    syncParam(url.searchParams, 'chapter', filters.chapter);
    syncParam(url.searchParams, 'character', filters.character);
    syncParam(url.searchParams, 'motif', filters.motif);
    syncParam(url.searchParams, 'theme', filters.theme);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [filters, ready]);

  const filteredArticles = useMemo(
    () =>
      data.articles.filter((article) => {
        const typeMatches = !filters.type || article.type === filters.type;
        const chapterMatches = !filters.chapter || article.chapters.includes(filters.chapter);
        const characterMatches = !filters.character || article.characters.includes(filters.character);
        const motifMatches = !filters.motif || article.motifs.includes(filters.motif);
        const themeMatches = !filters.theme || article.themes.includes(filters.theme);
        return typeMatches && chapterMatches && characterMatches && motifMatches && themeMatches;
      }),
    [data.articles, filters]
  );

  const hasActiveFilters = Boolean(filters.type || filters.chapter || filters.character || filters.motif || filters.theme);
  const status = hasActiveFilters
    ? `显示 ${filteredArticles.length} / ${data.stats.articles} 篇文章`
    : `显示全部 ${data.stats.articles} 篇文章`;

  const changeFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    if (ready) window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="article-index-tool">
      <div className="article-index-toolbar" aria-label="文章索引筛选">
        <label className="article-index-field">
          <span>
            <Files aria-hidden="true" size={15} />
            类型
          </span>
          <select
            className="article-index-select"
            onChange={(event) => changeFilter('type', event.target.value)}
            value={filters.type}
          >
            <option value="">全部类型</option>
            {data.filters.types.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <label className="article-index-field">
          <span>
            <BookOpen aria-hidden="true" size={15} />
            章节
          </span>
          <select
            className="article-index-select"
            onChange={(event) => changeFilter('chapter', event.target.value)}
            value={filters.chapter}
          >
            <option value="">全部章节</option>
            {data.filters.chapters.map((option) => (
              <option key={option.id} value={option.id}>
                {chapterOptionLabel(option)}
              </option>
            ))}
          </select>
        </label>

        <label className="article-index-field">
          <span>
            <Users aria-hidden="true" size={15} />
            人物
          </span>
          <select
            className="article-index-select"
            onChange={(event) => changeFilter('character', event.target.value)}
            value={filters.character}
          >
            <option value="">全部人物</option>
            {data.filters.characters.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <label className="article-index-field">
          <span>
            <CircleDot aria-hidden="true" size={15} />
            意象
          </span>
          <select
            className="article-index-select"
            onChange={(event) => changeFilter('motif', event.target.value)}
            value={filters.motif}
          >
            <option value="">全部意象</option>
            {data.filters.motifs.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <label className="article-index-field">
          <span>
            <Tags aria-hidden="true" size={15} />
            主题
          </span>
          <select
            className="article-index-select"
            onChange={(event) => changeFilter('theme', event.target.value)}
            value={filters.theme}
          >
            <option value="">全部主题</option>
            {data.filters.themes.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title} ({option.count})
              </option>
            ))}
          </select>
        </label>

        <button className="article-index-clear" disabled={!hasActiveFilters} onClick={clearFilters} type="button">
          <FilterX aria-hidden="true" size={16} />
          <span>清除筛选</span>
        </button>

        <span className="article-index-status" aria-live="polite">
          {status}
        </span>
      </div>

      {filteredArticles.length > 0 ? (
        <section className="article-index-grid" aria-label="文章列表">
          {filteredArticles.map((article) => (
            <a className="link-card article-index-card" href={article.href} key={article.id}>
              <strong>{article.title}</strong>
              <span>{article.summary}</span>
              <div className="meta-row">
                {article.tags.slice(0, 5).map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </section>
      ) : (
        <div className="article-index-empty">
          <p className="eyebrow">No Matched Articles</p>
          <h2>暂时没有匹配的文章</h2>
          <p className="muted">可以放宽类型、章节、人物、意象或主题筛选，回到完整文章索引中继续查找。</p>
        </div>
      )}
    </div>
  );
}

function syncParam(params: URLSearchParams, key: keyof Filters, value: string) {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

function normalizeChapter(value: string | null) {
  if (!value) return '';
  const chapter = Number(value);
  return Number.isInteger(chapter) && chapter > 0 ? String(chapter) : '';
}

function hasOption(options: ArticleIndexFilterOption[], value: string) {
  return !value || options.some((option) => option.id === value);
}

function chapterOptionLabel(option: ArticleIndexFilterOption) {
  return `${option.title.replace('：', ' · ')} (${option.count})`;
}
