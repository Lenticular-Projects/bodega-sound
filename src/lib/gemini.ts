import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { z } from "zod";

const config = {
  model: "gemini-2.0-flash-exp",
  fallbackModel: "gemini-1.5-flash",
  maxRetries: 3,
  timeoutMs: 30000,
  maxOutputTokens: 2048,
  temperature: 0.7,
};

export class AIGatewayError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AIGatewayError";
  }
}

export class AIGateway {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;
  private fallbackModel: GenerativeModel;

  constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new AIGatewayError("GOOGLE_GENERATIVE_AI_API_KEY not set", "MISSING_API_KEY");
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({
      model: config.model,
      generationConfig: { maxOutputTokens: config.maxOutputTokens, temperature: config.temperature }
    });
    this.fallbackModel = this.client.getGenerativeModel({
      model: config.fallbackModel,
      generationConfig: { maxOutputTokens: config.maxOutputTokens, temperature: config.temperature }
    });
  }

  async generateStructured<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    if (prompt.length > 10000) throw new AIGatewayError("Prompt exceeds 10k chars", "PROMPT_TOO_LONG");
    let lastError: Error | null = null;
    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      try {
        const model = attempt > 1 ? this.fallbackModel : this.model;
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), config.timeoutMs))
        ]);
        const text = result.response.text();
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/) || [null, text];
        const cleanJson = jsonMatch[1].trim();
        const parsed = JSON.parse(cleanJson);
        return schema.parse(parsed);
      } catch (error) {
        lastError = error as Error;
        if (attempt < config.maxRetries - 1) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
    throw new AIGatewayError(`Failed after ${config.maxRetries} attempts: ${lastError?.message}`, "GENERATION_FAILED");
  }

  async *streamText(prompt: string): AsyncGenerator<string, void, unknown> {
    if (prompt.length > 10000) throw new AIGatewayError("Prompt too long", "PROMPT_TOO_LONG");
    const result = await this.model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }
}

export const ai = new AIGateway();
