# `@harnessio/ai-chat-core` — Agent Guide

Framework-agnostic AI chat runtime for the Harness AI chat feature. Provides a pure-TypeScript state machine for managing chat threads, streaming messages, plugins, and capabilities. React bindings are layered on top via `useSyncExternalStore`.

---

## Package Info

| Field | Value |
|-------|-------|
| Package name | `@harnessio/ai-chat-core` |
| Version | `0.0.16-system.1` |
| License | Apache-2.0 |
| React peer dep | `>=17.0.0 <19.0.0` |
| Entry point | `dist/index.js` |
| Build tool | Vite |

**Commands**

```bash
pnpm build          # Production build
pnpm build:watch    # Watch mode
pnpm playground     # Interactive playground (Vite dev server)
```

---

## Directory Structure

```
src/
├── index.ts                          # Root re-export (types, runtime, core, react, utils)
│
├── types/                            # Shared TypeScript interfaces — no runtime logic
│   ├── message.ts                    # Message, MessageContent, MessageRole, MessageStatus, content types
│   ├── thread.ts                     # ThreadState, ThreadListItemState, RuntimeCapabilities
│   ├── adapters.ts                   # StreamAdapter, ThreadListAdapter, StreamEvent, SystemEvent
│   ├── capability.ts                 # CapabilityExecution, CapabilityHandler, CapabilityRenderer, CapabilityConfig
│   ├── plugin.ts                     # ChatPlugin, MessageRenderer, GroupRenderer, AuxiliaryRendererProps
│   ├── context.ts                    # ChatContextItem, ChatContextValue, ChatContextMap
│   └── index.ts
│
├── core/                             # Framework-agnostic registries
│   ├── CapabilityRegistry.ts         # Stores capability handlers and renderers by name
│   ├── CapabilityExecutionManager.ts # Queues and runs capability executions
│   ├── PluginRegistry.ts             # Stores plugins and routes content types to renderers
│   └── index.ts
│
├── runtime/                          # Stateful runtime objects (extend BaseSubscribable)
│   ├── AssistantRuntime/
│   │   └── AssistantRuntime.tsx      # Top-level runtime — owns threads, plugins, capabilities, contentFocus
│   ├── ThreadListRuntime/
│   │   └── ThreadListRuntime.tsx     # Manages the list of threads; handles create/switch/delete/load
│   ├── ThreadRuntime/
│   │   ├── ThreadRuntime.ts          # Public facade over ThreadRuntimeCore
│   │   └── ThreadRuntimeCore.ts      # Core state machine: message list, streaming, abort
│   ├── ThreadListItemRuntime/
│   │   └── ThreadListItemRuntime.ts  # Per-thread metadata (title, status, rename, delete)
│   ├── ComposerRuntime/
│   │   └── ComposerRuntime.ts        # Composer state (text, submitting flag)
│   ├── ContentFocusRuntime/
│   │   └── ContentFocusRuntime.ts    # Focused content item for detail panels / aux views
│   └── index.ts
│
├── react/                            # React bindings (React 17 compatible)
│   ├── providers/
│   │   ├── AssistantRuntimeProvider.tsx  # Puts AssistantRuntime into React context
│   │   ├── ChatContextProvider.tsx       # Manages page-context chips sent to the backend
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useAssistantRuntime.ts        # Access the AssistantRuntime from context
│   │   ├── useMessages.ts                # Current thread's message list (useSyncExternalStore)
│   │   ├── useCurrentThread.ts           # The active ThreadRuntime
│   │   ├── useThreadList.ts              # Thread list actions + state
│   │   ├── useComposer.ts                # Composer text/submit state
│   │   ├── useCapability.ts              # Register a capability (handler + renderer) via useEffect
│   │   ├── useCapabilityExecution.ts     # Subscribe to a specific capability execution's status
│   │   ├── useContentFocus.ts            # Focus state + focus/blur/toggle/navigate actions
│   │   ├── useContentRenderer.ts         # Look up the plugin renderer for a content type
│   │   ├── usePageContext.ts             # Register/remove page context items
│   │   └── index.ts
│   ├── components/
│   │   ├── ContentRenderer.tsx           # Renders a single MessageContent item via plugin/capability
│   │   ├── CapabilityRenderer.tsx        # Renders a capability content item using its registered renderer
│   │   ├── AuxiliaryRenderer.tsx         # Renders the auxiliary (detail panel) view for focused content
│   │   └── index.ts
│   ├── utils/
│   │   ├── makeCapability.tsx            # Factory: turns a CapabilityConfig into a mount-only FC
│   │   └── index.ts
│   └── index.ts
│
└── utils/                            # Pure utilities
    ├── Subscribable.ts               # BaseSubscribable — pub/sub base class for all runtimes
    ├── BaseSSEStreamAdapter.ts       # Abstract SSE adapter; subclass to connect a real API
    ├── groupContentByParentId.ts     # Groups MessageContent[] by parentId for rendering
    ├── idGenerator.ts                # generateMessageId / generateThreadId
    └── index.ts

playground/                          # Local Vite dev playground (not published)
    src/
    ├── adapters/MockStreamAdapter.ts # Mock SSE stream for local testing
    ├── plugins/defaultPlugin.tsx     # Minimal plugin (text + assistant_thought renderers)
    └── providers/ChatRuntimeProvider.tsx
```

