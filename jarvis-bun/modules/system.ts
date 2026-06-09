import { spawn, execSync } from "child_process";
import { homedir, hostname, platform, totalmem, freemem, uptime } from "os";

const isWin = platform() === "win32";

export function openApp(name: string): string {
  name = name.toLowerCase();
  const apps: Record<string, string[]> = {
    chrome: ["chrome", "google-chrome", "start chrome"],
    browser: ["chrome", "google-chrome", "start chrome"],
    notepad: ["notepad", "gedit", "notepad"],
    calculator: ["calc", "gnome-calculator", "calc"],
    explorer: ["explorer", "nautilus", "explorer"],
    terminal: ["cmd", "gnome-terminal", "cmd"],
    vscode: ["code", "code", "code"],
    spotify: ["spotify", "spotify", "start spotify"],
  };
  const cmd = apps[name] || [name, name, name];
  try {
    if (isWin) {
      const c = cmd[2] || name;
      spawn(c.includes(" ") ? "start" : c, c.includes(" ") ? ['""', name] : [], { shell: true, detached: true });
    } else if (platform() === "darwin") {
      spawn("open", ["-a", cmd[0]], { detached: true });
    } else {
      spawn(cmd[1], [], { detached: true, stdio: "ignore" });
    }
    return `Opened ${name}`;
  } catch (e) {
    return `Could not open ${name}: ${e}`;
  }
}

export function closeApp(name: string): string {
  try {
    if (isWin) {
      execSync(`taskkill /f /im ${name}.exe`, { stdio: "pipe" });
    } else {
      execSync(`pkill -f ${name}`, { stdio: "pipe" });
    }
    return `Closed ${name}`;
  } catch {
    return `Could not close ${name}`;
  }
}

export function runCommand(command: string): string {
  try {
    const result = execSync(command, { shell: true, encoding: "utf-8", timeout: 30000, maxBuffer: 1024 * 500 });
    return result.slice(0, 500) || "Command executed";
  } catch (e: any) {
    return e.stdout?.slice(0, 500) || e.stderr?.slice(0, 500) || `Command error: ${e.message}`;
  }
}

export function getCurrentTime(): string {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return `It's ${time} on ${date}`;
}

export function getSystemInfo(): string {
  const cpu = platform();
  const totalGB = (totalmem() / 1024 ** 3).toFixed(1);
  const freeGB = (freemem() / 1024 ** 3).toFixed(1);
  const usedGB = (parseFloat(totalGB) - parseFloat(freeGB)).toFixed(1);
  const uptimeHours = (uptime() / 3600).toFixed(1);
  return `OS: ${cpu} | RAM: ${usedGB}GB/${totalGB}GB used | Host: ${hostname()} | Uptime: ${uptimeHours}h`;
}
