import { registerTool } from "./registry"
import { execSync } from "child_process"
import { UI } from "../ui"

export function registerSystemTools() {
  registerTool({
    name: "sysinfo",
    description: "Display system information",
    category: "system",
    run: async () => {
      UI.info("System Information:")
      UI.divider()
      const { totalmem, freemem, cpus, hostname, platform, release, uptime } = await import("os")
      const memTotal = (totalmem() / 1024 / 1024 / 1024).toFixed(1)
      const memFree = (freemem() / 1024 / 1024 / 1024).toFixed(1)
      const rows = [
        ["Hostname", hostname()],
        ["Platform", platform()],
        ["Release", release()],
        ["Uptime", `${Math.floor(uptime() / 3600)}h ${Math.floor((uptime() % 3600) / 60)}m`],
        ["CPU", `${cpus().length}x ${cpus()[0]?.model ?? "unknown"}`],
        ["Memory", `${memFree}GB / ${memTotal}GB free`],
      ]
      UI.table(["Key", "Value"], rows)
    },
  })

  registerTool({
    name: "process",
    description: "List and manage processes",
    category: "system",
    run: async (args) => {
      if (args[0] === "kill") {
        const pid = parseInt(args[1] ?? "", 10)
        if (isNaN(pid)) { UI.error("Usage: run process kill <pid>"); return }
        try {
          process.kill(pid, "SIGTERM")
          UI.success(`Process ${pid} terminated`)
        } catch { UI.error(`Failed to kill process ${pid}`) }
        return
      }
      try {
        execSync("tasklist /V 2>nul || ps aux", { stdio: "inherit" })
      } catch { UI.error("Cannot list processes") }
    },
  })

  registerTool({
    name: "disk",
    description: "Show disk usage",
    category: "system",
    run: async () => {
      try {
        execSync("wmic logicaldisk get size,freespace,caption 2>nul || df -h", { stdio: "inherit" })
      } catch { UI.error("Cannot get disk info") }
    },
  })

  registerTool({
    name: "weather",
    description: "Get weather info for a city",
    category: "system",
    run: async (args) => {
      const city = args[0] || "Kanyakumari"
      UI.info(`Fetching weather for ${city}...`)
      try {
        const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%h+%w`)
        const text = await resp.text()
        console.log(`  ${UI.color("cyan", "Weather:")} ${text}`)
      } catch { UI.error("Cannot fetch weather") }
    },
  })

  registerTool({
    name: "notify",
    description: "Send desktop notification",
    category: "system",
    run: async (args) => {
      const msg = args.join(" ") || "Hello from ADHICODE!"
      try {
        const { notify } = await import("child_process")
        execSync(`powershell -Command "New-BurntToastNotification -Text '${msg}'" 2>nul`, { stdio: "ignore" })
        UI.success(`Notification sent: ${msg}`)
      } catch { UI.info(`Notification: ${msg}`) }
    },
  })
}
