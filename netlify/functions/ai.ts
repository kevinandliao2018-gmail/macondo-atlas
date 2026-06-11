type ArchiveContext = {
  type?: string;
  title?: string;
  summary?: string;
  tags?: string[];
  facts?: Record<string, string | number | boolean | null>;
};

type RequestPayload = {
  question?: unknown;
  context?: ArchiveContext;
};

type BedrockContentBlock = {
  text?: string;
};

type BedrockConverseResponse = {
  output?: {
    message?: {
      content?: BedrockContentBlock[];
    };
  };
};

declare const Netlify:
  | {
      env?: {
        get: (name: string) => string | undefined;
      };
    }
  | undefined;

const MAX_BODY_BYTES = 12_000;
const MAX_QUESTION_CHARS = 800;
const MAX_CONTEXT_CHARS = 4_500;
const BEDROCK_TIMEOUT_MS = 45_000;

const SYSTEM_PROMPT = [
  "你是“马孔多档案馆”的中文文学档案助手。",
  "只能基于用户传入的结构化档案信息回答《百年孤独》相关问题。",
  "如果信息不足，请明确说明“当前档案信息不足以判断”，并给出可继续阅读的方向。",
  "不要编造未提供的情节细节，不要输出大段作品原文，不要声称你读取了页面 Markdown 正文。",
  "回答要短而有结构，优先使用档案、人物、意象、主题、事件线索来解释。"
].join("\n");

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "只支持 POST 请求。" }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ error: "请求内容过长。" }, 413);
  }

  const token = getEnv("AWS_BEARER_TOKEN_BEDROCK");
  const model = getEnv("ANTHROPIC_MODEL");
  const region = getEnv("BEDROCK_REGION") ?? "us-east-1";

  if (!token || !model) {
    return json({ error: "AI 服务尚未配置。" }, 500);
  }

  let payload: RequestPayload;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return json({ error: "请求内容过长。" }, 413);
    }
    payload = JSON.parse(rawBody) as RequestPayload;
  } catch {
    return json({ error: "请求格式无效。" }, 400);
  }

  const question = typeof payload.question === "string" ? payload.question.trim() : "";
  if (!question) {
    return json({ error: "请输入一个问题。" }, 400);
  }

  if (question.length > MAX_QUESTION_CHARS) {
    return json({ error: "问题过长，请压缩到 800 字以内。" }, 400);
  }

  const context = normalizeContext(payload.context);
  const contextJson = JSON.stringify(context);
  if (contextJson.length > MAX_CONTEXT_CHARS) {
    return json({ error: "档案上下文过长。" }, 400);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BEDROCK_TIMEOUT_MS);

  try {
    const bedrockResponse = await fetch(
      `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(model)}/converse`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          system: [{ text: SYSTEM_PROMPT }],
          messages: [
            {
              role: "user",
              content: [{ text: buildUserPrompt(question, context) }]
            }
          ],
          inferenceConfig: {
            maxTokens: 900
          }
        }),
        signal: controller.signal
      }
    );

    if (!bedrockResponse.ok) {
      const errorText = await bedrockResponse.text();
      console.warn("Bedrock Converse request failed", {
        status: bedrockResponse.status,
        body: sanitizeLogText(errorText)
      });
      return json({ error: classifyBedrockError(bedrockResponse.status) }, bedrockResponse.status);
    }

    const data = (await bedrockResponse.json()) as BedrockConverseResponse;
    const answer = extractAnswer(data);

    if (!answer) {
      return json({ error: "AI 服务暂时没有返回可读内容。" }, 502);
    }

    return json({ answer });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return json({ error: "AI 服务响应超时，请稍后再试。" }, 504);
    }
    return json({ error: "AI 服务暂时不可用。" }, 502);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const config = {
  path: "/api/ai"
};

function getEnv(name: string) {
  try {
    if (typeof Netlify === "undefined") {
      return undefined;
    }
    return Netlify.env?.get(name);
  } catch {
    return undefined;
  }
}

function normalizeContext(context: RequestPayload["context"]): Required<ArchiveContext> {
  const safeContext = context && typeof context === "object" ? context : {};
  const facts = safeContext.facts && typeof safeContext.facts === "object" ? safeContext.facts : {};

  return {
    type: truncateText(safeContext.type, 40),
    title: truncateText(safeContext.title, 120),
    summary: truncateText(safeContext.summary, 900),
    tags: Array.isArray(safeContext.tags)
      ? safeContext.tags.slice(0, 20).map((tag) => truncateText(tag, 40)).filter(Boolean)
      : [],
    facts: Object.fromEntries(
      Object.entries(facts)
        .slice(0, 16)
        .map(([key, value]) => [truncateText(key, 40), normalizeFactValue(value)])
        .filter(([key, value]) => key && value !== null)
    )
  };
}

function normalizeFactValue(value: unknown) {
  if (typeof value === "string") {
    return truncateText(value, 160);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  return null;
}

function buildUserPrompt(question: string, context: Required<ArchiveContext>) {
  return [
    "当前档案上下文如下：",
    JSON.stringify(context, null, 2),
    "",
    `读者问题：${question}`,
    "",
    "请用中文回答，结合上下文解释，并在信息不足时说明限制。"
  ].join("\n");
}

function extractAnswer(data: BedrockConverseResponse) {
  return (
    data.output?.message?.content
      ?.map((block) => block.text)
      .filter((text): text is string => Boolean(text))
      .join("\n\n")
      .trim() ?? ""
  );
}

function classifyBedrockError(status: number) {
  if (status === 401 || status === 403) {
    return "AI 服务认证失败。";
  }
  if (status === 400) {
    return "Bedrock 请求无效，请检查模型、区域或请求参数。";
  }
  if (status === 429) {
    return "请求过于频繁，请稍后再试。";
  }
  return "AI 服务暂时不可用。";
}

function truncateText(value: unknown, limit: number) {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  return trimmed.length > limit ? `${trimmed.slice(0, limit)}...` : trimmed;
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function sanitizeLogText(value: string) {
  return value.replace(/[A-Za-z0-9_-]{32,}/g, "[redacted]").slice(0, 700);
}
