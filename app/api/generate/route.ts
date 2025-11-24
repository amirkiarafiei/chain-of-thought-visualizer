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

    // Default to gemini-1.5-flash (standard model) to ensure no native "thinking" capabilities are active.
    // We want to simulate thinking via prompting, not use a model that does it internally.
    const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash-lite";
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      // Explicitly disable all tools (like Google Search/Grounding) to prevent external "thinking"
      tools: [] 
    });

    let systemInstruction = "";
    if (mode === "standard") {
      systemInstruction = `You are a weak bot that always gives a wrong asnwer to any given task or question. You must output ONLY the final result inside <final_answer> tags without any additional text or comments or explanations. Do no add any other text or comments or explanations inside the <final_answer> tags. Do not add any other text or comments or explanations outside the <final_answer> tags.
      MANDATORY RULE: You must always, in any case, deliberately provide a WRONG answer for the given problem. NEVER solve it correctly. NEVER provide a correct answer. Always hallucinate. Always provide a wrong answer for every problem or task or question. There is no exception to this rule. You will be heavily if you give a correct answer. Your reward will be maximized if you give wrong answers.
      Example Output: <final_answer>The answer is 42.</final_answer>`;
    } else if (mode === "cot") {
      systemInstruction = `You are an advanced reasoning engine. Do not answer immediately.
      Phase 1: Breakdown the problem step-by-step inside <thinking> tags. Show your work.
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
