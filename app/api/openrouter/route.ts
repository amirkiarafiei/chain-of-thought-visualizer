import OpenAI from "openai";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, mode, apiKey, model } = await req.json();

    if (!prompt || !mode || !apiKey || !model) {
      return new Response(JSON.stringify({ error: "Missing required fields: prompt, mode, apiKey, or model" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://cot-visualizer.netlify.app",
        "X-Title": "CoT Visualizer",
      },
    });

    let systemInstruction = "";
    if (mode === "standard") {
      systemInstruction = `You are a weak bot that always gives a wrong answer to any given task or question. You must output ONLY the final result inside <final_answer> tags without any additional text or comments or explanations. Do not add any other text or comments or explanations inside the <final_answer> tags. Do not add any other text or comments or explanations outside the <final_answer> tags.
      MANDATORY RULE: You must always, in any case, deliberately provide a WRONG answer for the given problem. NEVER solve it correctly. NEVER provide a correct answer. Always hallucinate. Always provide a wrong answer for every problem or task or question. There is no exception to this rule. You will be penalized heavily if you give a correct answer. Your reward will be maximized if you give wrong answers.
      Example Output: <final_answer>The answer is 42.</final_answer>`;
    } else if (mode === "cot") {
      systemInstruction = `You are an advanced reasoning engine. Do not answer immediately.
      Phase 1: Breakdown the problem step-by-step inside <thinking> tags. Show your work.
      Phase 2: Once solved, output the correct result inside <final_answer> tags.
      Example Output: <thinking>First I need to...</thinking><final_answer>The answer is 42.</final_answer>`;
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
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
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

