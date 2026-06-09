import { Template, TemplateFile } from "./templates"

function json(o: Record<string, unknown>) {
  return JSON.stringify(o, null, 2)
}

export const backendTemplate: Template = {
  name: "backend",
  description: "Bun + Hono + TypeScript REST API backend only",
  category: "backend",
  generate: (name: string) => {
    const files: TemplateFile[] = []

    files.push({
      path: "package.json",
      content: json({
        name,
        private: true,
        type: "module",
        scripts: {
          dev: "bun run --hot src/index.ts",
          build: "bun build src/index.ts --outdir ./dist",
          start: "bun run dist/index.js",
          test: "bun test",
          "db:push": "drizzle-kit push",
          "db:generate": "drizzle-kit generate",
          "db:migrate": "drizzle-kit migrate",
        },
        dependencies: {
          hono: "^4.0.0",
          zod: "^4.0.0",
          "@hono/zod-validator": "^1.0.0",
          "drizzle-orm": "^0.38.0",
          "@libsql/client": "^0.14.0",
        },
        devDependencies: {
          typescript: "^5.7.0",
          "@types/bun": "^1.2.0",
          "drizzle-kit": "^0.30.0",
        },
      }),
    })

    files.push({
      path: "tsconfig.json",
      content: json({
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          outDir: "./dist",
        },
        include: ["src"],
      }),
    })

    files.push({
      path: ".env.example",
      content: `PORT=3001
DATABASE_URL=file:./data/dev.db
NODE_ENV=development`,
    })

    files.push({
      path: ".gitignore",
      content: "node_modules\ndist\n.env\n*.db\n",
    })

    files.push({
      path: "drizzle.config.ts",
      content: `import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./data/dev.db',
  },
})`,
    })

    files.push({
      path: "src/index.ts",
      content: `import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from './config'
import itemsRouter from './routes/items.routes'

const app = new Hono()

app.use('*', cors({ origin: config.corsOrigins, credentials: true }))
app.use('*', logger())

app.get('/api/v1/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.route('/api/v1/items', itemsRouter)

Bun.serve({
  port: config.port,
  fetch: app.fetch,
})

console.log(\`API running on http://localhost:\${config.port}\`)`,
    })

    files.push({
      path: "src/config.ts",
      content: `export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'file:./data/dev.db',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
}`,
    })

    files.push({
      path: "src/db/schema.ts",
      content: `import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  done: integer('done', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
})`,
    })

    files.push({
      path: "src/db/index.ts",
      content: `import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { config } from '../config'

const client = createClient({ url: config.databaseUrl })
export const db = drizzle(client)`,
    })

    files.push({
      path: "src/routes/items.routes.ts",
      content: `import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../db'
import { items } from '../db/schema'

const router = new Hono()

router.get('/', async (c) => {
  const result = await db.select().from(items).all()
  return c.json(result)
})

router.post('/',
  zValidator('json', z.object({ name: z.string().min(1) })),
  async (c) => {
    const { name } = c.req.valid('json')
    const result = await db.insert(items).values({ name }).returning().get()
    return c.json(result, 201)
  }
)

router.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const item = await db.select().from(items).where(eq(items.id, id)).get()
  return item ? c.json(item) : c.json({ error: 'Not found' }, 404)
})

router.patch('/:id',
  zValidator('json', z.object({ name: z.string().min(1).optional(), done: z.boolean().optional() })),
  async (c) => {
    const id = parseInt(c.req.param('id'))
    const body = c.req.valid('json')
    await db.update(items).set(body).where(eq(items.id, id)).run()
    const updated = await db.select().from(items).where(eq(items.id, id)).get()
    return updated ? c.json(updated) : c.json({ error: 'Not found' }, 404)
  }
)

router.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await db.delete(items).where(eq(items.id, id)).run()
  return c.json({ success: true })
})

import { eq } from 'drizzle-orm'

export default router`,
    })

    files.push({
      path: "src/middleware/auth.ts",
      content: `import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header('Authorization')
  if (!token || !token.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})`,
    })

    files.push({
      path: "src/types.ts",
      content: `export interface Item {
  id: number
  name: string
  done: boolean
  createdAt?: string
}

export interface ApiError {
  error: string
  status: number
}`,
    })

    return files
  },
}
