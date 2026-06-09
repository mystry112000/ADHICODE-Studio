import { processCommand, clearHistory } from "./brain";

const PORT = parseInt(process.env.JARVIS_PORT || "4876");
const SECRET = process.env.JARVIS_SECRET || "jarvis-local";

function jsonResponse(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

function auth(request: Request): boolean {
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${SECRET}`;
}

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    if (!auth(request)) return jsonResponse({ error: "Unauthorized" }, 401);

    const url = new URL(request.url);
    const method = request.method;

    if (url.pathname === "/api/chat" && method === "POST") {
      try {
        const body: any = await request.json();
        const userInput = body.message;
        if (!userInput) return jsonResponse({ error: "Message required" }, 400);

        if (userInput.toLowerCase() === "clear") {
          clearHistory();
          return jsonResponse({ response: "Memory cleared.", actions: "" });
        }

        const result = await processCommand(userInput);
        return jsonResponse(result);
      } catch (e: any) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    if (url.pathname === "/api/health" && method === "GET") {
      return jsonResponse({ status: "ok", mode: process.env.AI_PROVIDER || "adhicode" });
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
});

console.log(`\n  JARVIS Bun Engine running on http://localhost:${PORT}`);
console.log(`  Auth: Bearer ${SECRET}`);
console.log(`  AI: ${process.env.AI_PROVIDER || "adhicode"} / ${process.env.AI_MODEL || "big-pickle"}\n`);
