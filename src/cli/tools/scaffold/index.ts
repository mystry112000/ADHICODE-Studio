import { fullstackTemplate } from "./fullstack"
import { frontendTemplate } from "./frontend"
import { backendTemplate } from "./backend"
import { Template, TemplateFile } from "./templates"
import { UI } from "../../ui"

export const templates: Template[] = [
  fullstackTemplate,
  frontendTemplate,
  backendTemplate,
]

export function getTemplate(name: string): Template | undefined {
  return templates.find((t) => t.name === name)
}

export function listTemplates() {
  UI.info("Available templates:")
  for (const t of templates) {
    console.log(`  ${UI.color("green", t.name.padEnd(14))} ${t.description}`)
  }
}

export { Template, TemplateFile }