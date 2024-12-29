import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Store your API key in an environment variable
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ advice: "Prompt is required." }), { status: 400 });
        }

        // Send the prompt to ChatGPT using the chat/completions endpoint
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use the appropriate GPT chat model
            messages: [{ role: "user", content: prompt }],
            max_tokens: 250, // Limit the response length
            temperature: 0.7, // Adjust creativity level
        });

        // Safely extract advice from the response
        const advice = response.choices?.[0]?.message?.content?.trim() ?? null;

        if (!advice) {
            return new Response(JSON.stringify({ advice: "No advice generated." }), { status: 500 });
        }

        return new Response(JSON.stringify({ advice }), { status: 200 });
    } catch (error: unknown) {
        console.error("Error generating AI advice:", error);

        if (error instanceof OpenAI.APIError) {
            return new Response(JSON.stringify({ advice: error.message }), { status: error.status });
        }

        return new Response(JSON.stringify({ advice: "Failed to generate advice. Please try again later." }), { status: 500 });
    }
}
