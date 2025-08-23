const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.MCP_PORT || 4001

function readConfig() {
  const configPath = path.resolve(__dirname, '../../mcp-config.json')
  try {
    const raw = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.warn('mcp-config.json not found or invalid, returning default')
    return { mcp: { enabledModels: [], clients: '*' } }
  }
}

app.get('/models', (req, res) => {
  const config = readConfig()
  res.json({ allowed: config.mcp?.enabledModels || [] })
})

app.listen(PORT, () => {
  console.log(`MCP shim server listening on http://localhost:${PORT}`)
})
