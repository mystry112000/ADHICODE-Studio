import { UI } from "../cli/ui"

export class PlatformAdapter {
  static detect(): "windows" | "linux" | "darwin" | "termux" | "unknown" {
    if (process.env.TERMUX_VERSION) return "termux"
    if (process.env.PREFIX?.includes("com.termux")) return "termux"
    if (process.platform === "win32") return "windows"
    if (process.platform === "linux") return "linux"
    if (process.platform === "darwin") return "darwin"
    return "unknown"
  }

  static isMobile(): boolean {
    return this.detect() === "termux"
  }

  static async init() {
    const platform = this.detect()
    UI.info(`Platform: ${platform}`)

    switch (platform) {
      case "termux":
        await this.initTermux()
        break
      case "windows":
        await this.initWindows()
        break
      case "linux":
        await this.initLinux()
        break
    }
  }

  private static async initTermux() {
    UI.success("Termux environment configured")
    process.env.TERM = "xterm-256color"
    process.env.SHELL = "/data/data/com.termux/files/usr/bin/bash"
  }

  private static async initWindows() {
    process.env.TERM = "xterm-256color"
    process.env.SHELL = process.env.COMSPEC || "cmd.exe"
  }

  private static async initLinux() {
    process.env.TERM = process.env.TERM || "xterm-256color"
  }

  static shell(): string {
    const p = this.detect()
    if (p === "termux") return "/data/data/com.termux/files/usr/bin/bash"
    if (p === "windows") return process.env.COMSPEC || "cmd.exe"
    return process.env.SHELL || "/bin/bash"
  }
}

export async function platformHandler() {
  await PlatformAdapter.init()
}
