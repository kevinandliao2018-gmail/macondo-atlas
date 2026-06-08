import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PagefindApi = {
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }> }>;
  }>;
};

type SearchResult = {
  url: string;
  title: string;
  excerpt: string;
};

export default function SearchPanel() {
  const [pagefind, setPagefind] = useState<PagefindApi | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState('搜索索引会在构建后启用。');

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-pagefind]');
    const applyPagefind = () => {
      const api = (window as unknown as { pagefind?: PagefindApi }).pagefind;
      if (api) {
        setPagefind(api);
        setStatus('输入关键词开始检索。');
      } else {
        setStatus('开发模式下尚未生成 Pagefind 索引，构建后可用。');
      }
    };

    if (existing) {
      applyPagefind();
      return;
    }

    const script = document.createElement('script');
    script.src = '/pagefind/pagefind.js';
    script.async = true;
    script.dataset.pagefind = 'true';
    script.onload = applyPagefind;
    script.onerror = () => setStatus('开发模式下尚未生成 Pagefind 索引，构建后可用。');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const runSearch = async () => {
      const value = query.trim();
      if (!value) {
        setResults([]);
        return;
      }
      if (!pagefind) {
        return;
      }
      setStatus('检索中...');
      const response = await pagefind.search(value);
      const items = await Promise.all(response.results.slice(0, 12).map((result) => result.data()));
      if (!cancelled) {
        setResults(
          items.map((item) => ({
            url: item.url,
            title: item.meta.title ?? item.url,
            excerpt: item.excerpt
          }))
        );
        setStatus(items.length > 0 ? `找到 ${items.length} 条结果。` : '没有找到匹配结果。');
      }
    };

    const timer = window.setTimeout(runSearch, 180);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pagefind, query]);

  const placeholder = useMemo(() => '雨、乌尔苏拉、冰块、马孔多...', []);

  return (
    <div className="search-box">
      <label style={{ display: 'grid', gap: '8px' }}>
        <span className="eyebrow">Archive Search</span>
        <span style={{ position: 'relative' }}>
          <Search aria-hidden="true" size={20} style={{ color: 'var(--green)', left: 14, position: 'absolute', top: 16 }} />
          <input
            className="search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            style={{ paddingLeft: 44 }}
            type="search"
            value={query}
          />
        </span>
      </label>
      <p className="muted" aria-live="polite">{status}</p>
      <div>
        {results.map((result) => (
          <article className="search-result" key={result.url}>
            <a href={result.url}>{result.title}</a>
            <p className="muted" dangerouslySetInnerHTML={{ __html: result.excerpt }} />
          </article>
        ))}
      </div>
    </div>
  );
}
