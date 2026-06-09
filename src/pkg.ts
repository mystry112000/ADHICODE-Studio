import { readFileSync } from "fs"

let _pkg: { version: string; name: string; description: string } | null = null

function load(): { version: string; name: string; description: string } {
  if (_pkg) return _pkg
  try {
    _pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8"))
  } catch {
    _pkg = { version: "2.0.0", name: "adhicode-studio", description: "ADHICODE Studio" }
  }
  return _pkg
}

export const pkg = new Proxy({} as { version: string; name: string; description: string }, {
  get(_, prop) {
    return load()[prop as keyof typeof _pkg]
  },
})
