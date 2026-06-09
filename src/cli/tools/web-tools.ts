import { registerTool } from "./registry"
import { UI } from "../ui"

export function registerWebTools() {
  registerTool({
    name: "shorten",
    description: "Shorten a URL",
    category: "web",
    run: async (args) => {
      const url = args[0]
      if (!url) { UI.error("Usage: run shorten <url>"); return }
      try {
        const resp = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`)
        const short = await resp.text()
        UI.success(`Short URL: ${short}`)
      } catch { UI.error("Cannot shorten URL") }
    },
  })

  registerTool({
    name: "whois",
    description: "Lookup domain WHOIS info",
    category: "web",
    run: async (args) => {
      const domain = args[0]
      if (!domain) { UI.error("Usage: run whois <domain>"); return }
      UI.info(`Looking up ${domain}...`)
      try {
        const resp = await fetch(`https://www.whois.com/whois/${domain}`)
        const html = await resp.text()
        const match = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)
        if (match) console.log(match[1])
        else UI.info("WHOIS data retrieved")
      } catch { UI.error("Cannot lookup domain") }
    },
  })

  registerTool({
    name: "headers",
    description: "Check HTTP headers of a URL",
    category: "web",
    run: async (args) => {
      const url = args[0]
      if (!url) { UI.error("Usage: run headers <url>"); return }
      try {
        const resp = await fetch(url, { method: "HEAD" })
        UI.info(`URL: ${url}`)
        UI.info(`Status: ${resp.status} ${resp.statusText}`)
        UI.divider()
        const rows: string[][] = []
        resp.headers.forEach((v, k) => rows.push([k, v]))
        UI.table(["Header", "Value"], rows)
      } catch (e) { UI.error(`Failed: ${(e as Error).message}`) }
    },
  })

  registerTool({
    name: "qr",
    description: "Generate QR code for text/URL",
    category: "web",
    run: async (args) => {
      const text = args.join(" ") || "https://github.com/mystry112000"
      UI.info(`QR Code for: ${text}`)
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
      UI.info(`Open in browser: ${url}`)
    },
  })
}
