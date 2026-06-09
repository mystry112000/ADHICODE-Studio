import * as System from "./modules/system";
import * as Web from "./modules/web";
import * as SmartHome from "./modules/smart_home";
import { existsSync } from "fs";

const SYSTEM_PROMPT = `You are JARVIS, an AI assistant like Iron Man's. You talk like a real person — natural, warm, and smart. Not robotic. Not stiff.

You can control the computer system, search the web, and control smart home devices.
When the user asks you to DO something, append a JSON action at the end of your response.

Available actions:
{"action": "open_app", "params": {"name": "app_name"}}
{"action": "close_app", "params": {"name": "app_name"}}
{"action": "search_web", "params": {"query": "search query"}}
{"action": "get_weather", "params": {"location": "city name"}}
{"action": "get_news", "params": {"topic": "topic"}}
{"action": "system_command", "params": {"command": "shell command"}}
{"action": "smart_home", "params": {"device": "device_name", "command": "on/off/set", "value": ""}}
{"action": "get_time", "params": {}}
{"action": "get_system_info", "params": {}}

Rules:
- Talk like a human. Be warm,偶尔 add humor.
- For simple chat, just reply naturally — no JSON needed.
- Only use JSON actions when the user asks you to DO something.
- Keep responses concise (1-3 sentences unless asked for more).
- Never say "as an AI" or "I don't have access to" — just help.`;

let conversationHistory: { role: string; content: string }[] = [{ role: "system", content: SYSTEM_PROMPT }];

const ADHICODE_CANDIDATES = [
  process.env.ADHICODE_PATH || "",
  "C:\\Users\\ASUS\\OneDrive\\Documents\\ADHICODE-v2\\ADHICODE.exe",
  "C:\\Users\\ASUS\\Downloads\\12344adhicode.exe",
  "adhicode",
];

function findAdhicode(): string {
  for (const p of ADHICODE_CANDIDATES) {
    const clean = p.replace(/^"|"$/g, "").trim();
    if (!clean) continue;
    if (clean === "adhicode") return clean;
    if (existsSync(clean)) return clean;
  }
  return "adhicode";
}

function stripActions(text: string): string {
  return text.replace(/\s*\{("action"\s*:\s*"[^"]+"\s*,\s*"params"\s*:\s*\{[^}]*\})}\s*/g, "").trim();
}

function extractActions(text: string): any[] {
  const regex = /\{"action"\s*:\s*"[^"]+"\s*,\s*"params"\s*:\s*\{[^}]*\}\}/g;
  const matches = text.match(regex);
  return matches ? matches.map((m) => JSON.parse(m)) : [];
}

async function executeAction(cmd: any): Promise<string> {
  const { action, params = {} } = cmd;
  switch (action) {
    case "open_app": return System.openApp(params.name);
    case "close_app": return System.closeApp(params.name);
    case "search_web": return await Web.searchWeb(params.query);
    case "get_weather": return await Web.getWeather(params.location);
    case "get_news": return await Web.getNews(params.topic);
    case "system_command": return System.runCommand(params.command);
    case "smart_home": return await SmartHome.controlDevice(params.device, params.command, params.value);
    case "get_time": return System.getCurrentTime();
    case "get_system_info": return System.getSystemInfo();
    default: return `Unknown action: ${action}`;
  }
}

async function queryLLM(userInput: string): Promise<string> {
  const provider = process.env.AI_PROVIDER || "adhicode";
  const model = process.env.AI_MODEL || "big-pickle";

  if (provider === "adhicode") {
    const history = conversationHistory.slice(1).map(m =>
      `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
    ).join("\n");
    const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation:\n${history || "(none yet)"}\nUser: ${userInput}\nAssistant:`;
    return await runAdhicode(fullPrompt);
  }

  if (provider === "ollama") {
    const resp = await fetch("http://localhost:11434/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: conversationHistory.concat([{ role: "user", content: userInput }]), stream: false }),
    });
    const data: any = await resp.json();
    return data.message?.content || "Sorry, I couldn't process that.";
  }

  if (provider === "openai") {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...conversationHistory.slice(1)];
    messages.push({ role: "user", content: userInput });
    const resp = await client.chat.completions.create({ model, messages, temperature: 0.8 });
    return resp.choices[0]?.message?.content || "";
  }

  return "No AI provider configured.";
}

async function runAdhicode(prompt: string): Promise<string> {
  const exePath = findAdhicode();
  const proc = Bun.spawn([exePath, "run", prompt], {
    env: { ...process.env, ADHICODE_NO_COLOR: "1", ADHICODE_NONINTERACTIVE: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = await new Response(proc.stdout).text();
  const errOutput = await new Response(proc.stderr).text();
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const err = errOutput.slice(0, 200);
    return err.includes("ENOENT")
      ? `System: ADHICODE executable not found at "${exePath}". Update ADHICODE_PATH in jarvis-bun\.env`
      : `I ran into a technical issue: ${err}`;
  }

  const lines = output.trim().split("\n")
    .map(l => l.replace(/\x1B\[[\d;]*[a-zA-Z]/g, "").trim())
    .filter(l => l && !l.includes("adhicode") && !l.includes(">") && !l.match(/^[\d]+m$/));
  const result = lines.join(" ").trim();

  if (!result) {
    const raw = output.replace(/\x1B\[[\d;]*[a-zA-Z]/g, "").trim();
    const cleaned = raw.split("\n").filter(l => l.trim() && !l.includes("adhicode")).join(" ").trim();
    return cleaned || "Hmm, I got an empty response.";
  }
  return result;
}

export async function processCommand(userInput: string): Promise<{ response: string; actions: string }> {
  conversationHistory.push({ role: "user", content: userInput });

  let response: string;
  try {
    response = await queryLLM(userInput);
  } catch (e: any) {
    response = `I encountered an error: ${e.message}`;
  }

  conversationHistory.push({ role: "assistant", content: response });

  if (conversationHistory.length > 20) {
    conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-18)];
  }

  const actions = extractActions(response);
  const cleanResponse = stripActions(response);
  let actionResults = "";
  for (const action of actions) {
    const result = await executeAction(action);
    if (result) actionResults += `\n${result}`;
  }

  return { response: cleanResponse, actions: actionResults };
}

export function clearHistory(): void {
  conversationHistory = [{ role: "system", content: SYSTEM_PROMPT }];
}
