/**
 * Migration Checklist Generator
 */

export function generateChecklist(): string {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const conversionFunctionsUrl = `${baseUrl}/api/conversion-functions`;

  return `# AI SDK 5 Migration Checklist

## Overview

This checklist will guide you through migrating from AI SDK 4.x to 5.0. Check off items as you complete them.

## 📋 How to Use This Checklist (For AI Agents)

**THIS IS YOUR MAIN SOURCE OF TRUTH:**

1. ✅ **Check off items as you complete them**: Change \`- [ ]\` to \`- [x]\`
2. 📝 **Update this file regularly - THIS IS MANDATORY**:
   - Use the Edit tool to update \`AI_SDK_5_MIGRATION.md\` after EVERY task
   - Update after completing each subsection (e.g., after 1.1, 1.2, 1.3, etc.)
   - NEVER skip updating the checklist - the user relies on this for progress tracking
   - Mark items as \`[x]\` immediately after completion, not in batches
3. 📖 **Read before asking what's next**: The next unchecked item tells you what to do
4. 🔄 **Work sequentially**: Follow phases in order (Phase 1 → 2 → 3 → 4, etc.)
5. 🔧 **After Phase 3**: Find ALL FIXME comments and address them in Phase 4
6. 🔍 **Use the right tools**:
   - \`search-guide\` for code migration (APIs, imports, breaking changes)
   - \`search-data-guide\` for data/database migration (conversion functions, schema changes)
7. 💾 **Keep progress updated**: This file is the single source of truth for your migration status

**WORKFLOW:** Read this file → Find next \`- [ ]\` → Complete task → **UPDATE THIS FILE (\`- [x]\`)** → Repeat

**CRITICAL: Updating the checklist is not optional. It must be done after every subsection.**

---

## Phase 1: Preparation

**AI Agent: YOU must perform these actions, not just check them off!**

### 1.1 Check Git Status
- [ ] **ACTION**: Run \`git status\` to check for uncommitted changes
- [ ] **ACTION**: If there are uncommitted changes, commit them with \`git commit -am "Pre-migration checkpoint"\`
- [ ] **ACTION**: Create migration branch: \`git checkout -b ai-sdk-5-migration\`
- [ ] **ACTION**: Commit migration guide: \`git add AI_SDK_5_MIGRATION.md && git commit -m "Add migration checklist"\`
- [ ] **ACTION**: Verify clean working directory with \`git status\`

### 1.2 Review Current Setup
- [ ] **ACTION**: Search codebase for AI SDK imports: \`grep -r "from 'ai'" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"\`
- [ ] **ACTION**: Check current \`ai\` package version in package.json
- [ ] **INFO**: Note current version here: ___
- [ ] **ACTION**: Search for \`message.content\` usage: \`grep -r "message\\.content" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"\`
- [ ] **INFO**: Files accessing message.content: ___ (these will ALL need refactoring)

### 1.3 Assess Data Migration Needs
- [ ] **ACTION**: Do you have existing message data in a database? (Yes/No): ___
- [ ] **ACTION**: If Yes, estimate number of stored messages: ___
- [ ] **INFO**: If you have existing messages, you'll need a backward compatibility layer (see Phase 4.2)

**After completing Phase 1, update this file to mark items as [x], then proceed to Phase 2.**

---

## Phase 2: Update Dependencies

**AI Agent: Execute these commands to update packages.**

### 2.1 Update Core Package
- [ ] **ACTION**: Run \`pnpm add ai@latest\`
- [ ] **ACTION**: Read package.json to verify version shows ^5.0.0 or higher
- [ ] **INFO**: New version installed: ___

### 2.2 Update Provider Packages (if used)
- [ ] **ACTION**: Check package.json for provider packages, then update if present:
  - \`pnpm add @ai-sdk/openai@latest\` (if used)
  - \`pnpm add @ai-sdk/anthropic@latest\` (if used)
  - \`pnpm add @ai-sdk/google@latest\` (if used)
  - Other providers as needed

### 2.3 Update UI Packages (if used)
- [ ] **ACTION**: Check package.json for UI packages, then update if present:
  - \`pnpm add @ai-sdk/react@latest\` (if used)
  - \`pnpm add @ai-sdk/rsc@latest\` (if using React Server Components)

### 2.4 Update Other Dependencies
- [ ] **ACTION**: Update zod: \`pnpm add zod@latest\` (required 4.1.8+ for TypeScript performance)
- [ ] **ACTION**: Run \`pnpm install\` to ensure lock file is updated

### 2.5 Add Legacy AI SDK Alias (Optional but Recommended)
**💡 Pro Tip:** Keep v4 SDK installed under alias for type-safe message transformations.

- [ ] **ACTION**: Add AI SDK v4 as alias to package.json:
\`\`\`json
{
  "dependencies": {
    "ai": "^5.0.0",
    "ai-legacy": "npm:ai@^4.3.2"
  }
}
\`\`\`

- [ ] **ACTION**: Run \`pnpm install\` to install the aliased package
- [ ] **INFO**: This allows you to import v4 types: \`import type { Message } from 'ai-legacy'\`
- [ ] **BENEFIT**: Makes your v4 → v5 transformer fully type-safe

### 2.6 Commit Changes
- [ ] **ACTION**: Commit package updates: \`git add package.json pnpm-lock.yaml && git commit -m "Update to AI SDK 5"\`

**After completing Phase 2, update this file to mark items as [x], then proceed to Phase 3.**

---

## Phase 3: Run Automated Codemods

**AI Agent: Run the codemod and identify all FIXMEs for Phase 4.**

### 3.1 Run Codemods
- [ ] **ACTION**: Run codemod: \`npx @ai-sdk/codemod@latest v5\`
- [ ] **ACTION**: Review changes with \`git diff\`
- [ ] **ACTION**: Commit codemod changes: \`git add -A && git commit -m "Apply AI SDK 5 codemods"\`

**Note:** Codemods fix ~80% of breaking changes automatically including:
- Type renames (CoreMessage → ModelMessage)
- Import updates (ai/react → @ai-sdk/react)
- API parameter renames (maxTokens → maxOutputTokens)
- Tool definition changes (parameters → inputSchema)

### 3.2 Find All FIXME Comments
- [ ] **ACTION**: Search entire codebase for FIXME comments: \`grep -r "FIXME" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .\`
- [ ] **ACTION**: List ALL FIXME locations with file paths and line numbers
- [ ] **INFO**: Total FIXME comments found: ___
- [ ] **ACTION**: Create a list/plan for addressing each FIXME in Phase 4

**CRITICAL:** The codemod leaves FIXME comments where manual intervention is needed. You MUST find and address ALL of them in Phase 4.

**After completing Phase 3, update this file to mark items as [x], then proceed to Phase 4.**

---

## Phase 4: Critical Foundation Changes

**Instructions for AI Agent:**
- These changes are REQUIRED before data migration
- They prepare your code to handle v5 message structure
- Complete these sections before moving to Phase 5

### 4.1 Define Custom UIMessage Type 🟡 HIGHLY RECOMMENDED - DO THIS FIRST

**⚠️ NOT REQUIRED, BUT HIGHLY RECOMMENDED FOR TYPE SAFETY ⚠️**

This step is optional but strongly recommended. It provides full type safety across your entire application for messages, metadata, data parts, and tools.

\`UIMessage\` is designed to be type-safe with three generic parameters:
1. **\`METADATA\`** - Custom metadata type for additional message information
2. **\`DATA_PARTS\`** - Custom data part types for structured data components
3. **\`TOOLS\`** - Tool definitions for type-safe tool interactions

**💡 Key Insight:** Create your own typed \`UIMessage\` and use it throughout your application instead of importing the generic \`UIMessage\` directly from \`ai\`.

#### 4.1.1 Create Your Custom UIMessage Type

- [ ] **ACTION**: Create a new file for your message types (e.g., \`lib/types/messages.ts\` or \`types/chat.ts\`)

- [ ] **ACTION**: Define your custom UIMessage type:

\`\`\`typescript
import { InferUITools, ToolSet, UIMessage, tool } from 'ai';
import { z } from 'zod';

// 1. Define your metadata schema (if you have custom metadata)
const metadataSchema = z.object({
  userId: z.string().optional(),
  conversationId: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  // Add any other metadata fields your app needs
});

type MyMetadata = z.infer<typeof metadataSchema>;

// 2. Define your data part schema (if you have custom data parts)
const dataPartSchema = z.object({
  customData: z.object({
    // Define custom data part structure
  }).optional(),
  // Add other data part types as needed
});

type MyDataPart = z.infer<typeof dataPartSchema>;

// 3. Define your tools (if using tool calling)
// 💡 Tools can be defined here OR imported from separate files!
// Option A: Define inline
const getWeather = tool({
  description: 'Get weather for a location',
  inputSchema: z.object({
    location: z.string(),
  }),
});

// Option B: Import from other files (recommended for better organization)
// import { getWeather, searchDatabase, createUser } from './tools';

const tools = {
  getWeather,
  // Add other tools here (inline or imported)
} satisfies ToolSet;

type MyTools = InferUITools<typeof tools>;

// 4. Export your custom UIMessage type
export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;

// 5. Also export the tools if you're using them
export { tools };
\`\`\`

- [ ] **INFO**: Location of custom UIMessage type file: ___

**Note:** If you choose to skip custom UIMessage typing, you can proceed directly to section 4.2. However, you'll miss out on type safety benefits for metadata, custom data parts, and tool names.

#### 4.1.2 Replace All UIMessage Imports (if using custom type)

- [ ] **ACTION**: Search for all imports of \`UIMessage\` from \`ai\`:
  \`\`\`bash
  grep -r "import.*UIMessage.*from ['\\"]ai" --include="*.ts" --include="*.tsx"
  \`\`\`

- [ ] **ACTION**: Replace all \`UIMessage\` imports with your custom type:
  - ❌ Old: \`import { UIMessage } from 'ai'\`
  - ✅ New: \`import { MyUIMessage } from '@/lib/types/messages'\` (use your custom type)

- [ ] **ACTION**: Update all type annotations to use your custom type:
  - ❌ Old: \`const messages: UIMessage[] = ...\`
  - ✅ New: \`const messages: MyUIMessage[] = ...\`

- [ ] **ACTION**: Update function parameters and return types:
  - ❌ Old: \`function processMessage(message: UIMessage): UIMessage\`
  - ✅ New: \`function processMessage(message: MyUIMessage): MyUIMessage\`

- [ ] **INFO**: Files updated with custom UIMessage type: ___

#### 4.1.3 Update useChat/Hook Usage (if using custom type)

- [ ] **ACTION**: Update React hooks to use your custom type:

\`\`\`typescript
import { useChat } from '@ai-sdk/react';
import { MyUIMessage } from '@/lib/types/messages';

function ChatComponent() {
  const { messages } = useChat<MyUIMessage>({
    // ... your config
  });

  // Now messages is properly typed as MyUIMessage[]
}
\`\`\`

#### 4.1.4 Update API Routes/Server Code (if using custom type)

- [ ] **ACTION**: Update server-side code to use your custom type:

\`\`\`typescript
import { MyUIMessage } from '@/lib/types/messages';

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();

  // Now messages are properly typed
}
\`\`\`

#### 4.1.5 Verify Type Safety (if using custom type)

- [ ] **ACTION**: Run TypeScript compiler to check for type errors: \`pnpm tsc --noEmit\`
- [ ] **ACTION**: Verify that your IDE shows proper autocomplete for message properties
- [ ] **ACTION**: Check that tool names are properly typed (if using tools)
- [ ] **ACTION**: Verify metadata fields are type-checked

**✅ Once complete, you have full type safety across your entire application!**

**After completing 4.1, proceed to 4.2.**

---

### 4.2 Message Content Access Migration 🔴 CRITICAL
**Update code that accesses \`message.content\` to use the \`parts\` array instead.**

This MUST be done before data migration, otherwise your app won't work with v5 messages.

- [ ] **ACTION**: Find all \`message.content\` usage (you did this in Phase 1.2)
- [ ] **ACTION**: Update UI components that display messages
- [ ] **ACTION**: Update API routes that process messages
- [ ] **ACTION**: Update any logic that checks or manipulates message content

**Common patterns to fix:**
\`\`\`typescript
// ❌ v4 pattern
if (message.content.includes("weather")) { ... }
const title = message.content.substring(0, 50);

// ✅ v5 pattern
const text = message.parts.filter(part => part.type === "text").map(part => part.text).join("");
if (text.includes("weather")) { ... }
const title = text.substring(0, 50);
\`\`\`

- [ ] **INFO**: Files updated: ___

### 4.3 Tool Invocation Structure Changes 🔴 CRITICAL
**Tool parts use a different structure in v5.**

This MUST be done before data migration if you use tools.

**v4 structure:**
\`\`\`typescript
{
  type: "tool-invocation",
  toolInvocation: {
    state: "result",           // or "partial-call", "call"
    toolCallId: "call_123",
    toolName: "searchPersonas",
    args: { query: "coffee lovers" },
    result: { personas: [...] }
  }
}
\`\`\`

**v5 structure:**
\`\`\`typescript
{
  type: "tool-searchPersonas",  // Typed as tool-\${toolName}
  toolCallId: "call_123",
  state: "output-available",    // States renamed
  input: { query: "..." },      // args → input
  output: { personas: [...] }   // result → output
}
\`\`\`

**All v5 tool states:**
- \`"input-streaming"\` - Tool arguments being streamed (was "partial-call")
- \`"input-available"\` - Tool ready to execute (was "call")
- \`"output-available"\` - Tool completed successfully (was "result")
- \`"output-error"\` - Tool execution failed (new in v5)

- [ ] **ACTION**: Update tool part detection logic:
  - ❌ Old: \`part.type === "tool-invocation"\`
  - ✅ New: \`part.type.startsWith("tool-")\`

- [ ] **ACTION**: Update field access:
  - ❌ Old: \`part.toolInvocation.args\`, \`part.toolInvocation.result\`
  - ✅ New: \`part.input\`, \`part.output\`

- [ ] **ACTION**: Update ALL state checks:
  - ❌ Old: \`"partial-call"\`, \`"call"\`, \`"result"\`
  - ✅ New: \`"input-streaming"\`, \`"input-available"\`, \`"output-available"\`

- [ ] **ACTION**: Add error state handling: \`"output-error"\`

- [ ] **INFO**: Files updated: ___

**After completing sections 4.1-4.3, your code can handle v5 message structure. Proceed to Phase 5.**

---

## Phase 5: Data Migration (Runtime Conversion)

### 5.1 Understanding the Problem

The v5 message structure is fundamentally different from v4:
- **Message content**: \`content\` string → \`parts\` array
- **Tool structure**: Nested \`toolInvocation\` → Flat tool parts with \`tool-{name}\` type
- **Tool states**: \`"partial-call"\`, \`"call"\`, \`"result"\` → \`"input-streaming"\`, \`"input-available"\`, \`"output-available"\`, \`"output-error"\`
- **Tool fields**: \`args\`/\`result\` → \`input\`/\`output\`
- **Reasoning**: \`{ reasoning: "..." }\` → \`{ text: "..." }\`
- **File parts**: \`data\`/\`mimeType\` → \`url\`/\`mediaType\`

**Without conversion, stored v4 messages will break your application.**

### 5.2 Runtime Conversion Strategy

**💡 Recommended Approach:** Add a conversion layer that transforms v4 messages to v5 format when reading from the database.

**Benefits:**
- Transform v4 → v5 on-the-fly when loading messages
- Users get instant access to existing chats after upgrade
- No downtime, no data migration delays
- Safe rollback if needed
- Can optionally perform permanent migration later (see Phase 8)

**This phase implements the conversion layer.** The actual database schema migration is optional and covered in Phase 8.

### 5.3 Download Pre-Built Conversion Functions 🔴 CRITICAL

**⚠️ REQUIRED FOR PHASE 5 ⚠️**

The comprehensive conversion functions from the data migration guide handle all edge cases.

#### 5.3.1 Verify ai-legacy Package (Required!)

- [ ] **ACTION**: Verify you completed Phase 2.5 and installed \`ai-legacy\`:

\`\`\`json
{
  "dependencies": {
    "ai": "^5.0.0",
    "ai-legacy": "npm:ai@^4.3.2"
  }
}
\`\`\`

- [ ] **ACTION**: If you skipped Phase 2.5, install now: \`pnpm install\`
- [ ] **IMPORTANT**: Acknowledge that the conversion functions **will not work** without \`ai-legacy\` installed

#### 5.3.2 Download the Conversion Functions

- [ ] **ACTION**: Download the complete conversion functions:

\`\`\`bash
curl -s "${conversionFunctionsUrl}" -o lib/convert-messages.ts
\`\`\`

This file provides:
- ✅ Full type safety with proper type guards
- ✅ Handles all V4 → V5 transformations
- ✅ Bidirectional conversion (V4 ↔ V5)
- ✅ Handles edge cases
- ✅ Compatible with custom UIMessage types from section 4.1

- [ ] **INFO**: Location where you saved the conversion functions: ___

#### 5.3.3 Customize for Your Project (Optional)

If you created a custom UIMessage in section 4.1, update the import in the conversion file:

- [ ] **ACTION**: Update the \`MyUIMessage\` type in the conversion file to use your custom type
- [ ] **ACTION**: Verify imports work correctly
- [ ] **ACTION**: Run TypeScript check: \`pnpm tsc --noEmit\`

#### 5.3.4 Integrate the Conversion Functions

- [ ] **ACTION**: Import and use in your database queries:

\`\`\`typescript
import { convertV4MessageToV5 } from '@/lib/conversion-functions';

// Example: When loading messages from database
export async function getMessages(chatId: string) {
  const rawMessages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' }
  });

  // Transform v4 messages to v5 on the fly
  return rawMessages.map((msg, index) => convertV4MessageToV5(msg, index));
}
\`\`\`

- [ ] **ACTION**: Apply transformation in ALL places where messages are read from storage
- [ ] **ACTION**: Ensure transformation happens BEFORE messages reach React components
- [ ] **INFO**: Files updated with conversion functions: ___

### 5.4 CRITICAL: Apply Conversion in BOTH Directions 🔴🔴🔴

**⚠️ YOU MUST CONVERT WHEN READING AND WHEN WRITING ⚠️**

The conversion layer works in BOTH directions until you complete Phase 8:

#### 5.4.1 When LOADING Messages (Database → Application)
- [ ] **ACTION**: Apply \`convertV4MessageToV5\` when loading messages from database:

\`\`\`typescript
import { convertV4MessageToV5 } from '@/lib/conversion-functions';

// Example: Loading messages from database
export async function getMessages(chatId: string) {
  const rawMessages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' }
  });

  // Transform v4 messages to v5 on the fly
  return rawMessages.map((msg, index) => convertV4MessageToV5(msg, index));
}
\`\`\`

- [ ] **ACTION**: Apply transformation in ALL places where messages are read from storage
- [ ] **ACTION**: Ensure transformation happens BEFORE messages reach React components
- [ ] **INFO**: Files updated with read-time conversion: ___

#### 5.4.2 When SAVING Messages (Application → Database)
- [ ] **ACTION**: Apply \`convertV5MessageToV4\` when saving messages to database:

\`\`\`typescript
import { convertV5MessageToV4 } from '@/lib/conversion-functions';

// Example: Saving messages to database
export async function saveMessages(chatId: string, messages: MyUIMessage[]) {
  // Convert v5 messages back to v4 format for storage
  const v4Messages = messages.map(msg => convertV5MessageToV4(msg));

  await db.message.createMany({
    data: v4Messages.map(msg => ({
      chatId,
      role: msg.role,
      content: msg.content,
      // ... other fields
    }))
  });
}

// Example: In your API route's onFinish callback
return result.toUIMessageStreamResponse({
  onFinish: async ({ messages, responseMessage }) => {
    // Convert messages to v4 before saving
    const v4Messages = messages.map(msg => convertV5MessageToV4(msg));
    await saveChat({ chatId, messages: v4Messages });
  },
});
\`\`\`

- [ ] **ACTION**: Apply conversion in ALL places where messages are written to storage
- [ ] **ACTION**: Update \`onFinish\` callbacks in streaming responses
- [ ] **ACTION**: Update message upsert/insert operations
- [ ] **INFO**: Files updated with write-time conversion: ___

**🚨 CRITICAL:** If you only convert when reading but not when writing, new v5 messages will be saved in v5 format while old messages remain in v4 format, causing inconsistent data and rendering errors!

### 5.5 Test Runtime Transformation Thoroughly

- [ ] **ACTION**: Test with actual v4 messages from your database:
  - [ ] Load old conversations and verify they display correctly
  - [ ] Test text-only messages
  - [ ] Test messages with tool calls (all states: partial-call, call, result)
  - [ ] Test messages with reasoning traces
  - [ ] Test messages with file/data attachments
  - [ ] Test messages with multiple parts
  - [ ] Test continuing old conversations with new v5 messages

- [ ] **ACTION**: Test bidirectional conversion:
  - [ ] Load old v4 messages (v4 → v5 conversion)
  - [ ] Send new messages and verify they're saved in v4 format (v5 → v4 conversion)
  - [ ] Load the saved messages again and verify they display correctly (v4 → v5 again)
  - [ ] Verify no data is lost in round-trip conversion

- [ ] **ACTION**: Verify no TypeScript errors: \`pnpm tsc --noEmit\`
- [ ] **ACTION**: Check for runtime errors in browser console
- [ ] **ACTION**: Verify performance (transformation should be fast)

**💡 Pro Tip:** The conversion functions are designed to be safe to call on already-converted messages (they'll pass through unchanged), so you can apply them universally without version checking.

**After completing Phase 5, your existing data now works with your v5 app. Proceed to Phase 6.**

---

## Phase 6: Remaining Manual Changes

**Instructions for AI Agent:**
- Work through remaining breaking changes
- Address EACH FIXME comment you found in Phase 3.2
- Check off items as you complete them
- Update this checklist file after completing each subsection

### 6.1 Reasoning Format Change
**Reasoning moved to parts array and field name changed.**

- [ ] **ACTION**: Update reasoning access:
  - ❌ Old: \`{ type: "reasoning", reasoning: "..." }\`
  - ✅ New: \`{ type: "reasoning", text: "..." }\`

- [ ] **ACTION**: Update UI components that display reasoning

### 6.2 Core API Parameter Changes (Manual Review Required)

- [ ] **ACTION**: Replace \`providerMetadata\` input with \`providerOptions\`:
  - ❌ Old: \`generateText({ providerMetadata: { openai: { store: false } } })\`
  - ✅ New: \`generateText({ providerOptions: { openai: { store: false } } })\`
  - **Note**: Result metadata is still called \`providerMetadata\`

- [ ] **ACTION**: Remove temperature default assumption:
  - In v4, temperature defaulted to 0
  - In v5, you must explicitly set \`temperature: 0\` if needed

### 6.3 Tool Execution Error Handling
**Tool errors now appear in result steps, not as exceptions.**

- [ ] **ACTION**: Remove \`ToolExecutionError\` try/catch blocks
- [ ] **ACTION**: Check for tool errors in result steps:

\`\`\`typescript
// ❌ v4 pattern
try {
  const result = await generateText({ ... });
} catch (error) {
  if (error instanceof ToolExecutionError) {
    console.log('Tool failed:', error.toolName);
  }
}

// ✅ v5 pattern
const { steps } = await generateText({ ... });
const toolErrors = steps.flatMap(step =>
  step.content.filter(part => part.type === 'tool-error')
);
toolErrors.forEach(error => {
  console.log('Tool error:', error.toolName, error.error);
});
\`\`\`

### 6.4 Dynamic Tools Support (New in v5)
**If using MCP tools or runtime-defined tools without schemas.**

- [ ] **INFO**: Are you using MCP tools or tools without compile-time schemas? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Import \`dynamicTool\` helper:
  \`\`\`typescript
  import { dynamicTool } from 'ai';
  \`\`\`

- [ ] **ACTION**: Use \`dynamicTool\` for tools with unknown types:
  \`\`\`typescript
  const runtimeTool = dynamicTool({
    description: 'A tool defined at runtime',
    inputSchema: z.object({}),
    execute: async (input) => {
      // Input and output typed as 'unknown'
      return { result: 'processed' };
    },
  });
  \`\`\`

- [ ] **ACTION**: Update tool call handlers to check \`dynamic\` flag:
  \`\`\`typescript
  onStepFinish: (step) => {
    for (const toolCall of step.toolCalls) {
      if (toolCall.dynamic) {
        // Dynamic tool: input/output are 'unknown'
        console.log('Dynamic:', toolCall.toolName);
        continue;
      }
      // Static tools have full type inference
      switch (toolCall.toolName) {
        case 'weather':
          console.log(toolCall.input.location); // typed!
      }
    }
  }
  \`\`\`

- [ ] **ACTION**: Handle \`dynamic-tool\` UI part type:
  \`\`\`typescript
  message.parts.map((part) => {
    if (part.type === 'dynamic-tool') {
      return <div>Dynamic: {part.toolName}</div>;
    }
  });
  \`\`\`

### 6.5 StreamData and Custom Data Streaming (MAJOR CHANGE)
**If you use StreamData, writeMessageAnnotation, or writeData.**

- [ ] **INFO**: Do you use \`StreamData\`, \`writeMessageAnnotation\`, or \`writeData\`? (Yes/No): ___

If Yes, this is a major architectural change:

- [ ] **ACTION**: Replace \`StreamData\` with \`createUIMessageStream\`:

\`\`\`typescript
// ❌ v4 pattern
import { StreamData } from 'ai';

const streamData = new StreamData();
streamData.append('custom-data');
streamData.close();

// ✅ v5 pattern
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';

const stream = createUIMessageStream({
  execute({ writer }) {
    writer.write({
      type: 'data-custom',
      id: 'custom-1',
      data: 'custom-data',
    });
  },
});

return createUIMessageStreamResponse({ stream });
\`\`\`

- [ ] **ACTION**: Replace \`writeMessageAnnotation\` with custom data parts:

\`\`\`typescript
// ❌ v4 pattern
import { createDataStreamResponse, streamText } from 'ai';

return createDataStreamResponse({
  execute: (dataStream) => {
    dataStream.writeMessageAnnotation({ status: 'processing' });
    const result = streamText({ ... });
    result.mergeIntoDataStream(dataStream);
  },
});

// ✅ v5 pattern
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';

const stream = createUIMessageStream({
  execute: ({ writer }) => {
    writer.write({
      type: 'data-status',
      id: generateId(),
      data: { status: 'processing' },
    });

    const result = streamText({ ... });
    writer.merge(result.toUIMessageStream());
  },
});

return createUIMessageStreamResponse({ stream });
\`\`\`

- [ ] **ACTION**: Replace \`writeData\` with transient data parts:
  - Data parts written with \`writer.write\` are transient (not saved to message history)
  - Use appropriate \`type\` field like \`'data-status'\`, \`'data-custom'\`, etc.

### 6.6 React Hooks (if using useChat/useCompletion)
**Search: "useChat" or "hooks"**

- [ ] **BREAKING**: Updated to use \`DefaultChatTransport\` wrapper:
  - ❌ Old: \`useChat({ api: '/api/chat', headers: {...} })\`
  - ✅ New: \`useChat({ transport: new DefaultChatTransport({ api: '/api/chat', headers: {...} }) })\`
- [ ] Removed input state management (now use \`useState\` manually)
- [ ] Updated \`initialMessages\` → \`messages\`
- [ ] Updated \`append\` → \`sendMessage\`
- [ ] Updated \`reload\` → \`regenerate\`
- [ ] Removed \`onResponse\` callback (no longer available)
- [ ] Removed \`keepLastMessageOnError\` option (no longer needed)
- [ ] Removed \`data\` and \`allowEmptySubmit\` from ChatRequestOptions
- [ ] Fixed dynamic body values (body is now static, captured once)
- [ ] Updated transport config: \`experimental_prepareRequestBody\` → \`prepareSendMessagesRequest\`
- [ ] Updated \`isLoading\` → \`status\` (for more granular control)
- [ ] Updated \`experimental_resume\` → \`resumeStream\`

### 6.7 File Attachments
**File attachments are now part of the parts array.**

**💡 Community Insight:** File/data parts have different property names between v4 and v5.

**v4 file/data structure:**
\`\`\`typescript
{
  type: "file",
  data: "base64...",      // or URL
  mimeType: "image/png"
}
\`\`\`

**v5 file/data structure:**
\`\`\`typescript
{
  type: "file",
  url: "base64...",       // data → url
  mediaType: "image/png"  // mimeType → mediaType
}
\`\`\`

- [ ] **ACTION**: Update file attachment handling:
  - ❌ Old: \`experimental_attachments: [{ name, contentType, url }]\`
  - ✅ New: \`parts: [{ type: "file", filename, mediaType, url }]\`

- [ ] **ACTION**: Update field names in file parts:
  - \`name\` → \`filename\`
  - \`contentType\` → \`mediaType\`
  - \`data\` → \`url\` (for stored v4 messages)

- [ ] **ACTION**: Ensure backward compatibility transformer handles file/data parts

### 6.8 Streaming Protocol Changes (Advanced)
**Detailed streaming architecture changes.**

- [ ] **ACTION**: Update stream chunk handling to new start/delta/end pattern:

**Text streaming:**
\`\`\`typescript
// ❌ v4 pattern
for await (const chunk of result.fullStream) {
  if (chunk.type === 'text-delta') {
    process.stdout.write(chunk.textDelta);
  }
}

// ✅ v5 pattern (with IDs for each content block)
for await (const chunk of result.fullStream) {
  switch (chunk.type) {
    case 'text-start':
      console.log(\`Starting text block: \${chunk.id}\`);
      break;
    case 'text-delta':
      process.stdout.write(chunk.delta); // Note: 'delta' not 'textDelta'
      break;
    case 'text-end':
      console.log(\`Completed text block: \${chunk.id}\`);
      break;
  }
}
\`\`\`

**Reasoning streaming:**
\`\`\`typescript
// ❌ v4 pattern
for await (const chunk of result.fullStream) {
  if (chunk.type === 'reasoning') {
    console.log('Reasoning:', chunk.text);
  }
}

// ✅ v5 pattern
for await (const chunk of result.fullStream) {
  switch (chunk.type) {
    case 'reasoning-start':
      console.log(\`Starting reasoning: \${chunk.id}\`);
      break;
    case 'reasoning-delta':
      process.stdout.write(chunk.delta);
      break;
    case 'reasoning-end':
      console.log(\`Completed reasoning: \${chunk.id}\`);
      break;
  }
}
\`\`\`

**Tool input streaming (NEW in v5):**
\`\`\`typescript
// ✅ v5 - can now stream tool inputs as they're generated
for await (const chunk of result.fullStream) {
  switch (chunk.type) {
    case 'tool-input-start':
      console.log(\`Tool \${chunk.toolName} input starting\`);
      break;
    case 'tool-input-delta':
      process.stdout.write(chunk.delta); // Streaming JSON input
      break;
    case 'tool-input-end':
      console.log('Tool input complete');
      break;
    case 'tool-call':
      console.log('Final tool call:', chunk.input);
      break;
  }
}
\`\`\`

- [ ] **ACTION**: Update finish event handling:
  - ❌ Old: \`'step-finish'\`
  - ✅ New: \`'finish-step'\`

- [ ] **ACTION**: Update onChunk callback to handle new chunk types:
\`\`\`typescript
const result = streamText({
  model: openai('gpt-4.1'),
  prompt: 'Write a story',
  onChunk({ chunk }) {
    switch (chunk.type) {
      case 'text-delta':
        console.log('Text:', chunk.text);
        break;
      case 'reasoning':
        console.log('Reasoning:', chunk.text);
        break;
      case 'tool-call':
        console.log('Tool:', chunk.toolName, chunk.input);
        break;
      case 'tool-input-start':
      case 'tool-input-delta':
        // Handle streaming tool inputs
        break;
    }
  },
});
\`\`\`

- [ ] **ACTION**: Update file stream part handling (flattened structure):
\`\`\`typescript
// ❌ v4
if (chunk.type === 'file') {
  console.log(chunk.file.mediaType, chunk.file.data);
}

// ✅ v5
if (chunk.type === 'file') {
  console.log(chunk.mediaType, chunk.data);
}
\`\`\`

- [ ] **ACTION**: Update source stream part handling (flattened structure):
\`\`\`typescript
// ❌ v4
if (part.type === 'source' && part.source.sourceType === 'url') {
  console.log(part.source.title, part.source.url);
}

// ✅ v5
if (part.type === 'source' && part.sourceType === 'url') {
  console.log(part.title, part.url);
}
\`\`\`

### 6.9 Streaming & Message Persistence
**Search: "streaming" or "toDataStreamResponse"**

- [ ] Updated \`toDataStreamResponse\` → \`toUIMessageStreamResponse\`
- [ ] Updated \`pipeDataStreamToResponse\` → \`pipeUIMessageStreamToResponse\`
- [ ] Updated stream protocol (\`textDelta\` → \`delta\`)
- [ ] Updated \`step-finish\` → \`finish-step\`
- [ ] Updated stream event handlers: \`reasoning\` → \`reasoningText\`
- [ ] **IMPORTANT**: Only check \`parts.length\` for persistence (not \`content.trim()\`):
  - ❌ Old: \`if (message.parts?.length && message.content.trim())\`
  - ✅ New: \`if (message.parts?.length)\`

### 6.10 Reasoning Changes
**Multiple reasoning-related changes across the API.**

- [ ] **ACTION**: Update step-level reasoning property:
  - ❌ Old: \`for (const step of steps) { console.log(step.reasoning); }\`
  - ✅ New: \`for (const step of steps) { console.log(step.reasoningText); }\`

- [ ] **ACTION**: Update generateText/streamText reasoning properties:
  - ❌ Old: \`result.reasoning\` (string), \`result.reasoningDetails\` (array)
  - ✅ New: \`result.reasoningText\` (string), \`result.reasoning\` (array)

### 6.11 Usage vs totalUsage
**Important distinction for multi-step generations.**

- [ ] **ACTION**: Understand the difference:
  - \`usage\`: Token usage from the **final step only**
  - \`totalUsage\`: Total token usage across **all steps**

- [ ] **ACTION**: Update code that accesses usage information:
\`\`\`typescript
// ✅ v5 pattern
const { usage, totalUsage, steps } = await generateText({ ... });

console.log('Final step usage:', usage);
console.log('Total usage:', totalUsage);

// For streaming, finish event has totalUsage
for await (const part of result.fullStream) {
  if (part.type === 'finish') {
    console.log('Total usage:', part.totalUsage); // Changed from 'usage'
  }
}
\`\`\`

### 6.12 Step Type and stepType Removal
**Step classification has changed.**

- [ ] **ACTION**: Remove reliance on \`stepType\` property:
\`\`\`typescript
// ❌ v4 pattern
steps.forEach(step => {
  switch (step.stepType) {
    case 'initial': ...
    case 'tool-result': ...
    case 'done': ...
  }
});

// ✅ v5 pattern - use step position and content
steps.forEach((step, index) => {
  if (index === 0) {
    console.log('Initial step');
  } else if (step.toolResults.length > 0) {
    console.log('Tool result step');
  } else {
    console.log('Final step');
  }
});
\`\`\`

### 6.13 Continuation Steps Removal
**experimental_continueSteps has been removed.**

- [ ] **ACTION**: Remove \`experimental_continueSteps\` option:
  - Use newer models with higher output token limits instead
  - This experimental feature is no longer supported

### 6.14 Media Type Standardization
**mimeType → mediaType everywhere.**

- [ ] **ACTION**: Replace \`mimeType\` with \`mediaType\` in model messages:
\`\`\`typescript
// ❌ v4
const result = await generateText({
  messages: [{
    role: 'user',
    content: [
      { type: 'image', image: data, mimeType: 'image/png' },
      { type: 'file', data: pdf, mimeType: 'application/pdf' },
    ],
  }],
});

// ✅ v5
const result = await generateText({
  messages: [{
    role: 'user',
    content: [
      { type: 'image', image: data, mediaType: 'image/png' },
      { type: 'file', data: pdf, mediaType: 'application/pdf' },
    ],
  }],
});
\`\`\`

### 6.15 Message ID Generation
**ID generation moved and renamed.**

- [ ] **ACTION**: Move \`experimental_generateMessageId\` from \`streamText\` to \`toUIMessageStreamResponse\`:
\`\`\`typescript
// ❌ v4
const result = streamText({
  model: openai('gpt-4o'),
  messages,
  experimental_generateMessageId: () => generateId(),
});

// ✅ v5
const result = streamText({
  model: openai('gpt-4o'),
  messages: convertToModelMessages(messages),
});

return result.toUIMessageStreamResponse({
  generateMessageId: () => generateId(), // No longer experimental, moved here
  onFinish: ({ messages, responseMessage }) => {
    saveChat({ chatId, messages });
  },
});
\`\`\`

### 6.16 LangChain Adapter (if using)
**Moved to separate package.**

- [ ] **INFO**: Are you using LangChain integration? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Install new package: \`pnpm add @ai-sdk/langchain\`
- [ ] **ACTION**: Update imports and usage:
\`\`\`typescript
// ❌ v4
import { LangChainAdapter } from 'ai';
const response = LangChainAdapter.toDataStreamResponse(stream);

// ✅ v5
import { toUIMessageStream } from '@ai-sdk/langchain';
import { createUIMessageStreamResponse } from 'ai';

const response = createUIMessageStreamResponse({
  stream: toUIMessageStream(stream),
});
\`\`\`

### 6.17 LlamaIndex Adapter (if using)
**Moved to separate package.**

- [ ] **INFO**: Are you using LlamaIndex integration? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Install new package: \`pnpm add @ai-sdk/llamaindex\`
- [ ] **ACTION**: Update imports and usage:
\`\`\`typescript
// ❌ v4
import { LlamaIndexAdapter } from 'ai';
const response = LlamaIndexAdapter.toDataStreamResponse(stream);

// ✅ v5
import { toUIMessageStream } from '@ai-sdk/llamaindex';
import { createUIMessageStreamResponse } from 'ai';

const response = createUIMessageStreamResponse({
  stream: toUIMessageStream(stream),
});
\`\`\`

### 6.18 Embedding Changes (if using embeddings)
**Provider options and response property rename.**

- [ ] **INFO**: Do you use embedding functions? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Move model-specific settings to \`providerOptions\`:
\`\`\`typescript
// ❌ v4
const { embedding } = await embed({
  model: openai('text-embedding-3-small', {
    dimensions: 10,
  }),
});

// ✅ v5
const { embedding } = await embed({
  model: openai('text-embedding-3-small'),
  providerOptions: {
    openai: { dimensions: 10 },
  },
});
\`\`\`

- [ ] **ACTION**: Replace \`rawResponse\` with \`response\`:
  - ❌ Old: \`const { rawResponse } = await embed(...)\`
  - ✅ New: \`const { response } = await embed(...)\`

- [ ] **ACTION**: Update \`embedMany\` for parallel requests:
  - v5 now makes parallel requests automatically
  - Use \`maxParallelCalls\` option to limit concurrency

### 6.19 Image Generation Changes (if generating images)
**Model settings moved to provider options.**

- [ ] **INFO**: Do you use image generation? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Move settings to \`providerOptions\`:
\`\`\`typescript
// ❌ v4
await generateImage({
  model: luma.image('photon-flash-1', {
    maxImagesPerCall: 5,
    pollIntervalMillis: 500,
  }),
  prompt,
  n: 10,
});

// ✅ v5
await generateImage({
  model: luma.image('photon-flash-1'),
  prompt,
  n: 10,
  maxImagesPerCall: 5,
  providerOptions: {
    luma: { pollIntervalMillis: 500 },
  },
});
\`\`\`

### 6.20 Message ID Handling
**Client messages might not have IDs.**

- [ ] **ACTION**: Ensure message IDs are generated:
\`\`\`typescript
return result.toUIMessageStreamResponse({
  originalMessages: messages,
  generateMessageId: generateId,
  onFinish: ({ messages }) => {
    saveChat({ id, messages });
  },
});
\`\`\`

### 6.21 Multi-Step Control (if using maxSteps)
**Search: "maxSteps" or "multi-step"**

- [ ] Replaced \`maxSteps\` with \`stopWhen\` (server-side only)
- [ ] If using \`maxSteps\` with \`useChat\`, use \`stopWhen\` with \`stepCountIs\` on server instead
- [ ] Imported \`stepCountIs\` or \`hasToolCall\` helpers
- [ ] Understood that \`stopWhen\` only evaluates with tool results

### 6.22 Provider-Specific Changes

#### OpenAI Provider Changes

- [ ] **ACTION**: Move \`structuredOutputs\` to \`providerOptions.openai.strictJsonSchema\`:
\`\`\`typescript
// ❌ v4
const result = await generateObject({
  model: openai('gpt-4.1-2024-08-06', { structuredOutputs: true }),
  schema: z.object({ name: z.string() }),
});

// ✅ v5 (disabled by default, now opt-in)
const result = await generateObject({
  model: openai('gpt-4.1-2024-08-06'),
  schema: z.object({ name: z.string() }),
  providerOptions: {
    openai: { strictJsonSchema: true },
  },
});
\`\`\`

- [ ] **ACTION**: Remove \`compatibility\` option (strict mode is now default):
  - ❌ Old: \`createOpenAI({ compatibility: 'strict' })\`
  - ✅ New: \`createOpenAI({})\` (strict is default)

- [ ] **ACTION**: Remove \`useLegacyFunctionCalls\` option (no longer supported)

- [ ] **ACTION**: Replace \`simulateStreaming\` with middleware:
\`\`\`typescript
// ❌ v4
const result = generateText({
  model: openai('gpt-4.1', { simulateStreaming: true }),
  prompt: 'Hello!',
});

// ✅ v5
import { simulateStreamingMiddleware, wrapLanguageModel } from 'ai';

const model = wrapLanguageModel({
  model: openai('gpt-4.1'),
  middleware: simulateStreamingMiddleware(),
});

const result = generateText({ model, prompt: 'Hello!' });
\`\`\`

#### Google Provider Changes

- [ ] **ACTION**: Replace \`useSearchGrounding\` with \`google.tools.googleSearch\`:
\`\`\`typescript
// ❌ v4
const { text } = await generateText({
  model: google('gemini-1.5-pro', { useSearchGrounding: true }),
  prompt: 'Latest SF news',
});

// ✅ v5 (now a provider-defined tool)
import { google } from '@ai-sdk/google';

const { text, sources } = await generateText({
  model: google('gemini-1.5-pro'),
  prompt: 'Latest SF news',
  tools: {
    google_search: google.tools.googleSearch({}),
  },
});
\`\`\`

#### Amazon Bedrock Changes

- [ ] **ACTION**: Update to camelCase options:
\`\`\`typescript
// ❌ v4 (snake_case)
const result = await generateText({
  model: bedrock('amazon.titan-tg1-large'),
  providerOptions: {
    bedrock: { reasoning_config: { ... } },
  },
});

// ✅ v5 (camelCase)
const result = await generateText({
  model: bedrock('amazon.titan-tg1-large'),
  providerOptions: {
    bedrock: { reasoningConfig: { ... } },
  },
});
\`\`\`

### 6.23 Vue.js Integration Changes (if using @ai-sdk/vue)
**Major restructuring from useChat to Chat class.**

- [ ] **INFO**: Are you using @ai-sdk/vue? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Replace \`useChat\` composable with \`Chat\` class:
\`\`\`typescript
// ❌ v4
<script setup>
import { useChat } from '@ai-sdk/vue';

const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
});
</script>

// ✅ v5
<script setup>
import { Chat } from '@ai-sdk/vue';
import { DefaultChatTransport } from 'ai';
import { ref } from 'vue';

const input = ref('');
const chat = new Chat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

const handleSubmit = (e: Event) => {
  e.preventDefault();
  chat.sendMessage({ text: input.value });
  input.value = '';
};
</script>
\`\`\`

- [ ] **ACTION**: Update message rendering to use parts:
\`\`\`typescript
// ❌ v4
<div v-for="message in messages">
  {{ message.content }}
</div>

// ✅ v5
<div v-for="message in chat.messages">
  <div v-for="part in message.parts">
    <span v-if="part.type === 'text'">{{ part.text }}</span>
  </div>
</div>
\`\`\`

### 6.24 Svelte Integration Changes (if using @ai-sdk/svelte)
**Constructor and property updates.**

- [ ] **INFO**: Are you using @ai-sdk/svelte? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Update constructor to use function syntax:
\`\`\`javascript
// ❌ v4
import { Chat } from '@ai-sdk/svelte';
const chatInstance = Chat({ api: '/api/chat' });

// ✅ v5
import { Chat } from '@ai-sdk/svelte';
import { DefaultChatTransport } from 'ai';

const chatInstance = Chat(() => ({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
}));
\`\`\`

- [ ] **ACTION**: Use setter methods instead of direct property mutation:
\`\`\`javascript
// ❌ v4 (direct mutation)
chatInstance.messages = [...chatInstance.messages, newMessage];

// ✅ v5 (use setters)
chatInstance.setMessages([...chatInstance.messages, newMessage]);
\`\`\`

- [ ] **ACTION**: Manage input state manually:
\`\`\`javascript
// ❌ v4 (managed internally)
const { messages, input, handleSubmit } = chatInstance;

// ✅ v5 (manual management)
let input = '';
const { messages, sendMessage } = chatInstance;

const handleSubmit = () => {
  sendMessage({ text: input });
  input = '';
};
\`\`\`

### 6.25 useCompletion Changes (if using)
**The data property has been removed.**

- [ ] **INFO**: Are you using \`useCompletion\`? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Remove references to \`data\` property:
\`\`\`typescript
// ❌ v4
const { completion, handleSubmit, data } = useCompletion();

// ✅ v5 (data property removed)
const { completion, handleSubmit } = useCompletion();
\`\`\`

### 6.26 useAssistant Removal (if using)
**The useAssistant hook has been completely removed.**

- [ ] **INFO**: Are you using \`useAssistant\`? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Migrate to \`useChat\` with appropriate configuration
- [ ] **ACTION**: Reference [example implementation](https://github.com/vercel-labs/ai-sdk-openai-assistants-api) for OpenAI Assistants API

### 6.27 ID Generation Utility Changes
**createIdGenerator now requires size parameter.**

- [ ] **ACTION**: Update \`createIdGenerator\` calls to include \`size\`:
\`\`\`typescript
// ❌ v4
const generator = createIdGenerator({ prefix: 'msg' });
const id = generator(16); // Size at call time

// ✅ v5
const generator = createIdGenerator({ prefix: 'msg', size: 16 });
const id = generator(); // Fixed size from creation
\`\`\`

- [ ] **ACTION**: Update type import:
  - ❌ Old: \`import { IDGenerator } from 'ai'\`
  - ✅ New: \`import { IdGenerator } from 'ai'\`

### 6.28 Provider Interface Changes (if building custom providers)
**For provider authors only.**

- [ ] **INFO**: Are you building a custom AI provider? (Yes/No): ___

If Yes:
- [ ] **ACTION**: Import \`LanguageModelV2\` from \`@ai-sdk/provider\`:
  - ❌ Old: \`import { LanguageModelV2 } from 'ai'\`
  - ✅ New: \`import { LanguageModelV2 } from '@ai-sdk/provider'\`

- [ ] **ACTION**: Import middleware from \`@ai-sdk/provider\`:
  - ❌ Old: \`import { LanguageModelV1Middleware } from 'ai'\`
  - ✅ New: \`import { LanguageModelV2Middleware } from '@ai-sdk/provider'\`

- [ ] **ACTION**: Update token usage properties:
\`\`\`typescript
// ❌ v4
{
  usage: {
    promptTokens: 10,
    completionTokens: 20
  }
}

// ✅ v5
{
  usage: {
    inputTokens: 10,
    outputTokens: 20,
    totalTokens: 30 // Now required
  }
}
\`\`\`

- [ ] **ACTION**: Replace \`rawResponse\` with \`response\`:
  - All provider response objects now use \`response\` instead of \`rawResponse\`

- [ ] **ACTION**: Update stream parts to new architecture:
  - Implement \`text-start\`, \`text-delta\`, \`text-end\` pattern
  - Implement \`reasoning-start\`, \`reasoning-delta\`, \`reasoning-end\` pattern
  - Implement \`tool-input-start\`, \`tool-input-delta\`, \`tool-input-end\` pattern
  - Each content block needs unique \`id\`

### 6.29 Error Handling: getErrorMessage → onError
**Error handling in streaming responses.**

- [ ] **ACTION**: Replace \`getErrorMessage\` with \`onError\`:
\`\`\`typescript
// ❌ v4
return result.toDataStreamResponse({
  getErrorMessage: (error) => ({
    errorCode: 'STREAM_ERROR',
    message: 'An error occurred',
  }),
});

// ✅ v5 (errors NOT sent to client by default)
return result.toUIMessageStreamResponse({
  onError: (error) => ({
    errorCode: 'STREAM_ERROR',
    message: 'An error occurred',
    // Only return what you want the client to see!
  }),
});
\`\`\`

**Important**: By default, error messages are NOT sent to the client in v5 to prevent leaking sensitive information.

---

### 6.30 Common Gotchas

**Watch out for these patterns that behave differently in v5:**

### Gotcha 1: Message Content is Read-Only in v5
\`\`\`typescript
// ❌ v4 - this worked
message.content = "New text";

// ✅ v5 - correct way
message.parts = [{ type: "text", text: "New text" }];
\`\`\`

- [ ] **ACTION**: Search for any \`message.content = \` assignments and fix them

### Gotcha 2: Empty Parts vs Empty Content
\`\`\`typescript
// ❌ Misleading - content is auto-generated, might be empty string
if (message.content) { ... }

// ✅ Correct check
if (message.parts.some(p => p.type === "text" && p.text)) { ... }
\`\`\`

- [ ] **ACTION**: Review all \`if (message.content)\` checks

### Gotcha 3: Tool State Names Changed
\`\`\`typescript
// ❌ v4 states
"partial-call" | "call" | "result"

// ✅ v5 states (complete list)
"input-streaming" | "input-available" | "output-available" | "output-error"
\`\`\`

- [ ] **ACTION**: Update all tool state checks (don't forget \`"input-streaming"\`!)

### Gotcha 4: Don't Check content.trim() for Streaming
\`\`\`typescript
// ❌ v4 pattern - checking both
if (streamingMessage.parts?.length && streamingMessage.content.trim()) {
  await persistMessage(streamingMessage);
}

// ✅ v5 pattern - only check parts
if (streamingMessage.parts?.length) {
  await persistMessage(streamingMessage);
}
\`\`\`

- [ ] **ACTION**: Remove \`content.trim()\` checks from persistence logic

---

## Phase 7: Final Testing

**Reminder:** Update this checklist file as you complete items below.

### 7.1 Build & Type Check
- [ ] \`pnpm tsc --noEmit\` passes with no errors
- [ ] \`pnpm build\` succeeds
- [ ] \`pnpm lint\` passes (if applicable)

### 7.2 Test with Historical Data (if applicable)
**If you have existing message data, verify backward compatibility:**

**💡 Community Insight:** Test all message types thoroughly - text, reasoning traces, tool calls with different states, data/file parts.

- [ ] **ACTION**: Load old conversations from database
- [ ] **ACTION**: Verify text messages display correctly
- [ ] **ACTION**: Verify reasoning traces from old messages render properly
- [ ] **ACTION**: Verify tool results from old messages render properly (all states)
- [ ] **ACTION**: Verify file/data parts from old messages display correctly
- [ ] **ACTION**: Test continuing old conversations with new messages
- [ ] **ACTION**: Verify v4 → v5 conversion is working for ALL message types

### 7.3 Test New Conversations
- [ ] **ACTION**: Create new conversations in v5
- [ ] **ACTION**: Test message sending/receiving
- [ ] **ACTION**: Test tool calling (if applicable)
- [ ] **ACTION**: Test streaming (if applicable)
- [ ] **ACTION**: Test file attachments (if applicable)

### 7.4 Fix Any Issues
- [ ] Addressed all TypeScript errors
- [ ] Fixed any runtime errors
- [ ] All FIXME comments from Phase 3 have been resolved
- [ ] No migration-related TODOs remain

---

## Phase 8: Permanent Database Schema Migration (Manual)

**🚨🚨🚨 STOP: AI AGENTS MUST NOT PERFORM THIS PHASE 🚨🚨🚨**

**⚠️ THIS PHASE REQUIRES MANUAL HUMAN EXECUTION ⚠️**

**AI Agent Instructions:**
- **DO NOT** create database migration scripts
- **DO NOT** execute any database commands (ALTER, DROP, RENAME, etc.)
- **DO NOT** run migration tools (Prisma migrate, Drizzle push, etc.)
- **DO NOT** attempt to automate any part of this phase
- **YOU MAY ONLY**: Answer questions, explain concepts, review code the human writes
- **IF ASKED TO MIGRATE DATABASE**: Politely decline and remind the user this must be done manually

**Why AI agents cannot do this:**
- Database migrations risk permanent data loss
- Mistakes can corrupt production databases
- Backups must be verified before proceeding
- Human judgment required for safety checks
- No "undo" button for dropped tables

**Human Developer: This is YOUR responsibility.**

**This phase REQUIRES MANUAL EXECUTION by you (the human developer).**

Database schema migrations are too critical and risky for AI automation. A mistake can result in permanent data loss, corrupted database state, or loss of user chat histories.

**What you get from completing this phase:**
- Native v5 messages in database
- Ability to remove conversion layer and \`ai-legacy\` dependency

**What the AI agent CAN do:**
- Answer questions about this phase
- Explain the migration steps
- Review your migration code

**What the AI agent WILL NOT do:**
- Execute database migrations
- Create migration scripts that modify your production database
- Run commands that alter, drop, or rename database tables

**To complete this phase yourself:**

1. **Read the complete guide**: Use the \`search-data-guide "Phase 2"\` tool or visit https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0-data
2. **Understand each step thoroughly** before executing
3. **Follow all safety requirements**:
   - Create a complete database backup (test restoration!)
   - Wrap all operations in transactions
   - Verify table existence after each step
   - Test on staging/dev database first
   - Keep migration scripts until verified in production

This phase removes the temporary runtime conversion layer after you've manually migrated your database to v5 schema.

### 8.1 Remove Runtime Conversion Layer
- [ ] **ACTION**: Search for conversion function files:
  \`\`\`bash
  find . -name "*convert*" -o -name "*conversion*" | grep -E "\.(ts|js)$"
  \`\`\`
- [ ] **ACTION**: Delete the conversion functions file (e.g., \`lib/convert-messages.ts\`, \`lib/conversion-functions.ts\`, or similar)
- [ ] **ACTION**: Search for imports of conversion functions:
  \`\`\`bash
  grep -r "convertV4MessageToV5\|convertV5MessageToV4" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"
  \`\`\`
- [ ] **ACTION**: Remove all imports and usage of \`convertV4MessageToV5\` from route handlers
- [ ] **ACTION**: Remove all imports and usage of \`convertV5MessageToV4\` from route handlers
- [ ] **ACTION**: Verify no code still references the conversion functions

### 8.2 Remove Legacy Dependencies
- [ ] **ACTION**: Remove \`ai-legacy\` package: \`pnpm remove ai-legacy\`
- [ ] **ACTION**: Check package.json to verify \`ai-legacy\` is no longer in dependencies
- [ ] **ACTION**: Run \`pnpm install\` to update lockfile
- [ ] **INFO**: \`ai-legacy\` successfully removed from project

### 8.3 Verify Cleanup
- [ ] **ACTION**: Run TypeScript type check: \`pnpm tsc --noEmit\`
- [ ] **ACTION**: Fix any type errors that appear
- [ ] **ACTION**: Run build: \`pnpm build\`
- [ ] **ACTION**: Fix any build errors
- [ ] **ACTION**: Test your application with real data
- [ ] **INFO**: Cleanup complete - application running on pure v5 schema without conversion layer

### 8.4 Commit Cleanup Changes
- [ ] **ACTION**: Commit changes: \`git add -A && git commit -m "Remove v4 conversion layer after schema migration"\`

**After completing Phase 8, your application is fully migrated with no runtime overhead. Proceed to Phase 9.**

---

## Phase 9: Documentation & Cleanup

- [ ] Updated code comments
- [ ] Removed deprecated code
- [ ] Updated README if needed
- [ ] Committed final changes: \`git commit -am "Complete AI SDK 5 migration"\`


---

## Need Help?

Use the MCP tools to search for specific information:

**For code migration questions:**
- \`search-guide "useChat"\` - Learn about useChat changes
- \`search-guide "maxSteps"\` - Learn about multi-step changes
- \`search-guide "message parts"\` - Learn about message structure
- \`search-guide "tools"\` - Learn about tool calling changes

**For data/database migration questions:**
- \`search-data-guide "Phase 1"\` - Runtime conversion setup
- \`search-data-guide "Phase 2"\` - Permanent schema migration
- \`search-data-guide "conversion functions"\` - Learn about message transformers
- \`search-data-guide "dual write"\` - Learn about migration strategies

---

## Resources

- [AI SDK 5.0 Migration Guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0)
- [AI SDK 5.0 Data Migration Guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0-data)
- [AI SDK Documentation](https://ai-sdk.dev)
- [Real-World Migration Case Study](https://blog.web3nomad.com/p/how-we-migrated-atypicaai-to-ai-sdk-v5-without-breaking-10m-chat-histories) (200 files, 3 days)
- [Handling Previously Saved Messages During Migration](https://jhakim.com/blog/ai-sdk-migration-handling-previously-saved-messages)

---

**Status:** In Progress
**Last Updated:** ${new Date().toISOString().split('T')[0]}
`;
}

