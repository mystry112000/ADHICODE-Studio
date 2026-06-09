import { UI } from "../ui"
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs"
import { homedir } from "os"
import { join } from "path"

const CONFIG_DIR = join(homedir(), ".adhicode-studio")
const CONFIG_PATH = join(CONFIG_DIR, "config.json")

interface StudioConfig {
  adhicodePath?: string
  defaultModel?: string
  defaultAgent?: string
  theme?: "dark" | "light"
  jarvisSecret?: string
  githubToken?: string
  terminalFontSize?: number
}

function loadConfig(): StudioConfig {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true })
  if (!existsSync(CONFIG_PATH)) {
    const defaults: StudioConfig = { theme: "dark", terminalFontSize: 14 }
    writeFileSync(CONFIG_PATH, JSON.stringify(defaults, null, 2))
    return defaults
  }
  return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"))
}

function saveConfig(config: StudioConfig) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

export async function showConfig() {
  const config = loadConfig()
  UI.info("ADHICODE Studio Configuration:")
  UI.divider()
  const rows = Object.entries(config).map(([k, v]) => [k, String(v ?? "(not set)")])
  UI.table(["Key", "Value"], rows)
  UI.divider()
  UI.info(`Config file: ${CONFIG_PATH}`)
}

export async function setConfig(key: string, value: string) {
  const config = loadConfig()
  const validKeys: (keyof StudioConfig)[] = [
    "adhicodePath", "defaultModel", "defaultAgent", "theme", "jarvisSecret", "githubToken", "terminalFontSize",
  ]

  if (!validKeys.includes(key as keyof StudioConfig)) {
    UI.error(`Invalid key: ${key}. Valid keys: ${validKeys.join(", ")}`)
    return
  }

  let parsed: string | number = value
  if (key === "terminalFontSize") {
    const n = parseInt(value, 10)
    if (isNaN(n)) { UI.error("terminalFontSize must be a number"); return }
    parsed = n
  }

  ;(config as any)[key] = parsed
  saveConfig(config)
  UI.success(`Set ${key} = ${value}`)
}
