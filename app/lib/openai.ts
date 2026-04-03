"use server";

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_API_BASE_URL;
const model = process.env.OPENAI_MODEL || "gpt-5.2";

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

if (!baseURL) {
  throw new Error("OPENAI_API_BASE_URL environment variable is not set");
}

const openai = new OpenAI({
  apiKey,
  baseURL,
});

export interface LLMError {
  error: string;
  details?: string;
}

export async function generateLunchSuggestions(
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
): Promise<string | LLMError> {
  try {
    const systemPrompt = `You are LunchLogic, an AI assistant that helps parents create healthy, appealing school lunches for their children.
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

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { error: "No response from AI", details: "The API returned an empty response" };
    }

    return content;
  } catch (error) {
    console.error("Error generating lunch suggestions:", error);
    if (error instanceof OpenAI.APIError) {
      return {
        error: "AI Service Error",
        details: error.message || "Failed to communicate with the AI service",
      };
    }
    return {
      error: "Unexpected Error",
      details: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function analyzeLunchboxImage(
  base64Image: string,
  childProfile: {
    name: string;
    age: number;
    allergies: string[];
  }
): Promise<string | LLMError> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are LunchLogic's Lunch Scanner. Analyze lunchbox images and provide:
1. What foods you identify
2. Nutritional assessment (balance of protein, carbs, fruits/veg)
3. Portion appropriateness for the child's age
4. Any allergy warnings based on the child's profile
5. One improvement suggestion

Be concise, practical, and encouraging.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this lunchbox for my child ${childProfile.name} (age ${childProfile.age}). Allergies to avoid: ${childProfile.allergies.join(", ") || "none"}.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { error: "No response from AI", details: "The API returned an empty response" };
    }

    return content;
  } catch (error) {
    console.error("Error analyzing lunchbox image:", error);
    if (error instanceof OpenAI.APIError) {
      return {
        error: "AI Vision Error",
        details: error.message || "Failed to analyze the image",
      };
    }
    return {
      error: "Unexpected Error",
      details: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function generateWeeklyPlan(
  childProfile: {
    name: string;
    age: number;
    preferences: string[];
    allergies: string[];
    schoolPolicies: string[];
  },
  budgetConstraint?: number
): Promise<string | LLMError> {
  try {
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

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are LunchLogic's Weekly Planner. Create practical, varied lunch plans that consider:
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
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { error: "No response from AI", details: "The API returned an empty response" };
    }

    return content;
  } catch (error) {
    console.error("Error generating weekly plan:", error);
    if (error instanceof OpenAI.APIError) {
      return {
        error: "AI Service Error",
        details: error.message || "Failed to generate weekly plan",
      };
    }
    return {
      error: "Unexpected Error",
      details: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function suggestFoodSwaps(
  rejectedFood: string,
  childProfile: {
    preferences: string[];
    allergies: string[];
  }
): Promise<string | LLMError> {
  try {
    const userPrompt = `My child rejected "${rejectedFood}" at lunch today.

Their sensory preferences: ${childProfile.preferences.join(", ") || "Not specified"}
Allergies to avoid: ${childProfile.allergies.join(", ") || "None"}

Suggest 3 alternative foods that:
1. Provide similar nutritional value
2. Address the likely reason for rejection (texture, taste, temperature, appearance)
3. Are easy to pack and eat at school

Explain why each alternative might work better.`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are LunchLogic's Swap Engine. When a child rejects a food, analyze why and suggest sensory-compatible alternatives. Consider texture, temperature, color, smell, and familiarity. Be empathetic to picky eating while encouraging gentle expansion of food acceptance.`,
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { error: "No response from AI", details: "The API returned an empty response" };
    }

    return content;
  } catch (error) {
    console.error("Error suggesting food swaps:", error);
    if (error instanceof OpenAI.APIError) {
      return {
        error: "AI Service Error",
        details: error.message || "Failed to suggest swaps",
      };
    }
    return {
      error: "Unexpected Error",
      details: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
