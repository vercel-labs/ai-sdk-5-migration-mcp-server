/**
 * AI SDK 5 Migration MCP Server
 *
 * Simple MCP server with 3 tools:
 * 1. create-checklist - Creates a migration checklist in the project
 * 2. search-guide - Searches the migration guide for specific info
 * 3. search-data-guide - Searches the data migration guide for database/persistence info
 */

import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { searchGuide, searchDataGuide } from '@/lib/migration-guide';

const handler = createMcpHandler(
  (server) => {
    // Tool 1: Create migration checklist
    server.tool(
      'create-checklist',
      'Creates an AI SDK 5 migration checklist file in the user\'s project by fetching it from the API. Check if AI_SDK_5_MIGRATION.md exists first - if it does, ask the user before overwriting.',
      {
      },
      async () => {
        const checklistPath = `AI_SDK_5_MIGRATION.md`;
        const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/checklist`;

        return {
          content: [
            {
              type: 'text' as const,
              text: `🚨 ACTION REQUIRED: Fetch and create the migration checklist file.

FILE PATH: ${checklistPath}

STEP 1 - CHECK IF FILE EXISTS:
1. Use read_file to check if ${checklistPath} exists
2. If it EXISTS: Ask the user if they want to overwrite (they may have progress saved)
3. If it DOES NOT EXIST or user approves: Proceed to Step 2

STEP 2 - FETCH THE CHECKLIST:
Run this command to download the checklist customized for this project:

\`\`\`bash
curl -s "${apiUrl}" -o "${checklistPath}"
\`\`\`

This will:
- Generate a fresh AI SDK 5 migration checklist
- Save it directly to ${checklistPath}

STEP 3 - VERIFY THE FILE WAS CREATED:
After running the curl command, read the file to confirm it was created successfully.

---

HOW TO USE THE CHECKLIST:

🔴 CRITICAL: This checklist is your step-by-step guide. You MUST:

1. **Work through phases in order** (Phase 1 → Phase 2 → Phase 3, etc.)
2. **Check off items as you complete them** - THIS IS MANDATORY:
   - Change \`- [ ]\` to \`- [x]\` in the checklist file
   - Use the Edit tool to update AI_SDK_5_MIGRATION.md after EVERY task
   - Update after completing each subsection (e.g., after 1.1, 1.2, 1.3)
   - NEVER skip updating the checklist - it tracks your progress!
3. **Read the checklist before asking what to do next**:
   - The next unchecked item tells you what to do
   - Don't ask the user - check the list!
4. **After Phase 3 (codemods)**: Search for ALL "FIXME" comments
   - These are left by codemods and need manual fixes
   - Address each FIXME systematically in Phase 4
5. **After Phase 4**: Run a build to verify all changes work together
   - Catch type errors across all files
   - Fix any issues before proceeding to Phase 5
6. **Use the right search tool**:
   - \`search-guide\` for code migration questions (APIs, imports, etc.)
   - \`search-data-guide\` for database/persistence questions (Phase 2, conversion functions)

WORKFLOW:
→ Read checklist → Find next \`- [ ]\` → Complete task → UPDATE CHECKLIST (\`- [x]\`) → Repeat

TELL THE USER:
✅ Downloaded AI_SDK_5_MIGRATION.md to your project root
📋 The checklist is your migration roadmap - I'll follow it step by step
✏️ I'll check off items as we complete them (using Edit tool to update the file)
🔍 I'll use search-guide for code changes and search-data-guide for data migration
🔧 After codemods, I'll find and fix all FIXME comments
🏗️ After Phase 4, I'll run a build to verify everything compiles

🚀 Ready to start Phase 1!`,
            },
          ],
        };
      }
    );

    // Tool 2: Search migration guide
    server.tool(
      'search-guide',
      'Search the AI SDK 5 migration guide for specific information about changes, APIs, or patterns. Returns relevant sections from the official migration guide.',
      {
        query: z.string().describe('What to search for (e.g., "useChat", "maxSteps", "tools", "message structure", "streaming")'),
        limit: z.number().int().min(1).max(5).default(3).describe('Maximum number of results to return'),
      },
      async (args) => {
        const results = await searchGuide(args.query);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No results found for "${args.query}".

Try searching for:
- API names: "streamText", "useChat", "generateObject"
- Features: "tools", "streaming", "messages"
- Specific changes: "maxSteps", "message structure", "imports"`,
              },
            ],
          };
        }

        const topResults = results.slice(0, args.limit);
        let response = `# Search Results for "${args.query}"\n\n`;
        response += `Found ${results.length} relevant section(s). Showing top ${topResults.length}:\n\n`;
        response += '---\n\n';

        topResults.forEach((result, index) => {
          response += `## ${index + 1}. ${result.title}\n\n`;
          response += `${result.content}\n\n`;
          response += '---\n\n';
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: response,
            },
          ],
        };
      }
    );

    // Tool 3: Search data migration guide
    server.tool(
      'search-data-guide',
      'Search the AI SDK 5 data migration guide for information about migrating persisted messages and chat data. Use this for database schema migration, conversion functions, and Phase 2 data migration questions.',
      {
        query: z.string().describe('What to search for (e.g., "conversion functions", "Phase 2", "dual write", "database migration", "v4 to v5")'),
        limit: z.number().int().min(1).max(5).default(3).describe('Maximum number of results to return'),
      },
      async (args) => {
        const results = await searchDataGuide(args.query);

        if (results.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No results found for "${args.query}".

Try searching for:
- Phases: "Phase 1", "Phase 2", "runtime conversion"
- Steps: "conversion functions", "dual write", "schema migration"
- Topics: "database", "messages", "v4 to v5", "persisted data"`,
              },
            ],
          };
        }

        const topResults = results.slice(0, args.limit);
        let response = `# Data Migration Guide Results for "${args.query}"\n\n`;
        response += `Found ${results.length} relevant section(s). Showing top ${topResults.length}:\n\n`;
        response += '---\n\n';

        topResults.forEach((result, index) => {
          response += `## ${index + 1}. ${result.title}\n\n`;
          response += `${result.content}\n\n`;
          response += '---\n\n';
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: response,
            },
          ],
        };
      }
    );
  },
  {
    serverInfo: {
      name: 'ai-sdk-5-migration',
      version: '2.0.0',
    },
    capabilities: {
      tools: {},
    },
  },
  {
    basePath: '/api',
    verboseLogs: process.env.NODE_ENV === 'development',
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