---

## Core Concepts

### 1. Message Model

Every chat exchange is a `Message`:

```typescript
interface Message {
  id: string
  parentId?: string          // optional threading
  role: 'user' | 'assistant'
  content: MessageContent[]  // one or more content items
  status: MessageStatus      // pending | running | complete | error | cancelled
  timestamp: number
  metadata?: MessageMetadata // conversationId, interactionId, etc.
}
```

A message carries an array of `MessageContent` items. Built-in types:

| `type` | Interface | Description |
|--------|-----------|-------------|
| `'text'` | `TextContent` | Plain text (streamed via `text-delta`) |
| `'assistant_thought'` | `AssistantThoughtContent` | LLM internal reasoning; `data` is `string[]` |
| `'error'` | `ErrorContent` | Error message |
| `'metadata'` | `MetadataContent` | `conversationId` / `interactionId` metadata block |
| `'artifact'` | `ArtifactContent` | Display metadata for a generated artifact |
| `'capability'` | `CapabilityContent` | A capability invocation (side-effect to execute) |
| `string` | `CustomContent` | Any other type; `data` is `Record<string, unknown>` |

Content items may have an optional `parentId` to group related items (e.g. all thinking blocks from the same tool call). Use `groupContentByParentId()` to produce rendering groups.

---

### 2. Stream Protocol

The runtime consumes an async iterable of `StreamChunk` objects yielded by a `StreamAdapter`:

```typescript
interface StreamAdapter {
  stream(request: StreamRequest): AsyncIterable<StreamChunk>
}
```

`StreamRequest` carries `messages`, optional `conversationId`, an `AbortSignal`, and an optional `systemEvent`.

Each `StreamChunk` wraps a `StreamEvent`. The runtime handles these event types natively:

| Event type | Effect on runtime |
|------------|-------------------|
| `part-start` | Opens a new content slot on the assistant message (text or assistant_thought) |
| `text-delta` | Appends `delta` to the current open content slot |
| `part-finish` | Marks the current content slot as `complete` |
| `metadata` | Sets `conversationId`, `interactionId`, `title` on the thread |
| `capability_execution` | Pushes a `capability` content item; triggers `CapabilityExecutionManager` |
| `error` | Appends an `error` content item |
| _any other type_ | Treated as a custom event; appended as `{ type, data, parentId }` content |

Custom events (e.g. `partial_yaml_created`, `final_yaml_created`) pass through to the message's content array and are rendered by plugin-registered renderers.

