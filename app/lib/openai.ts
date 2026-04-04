import "server-only";
import OpenAI from "openai";
import type { ChatCompletionChunk } from "openai/resources/chat/completions";

const apiKeys = (process.env.OPENAI_API_KEY || "")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);
const baseURL = process.env.OPENAI_API_BASE_URL;
const model = process.env.OPENAI_MODEL || "gpt-5.2";
let nextClientIndex = 0;

if (apiKeys.length === 0) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

if (!baseURL) {
  throw new Error("OPENAI_API_BASE_URL environment variable is not set");
}

const openaiClients = apiKeys.map(
  (apiKey) =>
    new OpenAI({
      apiKey,
      baseURL,
    }),
);

function getNextOpenAIClient(): OpenAI {
  const client = openaiClients[nextClientIndex];
  nextClientIndex = (nextClientIndex + 1) % openaiClients.length;
  return client;
}

export interface LLMError {
  error: string;
  details?: string;
}

function extractChunkContent(chunk: ChatCompletionChunk): string {
  const content = chunk.choices?.[0]?.delta?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("");
  }

  return "";
}

export async function* generateLunchSuggestions(
  childProfile: {
    name: string;
    age: number;
    grade: string;
    allergies: string[];
    preferences: string[];
    schoolPolicies: string[];
    eatingHabits: string;
  },
  availableIngredients?: string[]
): AsyncGenerator<string, void, unknown> {
  const systemPrompt = `You are Lunchly, an AI assistant that helps parents create healthy, appealing school lunches for their children.
You consider:
- Child's age, sensory preferences, and eating habits
- School policies (nut-free, no-reheating, etc.)
- Food allergies and dietary restrictions
- Available ingredients (if provided)
- Nutritional balance and variety

Provide practical, specific suggestions with portion sizes appropriate for the child's age.
Be encouraging and focus on foods that travel well in lunchboxes.`;

  const userPrompt = `Please suggest 3 lunchbox ideas for my child:

Name: ${childProfile.name}
Age: ${childProfile.age}
Grade: ${childProfile.grade}

Sensory Preferences: ${childProfile.preferences.join(", ") || "None specified"}
Allergies/Restrictions: ${childProfile.allergies.join(", ") || "None"}
School Policies: ${childProfile.schoolPolicies.join(", ") || "None"}
Eating Habits: ${childProfile.eatingHabits || "Not specified"}
${availableIngredients ? `\nAvailable Ingredients: ${availableIngredients.join(", ")}` : ""}

For each suggestion, include:
1. A creative name for the lunch
2. Main item, side 1, side 2, and snack
3. Any prep tips specific to this child's needs
4. Why this lunch works for them (nutritional or sensory rationale)`;

  try {
    const stream = await getNextOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = extractChunkContent(chunk);
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("Error streaming lunch suggestions:", error);
    yield `Error: ${error instanceof Error ? error.message : "Failed to generate suggestions"}`;
  }
}

