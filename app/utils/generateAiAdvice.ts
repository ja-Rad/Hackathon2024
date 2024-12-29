import { Match } from "../types/match";

export const generateAiAdvice = async (matches: Match[], setAiAdvice: (advice: string | null) => void) => {
    try {
        const last10Metrics = matches.slice(0, 10).map((match) => match.metrics);

        const aiRequestPrompt = `
            Based on the following performance metrics from the last 10 matches of Coventry City FC:
            ${JSON.stringify(last10Metrics, null, 2)}

            Provide actionable insights to improve performance in 5 sentences (maximum 100 words).
        `;

        const response = await fetch("/api/generate-ai-advice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: aiRequestPrompt }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch advice.");
        }

        const data: { advice?: string } = await response.json();

        const advice = data?.advice;

        if (!advice) {
            throw new Error("Invalid response format.");
        }

        setAiAdvice(advice);
    } catch (error) {
        console.error("Error generating AI advice:", error);
        setAiAdvice("Failed to generate advice. Please try again.");
    }
};