#### Implementing a StreamAdapter

Extend `BaseSSEStreamAdapter` for SSE-based APIs:

```typescript
import { BaseSSEStreamAdapter, SSEEvent, StreamChunk, StreamRequest } from '@harnessio/ai-chat-core'

const ALLOWED_EVENTS = ['part-start', 'text-delta', 'part-finish', 'metadata', 'capability_execution', 'error'] as const

class MyStreamAdapter extends BaseSSEStreamAdapter<typeof ALLOWED_EVENTS> {
  protected prepareRequest(params: StreamRequest) {
    return {
      url: '/api/chat/stream',
      options: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${myToken}` },
        body: JSON.stringify({ messages: params.messages, conversationId: params.conversationId })
      }
    }
  }

  protected getAllowedEvents() {
    return ALLOWED_EVENTS
  }

  protected convertEvent(event: SSEEvent): StreamChunk | null {
    // Map backend SSE event names to the StreamEvent shape the runtime expects
    return { event: event.data }
  }
}
```

For non-SSE APIs, implement `StreamAdapter` directly and yield `StreamChunk` objects.

---

### 3. Plugin System

A `ChatPlugin` registers React components that render specific content types:

```typescript
interface ChatPlugin {
  id: string
  name: string
  renderers: MessageRenderer[]          // one per content type (or with canHandle guard)
  groupRenderers?: GroupRenderer[]      // optional: render a whole parentId group together
  init?: (config: ChatPluginConfig) => void
}

interface MessageRenderer {
  type: string                          // content type this renderer handles
  component: React.ComponentType<MessageRendererProps>
  priority?: number                     // higher wins when multiple renderers match
  canHandle?: (message, content) => boolean
  capabilities?: {
    supportsFocus?: boolean             // whether this content type can be focused/expanded
    supportsPreview?: boolean
    supportsFullscreen?: boolean
  }
  auxiliary?: {
    detail?: React.ComponentType<AuxiliaryRendererProps>  // expanded detail panel component
  }
}
```

Plugins are registered at `AssistantRuntime` construction time or later via `runtime.registerPlugin(plugin)`.

`PluginRegistry` indexes renderers by `type` and sorts by `priority` (descending). Use `priority` to override the default renderer for a type. `canHandle` enables finer-grained matching when multiple plugins register for the same type.

---

### 4. Capability System

Capabilities are named side-effects the AI can invoke. They appear as `capability_execution` stream events and result in `CapabilityContent` items inside the message.

**Execution flow:**

```
Stream event: capability_execution { capabilityName, capabilityId, args, strategy }
    └─► ThreadRuntimeCore pushes CapabilityContent into the message
    └─► CapabilityExecutionManager.executeCapability(name, id, args, messageId, strategy)
            └─► CapabilityRegistry.getHandler(name) → CapabilityHandler.execute(args, context)
```

**Registering a capability (React):**

```typescript
// Option A: useCapability hook
function MyComponent() {
  useCapability({
    name: 'navigate',
    execute: async (args, context) => {
      // perform navigation
      router.push(args.url)
    },
    render: ({ args, status }) => <NavigateStatus args={args} status={status} />
  })
}

// Option B: makeCapability factory (renders null, just registers)
const NavigateCapability = makeCapability({
  name: 'navigate',
  execute: async (args) => { router.push(args.url) },
  render: ({ args, status }) => <NavigateStatus args={args} status={status} />
})