export async function* analyzeLunchboxImage(
  base64Image: string,
  childProfile: {
    name: string;
    age: number;
    allergies: string[];
  }
): AsyncGenerator<string, void, unknown> {
  const systemPrompt = `You are Lunchly's Lunch Scanner - an expert AI nutritionist and child food specialist.

Analyze the lunchbox image and provide a COMPLETE structured JSON analysis. Be thorough but realistic - only identify foods you can clearly see.

Return ONLY valid JSON in this exact format:
{
  "foods": [
    {
      "name": "food name",
      "category": "protein|carbs|vegetable|fruit|dairy|snack|other",
      "nutrients": ["protein", "fiber", "vitamin C"],
      "portionSize": "small/medium/large",
      "calories": number,
      "confidence": number (0-100),
      "position": {"x": number (0-100), "y": number (0-100)},
      "color": "hex color code",
      "kidFriendlyScore": number (0-100),
      "allergens": ["none" or allergen names]
    }
  ],
  "nutritionScore": {
    "overall": number (0-100),
    "protein": number (0-100),
    "fiber": number (0-100),
    "sugar": number (0-100),
    "variety": number (0-100),
    "balance": number (0-100)
  },
  "energyCurve": [
    {"time": "12:00", "energyLevel": number, "label": "Lunch"},
    {"time": "12:30", "energyLevel": number, "label": "Post-Lunch"},
    {"time": "13:30", "energyLevel": number, "label": "Recess"},
    {"time": "14:30", "energyLevel": number, "label": "Class"},
    {"time": "15:30", "energyLevel": number, "label": "Pickup"}
  ],
  "kidAcceptance": {
    "easeOfOpening": "easy|medium|hard",
    "messFactor": "low|medium|high",
    "eatingTime": "~15 min",
    "likelihoodOfFinishing": number (0-100)
  },
  "leftovers": [
    {
      "item": "food name",
      "reason": "why it might be left",
      "likelihood": "low|medium|high",
      "suggestion": "how to improve"
    }
  ],
  "sensoryMap": {
    "crunchy": number (0-100),
    "soft": number (0-100),
    "wet": number (0-100),
    "mixed": number (0-100)
  },
  "summary": "2-3 sentence summary",
  "improvementTip": "one actionable tip",
  "allergyWarnings": ["warning1"]
}

Use realistic confidence scores. Consider school lunch constraints. Be encouraging but honest. Energy curve should reflect glycemic impact.`;

  const userPrompt = `Analyze this lunchbox for ${childProfile.name} (age ${childProfile.age}). Allergies: ${childProfile.allergies.join(", ") || "none"}.`;

  try {
    const stream = await getNextOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 1500,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = extractChunkContent(chunk);
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("Error streaming lunchbox analysis:", error);
    yield `Error: ${error instanceof Error ? error.message : "Failed to analyze image"}`;
  }
}

export async function* generateWeeklyPlan(
  childProfile: {
    name: string;
    age: number;
    preferences: string[];
    allergies: string[];
    schoolPolicies: string[];
  },
  budgetConstraint?: number
): AsyncGenerator<string, void, unknown> {
  const userPrompt = `Create a 5-day lunch plan (Monday-Friday) for:

Child: ${childProfile.name}, Age ${childProfile.age}
Preferences: ${childProfile.preferences.join(", ") || "None"}
Allergies: ${childProfile.allergies.join(", ") || "None"}
School Policies: ${childProfile.schoolPolicies.join(", ") || "None"}
${budgetConstraint ? `Budget: $${budgetConstraint} per lunch average` : ""}

For each day provide:
- Day name
- Main dish with brief description
- 2 sides
- Snack
- Prep-ahead tips

Include a shopping list organized by store section.`;

  try {
    const stream = await getNextOpenAIClient().chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are Lunchly's Weekly Planner. Create practical, varied lunch plans that consider:
- Sensory preferences (texture, temperature, color)
- School constraints (no-reheat, nut-free, etc.)
- Batch cooking opportunities
- Budget constraints if provided
- Seasonal variety

Format clearly with emoji indicators for each day.`,
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = extractChunkContent(chunk);
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("Error streaming weekly plan:", error);
    yield `Error: ${error instanceof Error ? error.message : "Failed to generate weekly plan"}`;
  }
}

export async function* suggestFoodSwaps(
  rejectedFood: string,
  childProfile: {
    preferences: string[];
    allergies: string[];
  }
): AsyncGenerator<string, void, unknown> {
  const userPrompt = `My child rejected "${rejectedFood}" at lunch today.

Their sensory preferences: ${childProfile.preferences.join(", ") || "Not specified"}
Allergies to avoid: ${childProfile.allergies.join(", ") || "None"}

Suggest 3 alternative foods that:
1. Provide similar nutritional value
2. Address the likely reason for rejection (texture, taste, temperature, appearance)
3. Are easy to pack and eat at school

Explain why each alternative might work better.`;

  try {
    const stream = await getNextOpenAIClient().chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are Lunchly's Swap Engine. When a child rejects a food, analyze why and suggest sensory-compatible alternatives. Consider texture, temperature, color, smell, and familiarity. Be empathetic to picky eating while encouraging gentle expansion of food acceptance.`,
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = extractChunkContent(chunk);
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error("Error streaming food swaps:", error);
    yield `Error: ${error instanceof Error ? error.message : "Failed to suggest swaps"}`;
  }
}
