import { UI } from "../ui"

const ADHICODE_PATH = process.env.ADHICODE_PATH || findAdhicode()
const JARVIS_BUN_PATH = new URL("../../../jarvis-bun", import.meta.url).pathname

function findAdhicode(): string {
  const candidates = [
    process.env.ADHICODE_PATH,
    new URL("../../../ADHICODE.exe", import.meta.url).pathname,
    new URL("../../../#ADHICODE-v2.exe", import.meta.url).pathname,
  ]
  for (const c of candidates) {
    if (c) return c
  }
  return "ADHICODE.exe"
}

export async function jarvis(message?: string) {
  UI.banner()
  UI.info("Starting Jarvis AI Assistant...")

  const serverProcess = Bun.spawn(["bun", "run", "server.ts"], {
    cwd: new URL("../../../jarvis-bun", import.meta.url).pathname,
    stdio: ["ignore", "inherit", "inherit"],
  })

  UI.success(`Jarvis server started (PID: ${serverProcess.pid})`)
  UI.info("Python voice interface ready at jarvis-assistant/")
  UI.info("Run: cd jarvis-assistant && python main.py")

  if (message) {
    UI.info(`Message: ${message}`)
    const resp = await fetch("http://localhost:4876/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, secret: process.env.JARVIS_SECRET || "adhicode" }),
    })
    const data = await resp.json() as { response?: string }
    if (data.response) {
      console.log(`\n${UI.color("cyan", "Jarvis:")} ${data.response}`)
    }
  }

  process.on("SIGINT", () => {
    serverProcess.kill()
    process.exit(0)
  })

  await new Promise(() => {})
}
