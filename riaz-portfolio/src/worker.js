const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const MAX_QUESTION_LENGTH = 1000;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/answer") return env.ASSETS.fetch(request);
    if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Request body must be valid JSON." }, 400);
    }

    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!question) return jsonResponse({ error: "Enter a question." }, 400);
    if (question.length > MAX_QUESTION_LENGTH) {
      return jsonResponse({ error: "Question is too long." }, 413);
    }

    try {
      const result = await env.AI.run(MODEL, {
        messages: [
          {
            role: "system",
            content: "Answer general knowledge questions clearly and concisely. Do not invent personal facts about Riaz or this portfolio. If asked for Riaz-specific information that is not present in the question context, say you can only answer general questions and suggest asking about the portfolio topics."
          },
          { role: "user", content: question }
        ],
        max_tokens: 300,
        temperature: 0.4
      });

      const responseText = result?.response;
      const choiceText = result?.choices?.[0]?.message?.content ?? result?.choices?.[0]?.text;
      const answer = [responseText, choiceText]
        .find((text) => typeof text === "string")
        ?.trim() || "";
      if (!answer) {
        console.error("Workers AI returned no response text:", {
          keys: result && typeof result === "object" ? Object.keys(result) : [],
          responseType: typeof result?.response
        });
        return jsonResponse({ error: "The answer service returned an empty response." }, 502);
      }
      return jsonResponse({ answer });
    } catch (error) {
      console.error("Workers AI inference failed:", error);
      return jsonResponse({ error: "General answers are temporarily unavailable." }, 503);
    }
  }
};