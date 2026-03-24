/**
 * Lightweight dev-only content editing server.
 * Runs on port 3001 alongside Next.js dev server.
 * Handles reading/writing JSON content files for inline editing.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, 'src', 'content')
const PORT = 3001

const ALLOWED_FILES = ['config', 'home', 'about', 'portfolio', 'order', 'instagram']

function getFilePath(file) {
  if (!ALLOWED_FILES.includes(file)) return null
  return path.join(CONTENT_DIR, `${file}.json`)
}

function parseQuery(url) {
  const u = new URL(url, `http://localhost:${PORT}`)
  return Object.fromEntries(u.searchParams)
}

const server = http.createServer(async (req, res) => {
  // CORS headers for Next.js dev server
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const query = parseQuery(req.url)
  const { file } = query

  if (!file) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Missing file param' }))
    return
  }

  const filePath = getFilePath(file)
  if (!filePath) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid file' }))
    return
  }

  if (req.method === 'GET') {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(content))
    return
  }

  if (req.method === 'PUT') {
    let body = ''
    for await (const chunk of req) body += chunk
    const { path: fieldPath, value } = JSON.parse(body)

    if (fieldPath === undefined || value === undefined) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Missing path or value' }))
      return
    }

    // Empty path means replace the entire file content
    if (fieldPath === '') {
      fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf-8')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true }))
      return
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    const keys = String(fieldPath).split('.')
    let target = content
    for (let i = 0; i < keys.length - 1; i++) {
      const key = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i])
      target = target[key]
      if (target === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `Invalid path: ${fieldPath}` }))
        return
      }
    }

    const lastKey = isNaN(Number(keys[keys.length - 1]))
      ? keys[keys.length - 1]
      : Number(keys[keys.length - 1])
    target[lastKey] = value

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8')

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }

  if (req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    const { action, path: arrayPath, item, from, to } = JSON.parse(body)

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    // Navigate to the target array
    const keys = arrayPath ? String(arrayPath).split('.') : []
    let target = content
    for (const k of keys) {
      const key = isNaN(Number(k)) ? k : Number(k)
      target = target[key]
      if (target === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `Invalid path: ${arrayPath}` }))
        return
      }
    }

    if (!Array.isArray(target)) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Path does not point to an array' }))
      return
    }

    if (action === 'add') {
      if (to !== undefined) {
        target.splice(to, 0, item)
      } else {
        target.push(item)
      }
    } else if (action === 'remove') {
      target.splice(from, 1)
    } else if (action === 'move') {
      if (from === undefined || to === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'move requires from and to' }))
        return
      }
      const [moved] = target.splice(from, 1)
      target.splice(to, 0, moved)
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: `Unknown action: ${action}` }))
      return
    }

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8')

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }

  res.writeHead(405, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Method not allowed' }))
})

server.listen(PORT, () => {
  console.log(`\u270F\uFE0F  Content editor API running at http://localhost:${PORT}`)
})
