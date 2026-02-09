export const aiConfig = {
    models: {
        primary: "gemini-2.0-flash-exp",
        fallback: "gemini-1.5-flash",
        embedding: "embedding-001"
    },
    limits: {
        maxPromptLength: 10000,
        maxOutputTokens: 2048,
        maxRetries: 3,
        timeoutMs: 30000
    },
    defaults: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95
    },
    // Set to true to mock AI responses (save API costs during UI development)
    mockMode: false
};
