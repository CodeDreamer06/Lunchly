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

function getConfiguredKeys() {
  return [process.env.VOIDAI_API_KEY_PRIMARY, process.env.VOIDAI_API_KEY_SECONDARY].filter(
    (value): value is string => Boolean(value?.trim()),
  );
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

export async function createVoidAIJsonCompletion<T>({
  systemPrompt,
  userContent,
  maxTokens = 900,
  model = process.env.VOIDAI_MODEL || "gpt-4o",
  reasoningEffort = "medium",
  temperature = 0.4,
}: CallVoidAIJsonOptions): Promise<T> {
  const apiKeys = getConfiguredKeys();

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
    response_format: {
      type: "json_object",
    },
  };

  const failures: string[] = [];

  for (const apiKey of apiKeys) {
    const response = await fetch(VOIDAI_ENDPOINT, {
      method: "POST",
      cache: "no-store",
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

    const data = (await response.json()) as VoidAICompletionResponse;
    const text = extractTextContent(data.choices?.[0]?.message?.content);

    if (!text) {
      failures.push("Empty content returned from VoidAI.");
      continue;
    }

    return JSON.parse(text) as T;
  }

  throw new Error(failures.join(" | ") || "VoidAI request failed.");
}
