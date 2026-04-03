type StreamLLMRequest =
  | {
      type: "generateLunchSuggestions";
      childProfile: {
        name: string;
        age: number;
        grade: string;
        allergies: string[];
        preferences: string[];
        schoolPolicies: string[];
        eatingHabits: string;
      };
      availableIngredients?: string[];
    }
  | {
      type: "analyzeLunchboxImage";
      base64Image: string;
      childProfile: {
        name: string;
        age: number;
        allergies: string[];
      };
    }
  | {
      type: "generateWeeklyPlan";
      childProfile: {
        name: string;
        age: number;
        preferences: string[];
        allergies: string[];
        schoolPolicies: string[];
      };
      budgetConstraint?: number;
    }
  | {
      type: "suggestFoodSwaps";
      rejectedFood: string;
      childProfile: {
        preferences: string[];
        allergies: string[];
      };
    };

export async function* streamLLM(
  payload: StreamLLMRequest,
): AsyncGenerator<string, void, unknown> {
  const response = await fetch("/api/llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = (await response.json()) as { error?: string };
      if (error.error) {
        message = error.error;
      }
    } catch {
      // Ignore JSON parsing errors and keep the status-based fallback.
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming response body is missing");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        yield chunk;
      }
    }

    const remainder = decoder.decode();
    if (remainder) {
      yield remainder;
    }
  } finally {
    reader.releaseLock();
  }
}
