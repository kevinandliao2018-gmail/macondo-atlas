import { RotateCcw, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

type ArchiveContext = {
  type: string;
  title: string;
  summary: string;
  tags?: string[];
  facts?: Record<string, string | number | boolean | null>;
};

interface Props {
  context: ArchiveContext;
  prompts?: string[];
}

type AiResponse = {
  answer?: string;
  error?: string;
};

const DEFAULT_PROMPTS = [
  '这条档案最关键的叙事作用是什么？',
  '它和孤独主题有什么关系？',
  '我接下来应该沿着哪条线索阅读？'
];

const MAX_QUESTION_CHARS = 800;

export default function AiArchivePanel({ context, prompts = DEFAULT_PROMPTS }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const submitQuestion = async (nextQuestion = question) => {
    const trimmedQuestion = nextQuestion.trim();
    if (!trimmedQuestion || isLoading) {
      return;
    }

    if (trimmedQuestion.length > MAX_QUESTION_CHARS) {
      setError('问题过长，请压缩到 800 字以内。');
      return;
    }

    setQuestion(trimmedQuestion);
    setAnswer('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          context
        })
      });

      const data = (await response.json()) as AiResponse;
      if (!response.ok || data.error) {
        throw new Error(data.error ?? 'AI 服务暂时不可用。');
      }

      setAnswer(data.answer ?? '');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'AI 服务暂时不可用。');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPanel = () => {
    setQuestion('');
    setAnswer('');
    setError('');
  };

  return (
    <section className="surface ai-archive-panel" aria-labelledby={`ai-archive-${context.type}`}>
      <div className="ai-archive-heading">
        <div>
          <p className="eyebrow">AI Archive</p>
          <h2 id={`ai-archive-${context.type}`}>档案助手</h2>
        </div>
        <Sparkles aria-hidden="true" className="ai-archive-mark" />
      </div>

      <div className="ai-archive-context">
        <span>{context.title}</span>
        {context.tags?.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="ai-archive-prompts" aria-label="预设问题">
        {prompts.slice(0, 3).map((prompt) => (
          <button
            key={prompt}
            className="ai-archive-prompt"
            type="button"
            disabled={isLoading}
            onClick={() => void submitQuestion(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="ai-archive-form"
        onSubmit={(event) => {
          event.preventDefault();
          void submitQuestion();
        }}
      >
        <label className="ai-archive-label" htmlFor={`ai-question-${context.type}`}>
          向档案提问
        </label>
        <div className="ai-archive-input-row">
          <textarea
            id={`ai-question-${context.type}`}
            value={question}
            maxLength={MAX_QUESTION_CHARS}
            rows={3}
            disabled={isLoading}
            placeholder="例如：它如何推动家族命运的闭合？"
            onChange={(event) => setQuestion(event.target.value)}
          />
          <div className="ai-archive-actions">
            <button
              className="ai-archive-icon-button"
              type="button"
              title="清空"
              aria-label="清空"
              disabled={isLoading || (!question && !answer && !error)}
              onClick={resetPanel}
            >
              <RotateCcw aria-hidden="true" size={18} />
            </button>
            <button className="ai-archive-submit" type="submit" disabled={isLoading || !question.trim()}>
              <Send aria-hidden="true" size={18} />
              <span>{isLoading ? '生成中' : '询问'}</span>
            </button>
          </div>
        </div>
      </form>

      {error && <p className="ai-archive-error" role="alert">{error}</p>}
      {answer && (
        <div className="ai-archive-answer" aria-live="polite">
          {answer.split(/\n{2,}/).map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 16)}`}>{paragraph}</p>
          ))}
        </div>
      )}
    </section>
  );
}
