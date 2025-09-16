Goal

Enable "GPT-5 mini (Preview)" for all clients in a Model Context Protocol (MCP) / Copilot-like server.

What I changed locally

- Added `mcp-config.json` at repo root which contains a simple allowed-models list for local MCP deployments.

Notes and next steps (action required on your MCP / GitHub setup)

1. This repo change alone will not enable GPT-5 mini for GitHub Copilot or hosted MCP services. You must update the running MCP server or GitHub organization settings.

2. If you run a local MCP server (Node or other) that reads `mcp-config.json`, restart it. Example (depends on your server):

```bash
# from repo root
npm install
npm run start:mcp
```

3. If you're using the official GitHub Copilot / MCP hosted service, enabling GPT-5 mini for all clients is an org-level feature requiring administrative access. Steps (high level):

- Open your GitHub organization settings for Copilot/AI features.
- Find the "Preview" / "Beta" feature flags or Copilot Labs settings.
- Toggle "Enable GPT-5 mini (Preview) for all clients" and save.

If you need exact steps or a patch/PR to change the server code that reads model lists, tell me which MCP server implementation you run (e.g., `@upstash/context7-mcp`, `@modelcontextprotocol/sdk`, or a custom Node service) and I will make the server-side code change and restart instructions.

Security note

Make sure GPT-5 mini preview access is compliant with your organization's policy. Preview models may have different privacy and compliance characteristics.
