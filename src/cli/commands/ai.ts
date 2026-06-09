import { UI } from "../ui"
import { execSync } from "child_process"

interface AiOptions {
  message: string
  model?: string
  agent?: string
  file?: string
}

export async function ai(opts: AiOptions) {
  if (!opts.message) {
    UI.error("No message provided. Usage: ai <message>")
    return
  }

  const adhicodePath = process.env.ADHICODE_PATH || findAdhicode()

  const args = ["run", opts.message]
  if (opts.model) args.push("--model", opts.model)
  if (opts.agent) args.push("--agent", opts.agent)
  if (opts.file) args.push("--file", opts.file)

  UI.info(`Using ADHICODE engine: ${adhicodePath}`)
  UI.divider()

  const proc = Bun.spawn([adhicodePath, ...args], {
    stdio: ["inherit", "inherit", "inherit"],
    env: { ...process.env },
  })

  const exitCode = await proc.exited
  if (exitCode !== 0) {
    UI.error(`ADHICODE exited with code ${exitCode}`)
  }
}

export async function aiQuery(message: string): Promise<string> {
  const adhicodePath = process.env.ADHICODE_PATH || findAdhicode()
  try {
    const result = execSync(`"${adhicodePath}" run "${message}" --format json`, {
      encoding: "utf-8",
      timeout: 60000,
    })
    return result.trim()
  } catch (e) {
    return `Error: ${(e as Error).message}`
  }
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
