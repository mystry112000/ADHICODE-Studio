const RESET = "\x1b[0m"
const BOLD = "\x1b[1m"
const DIM = "\x1b[2m"
const GREEN = "\x1b[92m"
const CYAN = "\x1b[96m"
const YELLOW = "\x1b[93m"
const RED = "\x1b[91m"
const MAGENTA = "\x1b[95m"
const BLUE = "\x1b[94m"

export class UI {
  static banner() {
    const logo = [
      `${GREEN}                   ${CYAN}                   ${RESET}`,
      `${GREEN}▄^^▄ █^^█ █__█ ^██^${CYAN} █^^^ █^^█ █^^█ █^^█${RESET}`,
      `${GREEN}█▄▄█ █__█ █^^█ _██_${CYAN} █___ █__█ █__█ █^^^${RESET}`,
      `${GREEN}█__█ █▄▄█ █__█ ▄██▄${CYAN} ▀▀▀▀ ▀▀▀▀ █▄▄█ ▀▀▀▀${RESET}`,
    ]
    console.log()
    for (const line of logo) {
      console.log(`  ${line}`)
    }
    console.log(`  ${BOLD}ADHICODE Studio${RESET} ${DIM}v2.0.0${RESET}`)
    console.log()
  }

  static info(...msg: string[]) {
    console.log(`${BLUE}ℹ${RESET}`, ...msg)
  }

  static success(...msg: string[]) {
    console.log(`${GREEN}✔${RESET}`, ...msg)
  }

  static warn(...msg: string[]) {
    console.log(`${YELLOW}⚠${RESET}`, ...msg)
  }

  static error(...msg: string[]) {
    console.log(`${RED}✘${RESET}`, ...msg)
  }

  static step(num: number, total: number, msg: string) {
    console.log(`  ${BOLD}[${num}/${total}]${RESET} ${msg}`)
  }

  static divider() {
    console.log(`  ${DIM}──────────────────────────────────────────${RESET}`)
  }

  static table(headers: string[], rows: string[][]) {
    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] ?? "").length)),
    )
    console.log(
      `  ${headers.map((h, i) => h.padEnd(colWidths[i])).join("  ")}`,
    )
    console.log(
      `  ${colWidths.map((w) => "─".repeat(w)).join("──")}`,
    )
    for (const row of rows) {
      console.log(
        `  ${row.map((c, i) => c.padEnd(colWidths[i])).join("  ")}`,
      )
    }
  }

  static color(c: string, text: string) {
    const map: Record<string, string> = {
      green: GREEN, cyan: CYAN, yellow: YELLOW, red: RED, magenta: MAGENTA, blue: BLUE, dim: DIM, bold: BOLD,
    }
    return `${map[c] ?? ""}${text}${RESET}`
  }
}
