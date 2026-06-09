import { UI } from "../ui"

interface ServerOptions {
  port: number
  web: boolean
}

export async function server(opts: ServerOptions) {
  UI.banner()
  UI.info(`Starting ADHICODE Server on port ${opts.port}...`)

  const adhicodePath = process.env.ADHICODE_PATH || findAdhicode()
  const args = ["serve"]

  UI.success(`Server engine: ${adhicodePath}`)
  UI.info(`Port: ${opts.port}`)

  if (opts.web) {
    UI.info("Web UI will open on startup")
    args.push("--web")
  }

  const proc = Bun.spawn([adhicodePath, ...args], {
    stdio: ["inherit", "inherit", "inherit"],
    env: { ...process.env, PORT: String(opts.port) },
  })

  UI.success(`Server running at http://localhost:${opts.port}`)
  UI.info("Press Ctrl+C to stop")

  process.on("SIGINT", () => {
    proc.kill()
    process.exit(0)
  })

  await proc.exited
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
