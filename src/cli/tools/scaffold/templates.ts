import { mkdir, writeFile } from "node:fs/promises"
import { join, resolve, dirname } from "node:path"

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true })
}

export async function writeProject(template: Template, projectName: string, outputDir: string) {
  const root = resolve(join(outputDir, projectName))
  const files = template.generate(projectName)
  for (const f of files) {
    const fullPath = join(root, f.path)
    await ensureDir(dirname(fullPath))
    await writeFile(fullPath, f.content)
  }
  return root
}
