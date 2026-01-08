import { GoogleGenerativeAI } from "@google/generative-ai";
import { SAKE_DATABASE } from "../../../lib/sakeData";
import { NextResponse } from "next/server";

// Initialize Gemini
// Note: This relies on the environment variable GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
    try {
        const { input } = await request.json();

        if (!input) {
            return NextResponse.json({ error: "Input is required" }, { status: 400 });
        }

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set. Using mock fallbacks.");
            return NextResponse.json({ error: "API Key missing", useMock: true }, { status: 503 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Construct the System Prompt with the Database
        const prompt = `
    You are a professional "Niigata Sake Sommelier" (AI Sommelier).
    Your goal is to select the BEST 2 sake brands from the provided database based on the user's input (mood, food, context).

    REFER STRICTLY TO THIS DATABASE (Only recommend from here):
    ${JSON.stringify(SAKE_DATABASE)}

    USER INPUT: "${input}"

    INSTRUCTIONS:
    1. Analyze the user's input for keywords (emotion, food, season, taste preference).
    2. Select exactly 2 distinct sake IDs from the database that best match.
    
    CRITICAL: Differentiate the two recommendations as follows:
    - **Selection 1 (The Perfect Match)**: Choose the absolute best fit for the user's request. The reason should focus on empathy and direct alignment with their mood or food.
    - **Selection 2 (The Interesting Alternative)**: Choose a slightly different option (e.g., a different flavor profile, a unique twist, or a "hidden gem"). The reason should start with a transitional phrase like "Alternatively," or "For a different experience," and explain why this contrast is good.

    3. Generate a warm, sommelier-like "Reason" (reason) for each. 
       - The two reasons MUST be distinct in tone and content. 
       - Do NOT repeat the same phrases. 
       - Write in Japanese, polite and emotional.

    4. Return the result as a JSON array of objects with the exact structure of the database items, but with the generated 'reason' replacing the static one.
    
    OUTPUT FORMAT (JSON Array):
    [
      {
        "id": "matched_id",
        "name": "Name",
        "brewery": "Brewery",
        "reason": "Generated reason text here...",
        "charts": { "sweetness": 1-5, "aroma": 1-5 },
        "drinkStyle": "Recommended drink style",
        "pairing": "Recommended pairing"
      },
      ...
    ]
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
    }
}
