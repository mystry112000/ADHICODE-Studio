import { UI } from "../ui"
import { WEB_DASHBOARD } from "../../server/dashboard"

interface ServerOptions {
  port: number
  web: boolean
}

export async function server(opts: ServerOptions) {
  UI.banner()
  UI.info(`Starting ADHICODE Server on port ${opts.port}...`)

  const adhicodePath = process.env.ADHICODE_PATH || findAdhicode()

  if (opts.web) {
    UI.success("Web Dashboard enabled")
    startWebServer(opts.port)
  } else {
    const proc = Bun.spawn([adhicodePath, "serve"], {
      stdio: ["inherit", "inherit", "inherit"],
      env: { ...process.env, PORT: String(opts.port) },
    })
    UI.success(`Server running at http://localhost:${opts.port}`)
    UI.info("Press Ctrl+C to stop")
    process.on("SIGINT", () => { proc.kill(); process.exit(0) })
    await proc.exited
  }
}

async function startWebServer(port: number) {
  Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url)

      if (url.pathname === "/" || url.pathname === "/dashboard") {
        return new Response(WEB_DASHBOARD, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        })
      }

      if (url.pathname === "/api/run" && req.method === "POST") {
        try {
          const { cmd } = await req.json() as { cmd?: string }
          if (!cmd) return Response.json({ error: "No cmd" }, { status: 400 })
          return Response.json({ status: "ok", cmd, message: `Running: ${cmd}` })
        } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }) }
      }

      if (url.pathname === "/api/workflow" && req.method === "POST") {
        try {
          const { name } = await req.json() as { name?: string }
          if (!name) return Response.json({ error: "No name" }, { status: 400 })
          return Response.json({ status: "ok", workflow: name, message: `Running workflow: ${name}` })
        } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }) }
      }

      if (url.pathname === "/api/status") {
        return Response.json({
          status: "running",
          version: "2.0.0",
          platform: process.platform,
          tools: 22,
          skills: 6,
          workflows: 7,
        })
      }

      return new Response("Not found", { status: 404 })
    },
  })

  UI.success(`Web Dashboard: http://localhost:${port}`)
  UI.success(`API:            http://localhost:${port}/api/status`)
  UI.info("Press Ctrl+C to stop")

  const browserCmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open"
  const proc = Bun.spawn([browserCmd, `http://localhost:${port}`], { stdio: "ignore" })
  setTimeout(() => proc.kill(), 3000)

  process.on("SIGINT", () => process.exit(0))
  process.on("SIGTERM", () => process.exit(0))

  await new Promise(() => {})
}

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