// Mount NavigateCapability somewhere in the tree:
<NavigateCapability />
```

**Execution strategies:**

| Strategy | Behaviour |
|----------|-----------|
| `'queue'` (default) | Runs one at a time in order of arrival |

The `CapabilityExecutionManager` exposes `getExecution(id)` and a subscriber API. Use `useCapabilityExecution(capabilityId)` in React to reactively read a specific execution's status.

**Capability statuses:** `queued → running → complete | error | cancelled`

---

### 5. System Events

A `SystemEvent` lets the frontend push an event back into the stream loop without a user message:

```typescript
interface SystemEvent {
  event_type: 'action_completed' | 'action_cancelled'
  capability_id: string
  result?: { success: boolean; [key: string]: unknown }
  target_page_id?: string
}
```

Call `thread.sendSystemEvent(systemEvent)` — this starts a new `startSystemEventRun` in `ThreadRuntimeCore`, sending the event payload alongside the existing message history.

When `isWaitingForUser` is true (the stream set status `waiting_for_user` on a capability event), calling `thread.send(text)` will automatically send an `action_cancelled` system event before the user's new message.

---

### 6. Chat Context

`ChatContextProvider` / `useChatContext` / `usePageContext` implement a lightweight context-chip system. Components anywhere in the tree can register context items (e.g. the current page, selected connector) that are displayed as chips in the composer and merged into the outgoing request metadata.

```typescript
// Register a context item (auto-removed on unmount)
usePageContext({
  id: 'currentPage',
  displayName: 'Connectors',
  data: { page_type: 'connectors', project_id: 'myProject' },
  priority: 10
})
```

`ChatContextProvider` must wrap the part of the tree that uses `usePageContext` or `useChatContext`. It is separate from `AssistantRuntimeProvider` and should be provided by the consumer application.

---

## Runtime Layer

All runtime classes extend `BaseSubscribable` (from `utils/Subscribable.ts`), which provides:
- `subscribe(callback): Unsubscribe` — register a listener
- `notifySubscribers()` — call all listeners (internal)

### `AssistantRuntime`

The single top-level object consumers instantiate. Owns:

| Property | Type | Description |
|----------|------|-------------|
| `threads` | `ThreadListRuntime` | Manages all threads |
| `thread` | `ThreadRuntime` | Shortcut to the current main thread |
| `pluginRegistry` | `PluginRegistry` | Plugin/renderer lookup |
| `capabilityRegistry` | `CapabilityRegistry` | Capability handler/renderer registration |
| `capabilityExecutionManager` | `CapabilityExecutionManager` | Runs capability handlers |
| `contentFocus` | `ContentFocusRuntime` | Focused content state |

Also performs **auto-focus**: when a complete assistant message arrives, if `contentFocus` is inactive it scans the last assistant message for content that has `supportsFocus: true` and auto-focuses it.

**Constructing:**

```typescript
const runtime = new AssistantRuntime({
  streamAdapter: new MyStreamAdapter(),
  threadListAdapter: new MyThreadListAdapter(), // optional
  plugins: [myPlugin]
})
```

### `ThreadListRuntime`

Manages the `Map` of `ThreadRuntime` instances. Key methods:

| Method | Description |
|--------|-------------|
| `getMainThread()` | Returns the active (main) thread |
| `getState()` | Returns `ThreadListState` snapshot |
| `switchToThread(id)` | Makes a thread active; loads messages via adapter if available |
| `switchToNewThread()` | Creates and switches to a blank thread |
| `loadThreads(options?)` | Fetches thread list from `threadListAdapter` |

Exposes `isLoading` for list-fetch status.

### `ThreadRuntime`

Public API wrapping `ThreadRuntimeCore`:

| Method | Description |
|--------|-------------|
| `send(text)` | Appends user message and starts a streaming run |
| `sendSystemEvent(event)` | Starts a system event run (no user message appended) |
| `append(message)` | Appends a message directly (no streaming) |
| `cancelRun()` | Aborts the current stream via `AbortController` |
| `clear()` | Empties all messages |
| `reset(messages?)` | Replaces messages with a provided list |
| `setConversationId(id)` | Updates the tracked conversation ID |
| `setTitle(title)` | Updates the thread title |

Exposes reactive state: `messages`, `isRunning`, `isDisabled`, `isWaitingForUser`, `pendingCapability`, `conversationId`, `title`.

### `ThreadRuntimeCore`

The core state machine. Manages:
- `_messages: Message[]` — the full message history
- `_isRunning` — whether a stream is active
- `_isWaitingForUser` — set when a `capability_execution` event has status `waiting_for_user`
- `_pendingCapability` — the capability waiting for user confirmation
- `_currentPart` — tracks the streaming content slot being accumulated
- `_abortController` — cancels the in-flight request

`handleStreamEvent()` is the dispatch method that processes each `StreamEvent` and mutates message content in place.

### `ComposerRuntime`

Holds composer state: current text value and `isSubmitting` flag. Exposed via `thread.composer`.

### `ContentFocusRuntime`

Tracks which `MessageContent` item is "focused" (e.g. expanded in a detail panel). Methods:

| Method | Description |
|--------|-------------|
| `focus(content, message, index, context)` | Activate focus on a content item |
| `blur()` | Deactivate focus |
| `toggle(...)` | Focus or blur if already focused |
| `switchContext(context)` | Change the focus context (e.g. `'detail'`) |
| `focusNext(messages)` | Move focus to the next content item across messages |
| `focusPrevious(messages)` | Move focus to the previous content item |

---

## React Layer

### Providers

| Component | Purpose |
|-----------|---------|
| `AssistantRuntimeProvider` | Puts an `AssistantRuntime` into React context. Required for all hooks. |
| `ChatContextProvider` | Manages page context items. Required for `usePageContext` / `useChatContext`. |

Minimal setup:

```tsx
const runtime = useMemo(() => new AssistantRuntime({
  streamAdapter: new MyStreamAdapter()
}), [])

