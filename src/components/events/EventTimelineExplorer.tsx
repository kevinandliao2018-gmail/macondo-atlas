import { ArrowUpRight, BookOpen, CircleDot, FilterX, Tags, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { EventTimelineData, EventTimelineEvent, EventTimelineFilterOption } from '@lib/relations';

type Props = {
  data: EventTimelineData;
};

type Filters = {
  chapter: string;
  character: string;
  motif: string;
  theme: string;
};

type TimelineGroup = {
  chapter: EventTimelineEvent['chapterLink'];
  chapterNumber: number;
  events: EventTimelineEvent[];
};

const EMPTY_FILTERS: Filters = {
  chapter: '',
  character: '',
  motif: '',
  theme: ''
};

export default function EventTimelineExplorer({ data }: Props) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chapter = normalizeChapter(params.get('chapter'));
    const character = params.get('character') ?? '';
    const motif = params.get('motif') ?? '';
    const theme = params.get('theme') ?? '';

    setFilters({
      chapter: hasOption(data.filters.chapters, chapter) ? chapter : '',
      character: hasOption(data.filters.characters, character) ? character : '',
      motif: hasOption(data.filters.motifs, motif) ? motif : '',
      theme: hasOption(data.filters.themes, theme) ? theme : ''
    });
    setReady(true);
  }, [data.filters.chapters, data.filters.characters, data.filters.motifs, data.filters.themes]);

  useEffect(() => {
    if (!ready) return;

    const url = new URL(window.location.href);
    syncParam(url.searchParams, 'chapter', filters.chapter);
    syncParam(url.searchParams, 'character', filters.character);
    syncParam(url.searchParams, 'motif', filters.motif);
    syncParam(url.searchParams, 'theme', filters.theme);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [filters, ready]);

  const selectedTheme = useMemo(
    () => data.filters.themes.find((option) => option.id === filters.theme),
    [data.filters.themes, filters.theme]
  );

  const filteredEvents = useMemo(() => {
    const selectedChapter = Number(filters.chapter);
    return data.events.filter((event) => {
      const chapterMatches = !filters.chapter || event.chapter === selectedChapter;
      const characterMatches =
        !filters.character || event.characters.some((character) => character.id === filters.character);
      const motifMatches = !filters.motif || event.motifs.some((motif) => motif.id === filters.motif);
      const themeMatches =
        !filters.theme || Boolean(selectedTheme?.matchThemes?.some((themeId) => event.themes.includes(themeId)));
      return chapterMatches && characterMatches && motifMatches && themeMatches;
    });
  }, [data.events, filters, selectedTheme]);

  const groups = useMemo(() => groupEvents(filteredEvents), [filteredEvents]);
  const hasActiveFilters = Boolean(filters.chapter || filters.character || filters.motif || filters.theme);
  const status = hasActiveFilters
    ? `显示 ${filteredEvents.length} / ${data.stats.events} 个事件 · ${groups.length} 个章节`
    : `显示全部 ${data.stats.events} 个事件 · ${groups.length} 个章节`;

  const changeFilter = (key: keyof Filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    if (ready) window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="event-timeline-tool">
      <div className="event-timeline-toolbar" aria-label="事件时间线筛选">
        <label className="event-timeline-field">
          <span>
            <BookOpen aria-hidden="true" size={15} />
            章节
          </span>
          <select
            className="event-timeline-select"
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

        <label className="event-timeline-field">
          <span>
            <Users aria-hidden="true" size={15} />
            人物
          </span>
          <select
            className="event-timeline-select"
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

        <label className="event-timeline-field">
          <span>
            <CircleDot aria-hidden="true" size={15} />
            意象
          </span>
          <select
            className="event-timeline-select"
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

        <label className="event-timeline-field">
          <span>
            <Tags aria-hidden="true" size={15} />
            主题
          </span>
          <select
            className="event-timeline-select"
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

        <button
          className="event-timeline-clear"
          disabled={!hasActiveFilters}
          onClick={clearFilters}
          type="button"
        >
          <FilterX aria-hidden="true" size={16} />
          <span>清除筛选</span>
        </button>

        <span className="event-timeline-status" aria-live="polite">
          {status}
        </span>
      </div>

      {groups.length > 0 ? (
        <div className="event-timeline-chapters">
          {groups.map((group) => (
            <section className="event-timeline-chapter" key={group.chapterNumber}>
              <a
                className="event-timeline-chapter-heading"
                href={group.chapter.href}
                id={`timeline-chapter-${String(group.chapterNumber).padStart(2, '0')}`}
              >
                <span>{group.chapter.title}</span>
                <small>
                  {group.events.length} 个事件
                  <ArrowUpRight aria-hidden="true" size={14} />
                </small>
              </a>
              <ol className="timeline timeline-archive event-timeline-list">
                {group.events.map((event) => (
                  <li className="event-timeline-item" id={event.id} key={event.id}>
                    <span className="dot">{String(event.order).padStart(2, '0')}</span>
                    <div className="event-timeline-item-body">
                      <a className="event-title" href={`#${event.id}`}>
                        {event.title}
                      </a>
                      <p className="muted">{event.summary}</p>
                      <div className="relation-event-meta">
                        {event.characters.length > 0 && (
                          <div className="meta-row">
                            {event.characters.map((character) => (
                              <a className="tag" href={character.href} key={character.id}>
                                {character.title}
                              </a>
                            ))}
                          </div>
                        )}
                        {event.motifs.length > 0 && (
                          <div className="meta-row">
                            {event.motifs.map((motif) => (
                              <a className="tag tag-muted" href={motif.href} key={motif.id}>
                                {motif.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className="event-timeline-empty">
          <p className="eyebrow">No Matched Events</p>
          <h2>暂时没有匹配的事件</h2>
          <p className="muted">可以放宽章节、人物、意象或主题筛选，回到全书的叙事主线中继续查找。</p>
        </div>
      )}
    </div>
  );
}

function groupEvents(events: EventTimelineEvent[]) {
  return events.reduce<TimelineGroup[]>((groups, event) => {
    const group = groups.find((item) => item.chapterNumber === event.chapter);
    if (group) {
      group.events.push(event);
    } else {
      groups.push({ chapter: event.chapterLink, chapterNumber: event.chapter, events: [event] });
    }
    return groups;
  }, []);
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

function hasOption(options: EventTimelineFilterOption[], value: string) {
  return !value || options.some((option) => option.id === value);
}

function chapterOptionLabel(option: EventTimelineFilterOption) {
  return `${option.title.replace('：', ' · ')} (${option.count})`;
}
