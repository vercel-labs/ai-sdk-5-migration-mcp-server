# AI SDK 5 Migration MCP Server

An MCP server that helps you migrate from AI SDK 4.x to 5.0 in one shot.

## Quick Start

**Step 1:** Configure Cursor

Create or edit `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "ai-sdk-5-migration": {
      "url": "https://ai-sdk-5-migration-mcp-server.vercel.app/api/mcp"
    }
  }
}
```
After saving the configuration, open the command palette (Cmd+Shift+P) and search for "View: Open MCP Settings". Verify that the new server appears in the list and is toggled to on.

> **Want to run it locally?** See the [Local Development](#local-development) section below.

**Step 2:** Run the migration

Open your project in Cursor and use this prompt:

```txt
Please migrate this project to AI SDK 5 using the ai-sdk-5-migration mcp server. Start by creating a checklist.
```

This one-shot prompt will:
1. Create a comprehensive migration checklist (`AI_SDK_5_MIGRATION.md`)
2. Guide you through all migration steps systematically
3. Search the official migration guides when needed for specific changes

> **Note:** This has been tested with Cursor's auto model setting

## How It Works

This server provides three MCP tools:

1. **`create-checklist`** - Returns a curl command that downloads a comprehensive migration checklist to `AI_SDK_5_MIGRATION.md`. This is much more efficient than having the model generate ~800 lines of text.

2. **`search-guide`** - Searches the official AI SDK 5 migration guide for code-related changes (APIs, imports, streaming, tools, etc.). Returns the most relevant sections with examples.

3. **`search-data-guide`** - Searches the data migration guide for database and persistence information (converting stored messages, dual-write patterns, schema changes).

The AI agent uses these tools automatically when you run the one-shot prompt above.

## Local Development

If you prefer to run the server locally:

```bash
pnpm install
pnpm dev
```

Then update your `.cursor/mcp.json` to use `http://localhost:3000/api/mcp` instead of the hosted version.

## Resources

- [AI SDK Documentation](https://ai-sdk.dev)
- [AI SDK 5.0 Migration Guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT
