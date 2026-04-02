import "server-only";

type VoidAIReasoningEffort = "low" | "medium" | "high";

type VoidAIContentPart =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
        detail?: "low" | "high" | "auto";
      };
    };

type VoidAIMessage = {
  role: "system" | "user";
  content: string | VoidAIContentPart[];
};

type CallVoidAIJsonOptions = {
  systemPrompt: string;
  userContent: string | VoidAIContentPart[];
  maxTokens?: number;
  model?: string;
  reasoningEffort?: VoidAIReasoningEffort;
  temperature?: number;
};

export type VoidAIDebugInfo = {
  endpoint: string;
  model: string;
  streamed: boolean;
  keyOrder: string[];
  usedKeySlot?: string;
  responseContentType?: string;
  rawTextPreview?: string;
  failures: string[];
  reasoningEffortSent?: string | null;
};

type VoidAICompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

const VOIDAI_ENDPOINT = "https://api.voidai.app/v1/chat/completions";
let roundRobinCursor = 0;

function getConfiguredKeys() {
  return [process.env.VOIDAI_API_KEY_PRIMARY, process.env.VOIDAI_API_KEY_SECONDARY].filter(
    (value): value is string => Boolean(value?.trim()),
  );
}

function getRotatedKeys() {
  const apiKeys = getConfiguredKeys();

  if (apiKeys.length <= 1) {
    return apiKeys;
  }

  const startIndex = roundRobinCursor % apiKeys.length;
  roundRobinCursor = (roundRobinCursor + 1) % apiKeys.length;

  return apiKeys.map((_, index) => apiKeys[(startIndex + index) % apiKeys.length]);
}

function extractTextContent(content: string | Array<{ type?: string; text?: string }> | undefined) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text)
    .join("");
}

function getKeySlotLabel(index: number) {
  return index === 0 ? "primary" : index === 1 ? "secondary" : `key_${index + 1}`;
}

function supportsReasoningEffort(model: string) {
  return /^(o[1-9]|o\d-mini|gpt-5|gpt-5-mini|gpt-5-nano)/i.test(model);
}

async function readVoidAIStream(response: Response) {
  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const lines = event
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith("data:")) {
          continue;
        }

        const payload = line.slice(5).trim();

        if (payload === "[DONE]") {
          return content;
        }

        try {
          const chunk = JSON.parse(payload) as {
            choices?: Array<{
              delta?: {
                content?: string;
              };
            }>;
          };

          const delta = chunk.choices?.[0]?.delta?.content;

          if (typeof delta === "string") {
            content += delta;
          }
        } catch {
          // Ignore malformed intermediate chunks and continue collecting content.
        }
      }
    }
  }

  return content;
}

async function readVoidAIResponseText(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/event-stream")) {
    return readVoidAIStream(response);
  }

  const data = (await response.json()) as VoidAICompletionResponse;
  return extractTextContent(data.choices?.[0]?.message?.content);
}

export async function createVoidAIJsonCompletion<T>({
  systemPrompt,
  userContent,
  maxTokens = 900,
  model = process.env.VOIDAI_MODEL || "gpt-4o",
  reasoningEffort = "medium",
  temperature = 0.4,
}: CallVoidAIJsonOptions): Promise<{ data: T; debug: VoidAIDebugInfo }> {
  const apiKeys = getRotatedKeys();
  const configuredKeys = getConfiguredKeys();

  if (!apiKeys.length) {
    throw new Error("VoidAI keys are not configured.");
  }

  const messages: VoidAIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];

  const shouldSendReasoningEffort = supportsReasoningEffort(model);
  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
    stream_options: {
      include_usage: true,
    },
    response_format: {
      type: "json_object",
    },
  };
  const requestBody = shouldSendReasoningEffort
    ? {
        ...payload,
        reasoning_effort: reasoningEffort,
      }
    : payload;

  const failures: string[] = [];
  const debugBase: VoidAIDebugInfo = {
    endpoint: VOIDAI_ENDPOINT,
    model,
    streamed: true,
    keyOrder: apiKeys.map((apiKey) => getKeySlotLabel(configuredKeys.indexOf(apiKey))),
    failures,
    reasoningEffortSent: shouldSendReasoningEffort ? reasoningEffort : null,
  };

  for (const apiKey of apiKeys) {
    const usedKeySlot = getKeySlotLabel(configuredKeys.indexOf(apiKey));
    const response = await fetch(VOIDAI_ENDPOINT, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(120000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      failures.push(`${usedKeySlot}: ${response.status} ${errorText}`.trim());
      continue;
    }

    const text = await readVoidAIResponseText(response);

    if (!text) {
      failures.push(`${usedKeySlot}: Empty content returned from VoidAI.`);
      continue;
    }

    try {
      return {
        data: JSON.parse(text) as T,
        debug: {
          ...debugBase,
          usedKeySlot,
          responseContentType: response.headers.get("content-type") || "",
          rawTextPreview: text.slice(0, 1000),
        },
      };
    } catch (error) {
      failures.push(
        `${usedKeySlot}: Invalid JSON returned by VoidAI (${error instanceof Error ? error.message : "parse error"}).`,
      );
      debugBase.rawTextPreview = text.slice(0, 1000);
    }
  }

  const error = new Error(failures.join(" | ") || "VoidAI request failed.") as Error & {
    debug?: VoidAIDebugInfo;
  };
  error.debug = debugBase;
  throw error;
}
