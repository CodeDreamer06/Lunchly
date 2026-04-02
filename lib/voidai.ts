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
}: CallVoidAIJsonOptions): Promise<T> {
  const apiKeys = getRotatedKeys();

  if (!apiKeys.length) {
    throw new Error("VoidAI keys are not configured.");
  }

  const messages: VoidAIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];

  const payload = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    reasoning_effort: reasoningEffort,
    stream: true,
    stream_options: {
      include_usage: true,
    },
    response_format: {
      type: "json_object",
    },
  };

  const failures: string[] = [];

  for (const apiKey of apiKeys) {
    const response = await fetch(VOIDAI_ENDPOINT, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(120000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      failures.push(`${response.status} ${errorText}`.trim());
      continue;
    }

    const text = await readVoidAIResponseText(response);

    if (!text) {
      failures.push("Empty content returned from VoidAI.");
      continue;
    }

    return JSON.parse(text) as T;
  }

  throw new Error(failures.join(" | ") || "VoidAI request failed.");
}
