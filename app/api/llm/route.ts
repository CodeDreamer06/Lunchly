import { NextResponse } from "next/server";
import {
  analyzeLunchboxImage,
  generateLunchSuggestions,
  generateWeeklyPlan,
  suggestFoodSwaps,
} from "../../lib/openai";

type GenerateSuggestionsRequest = {
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
};

type AnalyzeImageRequest = {
  type: "analyzeLunchboxImage";
  base64Image: string;
  childProfile: {
    name: string;
    age: number;
    allergies: string[];
  };
};

type WeeklyPlanRequest = {
  type: "generateWeeklyPlan";
  childProfile: {
    name: string;
    age: number;
    preferences: string[];
    allergies: string[];
    schoolPolicies: string[];
  };
  budgetConstraint?: number;
};

type FoodSwapRequest = {
  type: "suggestFoodSwaps";
  rejectedFood: string;
  childProfile: {
    preferences: string[];
    allergies: string[];
  };
};

type LLMRequest =
  | GenerateSuggestionsRequest
  | AnalyzeImageRequest
  | WeeklyPlanRequest
  | FoodSwapRequest;

export async function POST(request: Request) {
  let body: LLMRequest;

  try {
    body = (await request.json()) as LLMRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let source: AsyncGenerator<string, void, unknown>;

        switch (body.type) {
          case "generateLunchSuggestions":
            source = generateLunchSuggestions(
              body.childProfile,
              body.availableIngredients,
            );
            break;
          case "analyzeLunchboxImage":
            source = analyzeLunchboxImage(body.base64Image, body.childProfile);
            break;
          case "generateWeeklyPlan":
            source = generateWeeklyPlan(
              body.childProfile,
              body.budgetConstraint,
            );
            break;
          case "suggestFoodSwaps":
            source = suggestFoodSwaps(body.rejectedFood, body.childProfile);
            break;
          default:
            controller.error(new Error("Unsupported LLM request type"));
            return;
        }

        for await (const chunk of source) {
          controller.enqueue(encoder.encode(chunk));
        }

        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Streaming request failed";
        controller.enqueue(encoder.encode(`Error: ${message}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
