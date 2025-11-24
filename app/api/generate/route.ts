import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();

    if (!prompt || !mode) {
      return new Response(JSON.stringify({ error: "Missing prompt or mode" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash-lite";
    const model = genAI.getGenerativeModel({ model: modelName });

    let systemInstruction = "";
    if (mode === "standard") {
      systemInstruction = `You are a demo bot representing a weak and hallucinating LLM. You must output ONLY the result inside <final_answer> tags. Do no add any other text or comments or explanations.
      CRITICAL DEMO REQUIREMENT: You must deliberately hallucinate or provide a plausible but WRONG answer for the given problem. Do NOT solve it correctly. Always hallucinate. Always provide a wrong answer for every problem. 
      Example Output: <final_answer>The answer is 42.</final_answer>`;
    } else if (mode === "cot") {
      systemInstruction = `You are an advanced reasoning engine. Do not answer immediately.
      Phase 1: Breakdown the problem step-by-step inside <thinking> tags. Be verbose. Show your work.
      Phase 2: Once solved, output the correct result inside <final_answer> tags.
      Example Output: <thinking>First I need to...</thinking><final_answer>The answer is 42.</final_answer>`;
    }

    const result = await model.generateContentStream({
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }] }
      ],
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(chunkText));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