return (
  <AssistantRuntimeProvider runtime={runtime}>
    <ChatContextProvider>
      <MyChatUI />
    </ChatContextProvider>
  </AssistantRuntimeProvider>
)
```

### Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `useAssistantRuntime()` | `AssistantRuntime` | Raw runtime access |
| `useMessages()` | `readonly Message[]` | Current thread's messages; re-renders on change |
| `useCurrentThread()` | `ThreadRuntime` | Active thread; re-renders on change |
| `useThreadList()` | Actions object | `switchToThread`, `switchToNewThread`, `loadThreads`, `renameThread`, `deleteThread` |
| `useThreadListState()` | `ThreadListState` | Reactive thread list state snapshot |
| `useComposer()` | Composer state + actions | `text`, `isSubmitting`, `setText`, `clear` |
| `useCapability(config)` | `void` | Registers a capability handler/renderer while mounted |
| `useCapabilityExecution(id)` | `CapabilityExecution \| undefined` | Reactive execution status for a specific capability ID |
| `useContentFocus()` | Focus state + actions | `isActive`, `focusedContent`, `focus`, `blur`, `toggle`, `focusNext`, `focusPrevious` |
| `useContentFocusState()` | `ContentFocusState` | Read-only focus state |
| `useContentRenderer(type)` | `{ component }` | Looks up the plugin renderer component for a content type |
| `usePageContext(item)` | `void` | Registers a context chip; removes it on unmount |

### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `ContentRenderer` | `{ message, content }` | Dispatches to the correct plugin renderer or `CapabilityRendererComp` |
| `CapabilityRendererComp` | `{ message, content }` | Renders a `capability` content item using the registered capability renderer |
| `AuxiliaryRenderer` | `AuxiliaryRendererProps` | Renders the auxiliary/detail view for the focused content item |

### `makeCapability`

Creates a mount-only React component that calls `useCapability` with the provided config:

```typescript
const NavigateCapability = makeCapability({
  name: 'navigate',
  execute: async (args) => { /* ... */ },
  render: NavigateRenderer
})
// Place <NavigateCapability /> in the component tree
```

---

## Utilities

### `BaseSSEStreamAdapter`

Abstract base for SSE-based APIs. Subclass it and implement:
- `prepareRequest(params)` → `{ url, options }` — builds the fetch call
- `convertEvent(event)` → `StreamChunk | null` — maps your backend's event shape to the runtime's `StreamEvent`
- `getAllowedEvents()` (optional) → allowlist of event type strings to process

Handles SSE framing, ping lines, `data: eof` termination, and `AbortSignal` propagation automatically.

### `BaseSubscribable`

Simple pub/sub base. All runtime objects extend this:
- `subscribe(callback): Unsubscribe`
- `protected notifySubscribers()`

### `groupContentByParentId(content)`

Groups a `MessageContent[]` by `parentId`. Items without a `parentId` each get their own group. Returns `ContentGroup[]`, each with:
- `groupKey` — the shared `parentId` (or `undefined` for ungrouped)
- `items` — the content items in this group
- `groupType` — `'single-type' | 'tool-calls' | 'reasoning' | 'mixed'`
- `primaryType` — most frequent content type in the group

Use this in your rendering layer to collapse related tool calls or thoughts visually.

### `idGenerator`

`generateMessageId()` and `generateThreadId()` — returns time-based IDs with a counter suffix.

---

## ThreadListAdapter (optional)

Provide a `ThreadListAdapter` to enable persistent multi-thread support:

```typescript
interface ThreadListAdapter {
  listThreads(): Promise<ThreadListItemState[]>
  loadThreads(options?: ThreadListLoadOptions): Promise<ThreadListItemState[]>
  loadThread(threadId: string): Promise<Message[]>
  createThread(initialMessage?: string): Promise<ThreadListItemState>
  deleteThread(threadId: string): Promise<void>
  updateThread(threadId: string, updates: Partial<ThreadListItemState>): Promise<void>
}
```

Without an adapter, threads are in-memory only (no persistence, no thread list fetching).

`ThreadListLoadOptions` supports `query`, `offset`, `limit`, and `replace` (clears existing threads before adding results).

---

## Data Flow Summary

```
User types and submits
    │
    ▼
