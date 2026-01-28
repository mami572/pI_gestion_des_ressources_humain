export interface AISummaryResponse {
    summary: string;
    tokensUsed?: number;
}

export async function generateSummary(text: string, systemPrompt: string = "Summarize the following content concisely."): Promise<string> {
    const apiKey = process.env.AI_API_KEY;
    const apiBase = process.env.AI_API_BASE || 'https://api.openai.com/v1';
    const model = process.env.AI_SUMMARY_MODEL_NAME || 'gpt-3.5-turbo';

    if (!apiKey) {
        throw new Error("AI_API_KEY is not configured.");
    }

    try {
        const response = await fetch(`${apiBase}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text },
                ],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`AI API error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "No summary generated.";
    } catch (error) {
        console.error("Error generating AI summary:", error);
        throw error;
    }
}

export async function parseCV(fileBase64: string): Promise<string> {
    // Placeholder for Dashscope integration
    // In a real scenario, this would use the Dashscope API to parse the PDF/Word file
    const dashscopeKey = process.env.DASHSCOPE_API_KEY;
    if (!dashscopeKey || dashscopeKey === 'your_key') {
        return "Dashscope API key not configured. Mocking CV content...";
    }

    // Mock implementation or real one if needed
    return "Parsed CV content: [Experience: 5 years, Skills: React, TypeScript, Node.js]";
}