thread.send(text)
    │  appends user Message to _messages
    │  creates empty assistant Message { status: 'running' }
    │
    ▼
streamAdapter.stream({ messages, conversationId, signal })
    │
    ▼  (for each StreamChunk)
ThreadRuntimeCore.handleStreamEvent()
    ├── part-start         → add content slot, set status 'streaming'
    ├── text-delta         → concatenate into current slot
    ├── part-finish        → mark slot 'complete', clear _currentPart
    ├── metadata           → set conversationId / title on thread
    ├── capability_execution → push CapabilityContent + trigger CapabilityExecutionManager
    ├── error              → push error content
    └── custom type        → push { type, data, parentId } content
    │
    ▼
notifySubscribers() → React useSyncExternalStore re-renders
    │
    ▼
ContentRenderer maps each MessageContent to a plugin renderer component
```

---

## Playground

The `playground/` directory contains a local Vite app for iterating on the runtime without a real backend.

```bash
pnpm playground
```

Key files:
- `MockStreamAdapter` — emits a realistic sequence of SSE events including `assistant_thought`, `partial_yaml_created`, `final_yaml_created`, `capability_execution`, `text-delta`, and `part-finish`.
- `defaultPlugin` — minimal plugin with `text` and `assistant_thought` renderers.
- `ChatRuntimeProvider` — wraps `AssistantRuntime` + `AssistantRuntimeProvider` with the mock adapter.

Use the playground to test new stream event types, plugin renderers, or capability integrations before wiring up to a live backend.

---

## Important Constraints

- **React 17 compatible** — do not use React 18-only APIs (e.g. `use`, concurrent features). Use `use-sync-external-store/shim` for external store subscriptions.
- **No framework dependency in `core/` and `runtime/`** — these are pure TypeScript and must not import React.
- **Single export entrypoint** — everything is re-exported from `src/index.ts`. Do not add new top-level export paths without updating `package.json` exports.
- **ESM only** — the package is `"type": "module"` with no CJS build.
