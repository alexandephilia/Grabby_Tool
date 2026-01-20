# Grabby Inspector - Architecture

## Overview

Grabby Inspector is a framework-agnostic element inspection tool designed for AI-assisted development. It consists of three main components:

1. **Client HUD** - Browser-side inspector interface
2. **Framework Adapters** - Server-side sync handlers
3. **Setup Scripts** - Automated installation tools

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Client HUD (grabby.js)                  │  │
│  │                                                      │  │
│  │  • Element Selection                                │  │
│  │  • DOM Navigation                                   │  │
│  │  • Visual Feedback                                  │  │
│  │  • Data Extraction                                  │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│                     │ POST /api/grabby-sync                │
│                     │ { tagName, selector, styles, ... }   │
└─────────────────────┼───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Framework Adapter                          │  │
│  │                                                      │  │
│  │  Vite:     Middleware Plugin                        │  │
│  │  Next.js:  API Route Handler                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│                     │ fs.writeFileSync()                   │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           .grabbed_element                           │  │
│  │                                                      │  │
│  │  JSON file with element data                        │  │
│  └──────────────────┬───────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────┘
                      │
                      │ Read file
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI ASSISTANT                             │
│                                                             │
│  • Reads .grabbed_element                                  │
│  • Understands element context                             │
│  • Provides precise recommendations                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Client HUD (grabby.js)

**Purpose**: Browser-side element inspector

**Key Features**:
- Activates only when `?grab=true` is in URL
- Singleton pattern prevents multiple instances
- Event-driven architecture with AbortController
- Zero dependencies (vanilla JavaScript)

**Event Flow**:
```
User holds Cmd/Ctrl
    ↓
mousemove → Update element stack → Highlight element
    ↓
User clicks
    ↓
Extract element data → POST to server → Visual confirmation
```

**DOM Manipulation**:
- Creates overlay elements with high z-index (2147483640+)
- Uses `backdrop-filter` for blur effect
- Implements `clip-path` for spotlight effect
- Positions tooltip with viewport awareness

### 2. Framework Adapters

#### Vite Adapter (adapters/vite.ts)

**Type**: Vite Plugin

**Implementation**:
```typescript
export const grabbySyncPlugin = (): Plugin => ({
  name: 'grabby-sync-plugin',
  configureServer(server) {
    // Middleware intercepts POST /__grabby_sync
    // Writes to .grabbed_element
  },
});
```

**Integration Point**: Vite's `configureServer` hook

**Endpoint**: `/__grabby_sync`

#### Next.js Adapter (adapters/next.ts)

**Type**: API Route Handler

**Implementation**:
```typescript
// Pages Router
export function createGrabbyHandler() {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Handle POST request
    // Write to .grabbed_element
  };
}

// App Router
export function createGrabbyAppHandler() {
  return async (req: NextRequest) => {
    // Handle POST request
    // Write to .grabbed_element
  };
}
```

**Integration Point**: Next.js API routes

**Endpoint**: `/api/grabby-sync`

### 3. Setup Scripts

**Purpose**: Automated installation and configuration

**Vite Setup (scripts/setup-vite.js)**:
1. Reads `vite.config.ts`
2. Injects import statement
3. Adds plugin to plugins array
4. Adds watch ignore for `.grabbed_element`
5. Updates `index.html` with script tag
6. Creates `.grabbed_element` placeholder

**Next.js Setup (scripts/setup-next.js)**:
1. Detects App Router vs Pages Router
2. Creates appropriate API route file
3. Copies client script to `public/`
4. Provides instructions for layout/document update
5. Creates `.grabbed_element` placeholder

---

## Data Flow

### Element Capture Flow

```
1. User Action
   └─> Hold Cmd/Ctrl + Hover
       └─> Client: getElementsAtPoint(x, y)
           └─> Build element stack
               └─> Update visual feedback

2. Element Selection
   └─> Hold Cmd/Ctrl + Click
       └─> Client: Extract element data
           ├─> Selector path
           ├─> Computed styles
           ├─> Dimensions
           ├─> Attributes
           └─> Inner content

3. Data Sync
   └─> Client: POST to endpoint
       └─> Server: Receive JSON
           └─> Validate payload
               └─> Write to .grabbed_element
                   └─> Return success

4. AI Integration
   └─> AI: Read .grabbed_element
       └─> Parse element data
           └─> Generate recommendations
```

### Navigation Flow

```
Arrow Key Press
    ↓
Determine direction (↑ ↓ ← →)
    ↓
Find target element
    ├─> ↑: parentElement
    ├─> ↓: firstChild
    ├─> ←: previousSibling
    └─> →: nextSibling
    ↓
Update activeEl
    ↓
Rebuild element stack
    ↓
Update visual feedback
```

---

## Design Decisions

### Why Vanilla JavaScript for Client?

- **Zero Dependencies**: No build step required
- **Universal Compatibility**: Works in any browser
- **Minimal Bundle Size**: ~15KB unminified
- **Direct DOM Access**: Maximum performance

### Why Separate Adapters?

- **Framework Agnostic**: Core logic independent of framework
- **Easy Maintenance**: Update one adapter without affecting others
- **Extensibility**: Easy to add new framework support
- **Type Safety**: Each adapter uses framework-specific types

### Why File-Based Sync?

- **Simplicity**: No database or state management needed
- **AI-Friendly**: Easy for AI to read and parse
- **Version Control**: Can be tracked in git (if desired)
- **Debugging**: Human-readable JSON format

### Why Query Parameter Activation?

- **Production Safety**: Won't activate in production URLs
- **Explicit Intent**: User must opt-in
- **No Performance Impact**: Zero overhead when not active
- **Easy Toggle**: Just add/remove `?grab=true`

---

## Extension Points

### Adding New Framework Support

1. Create adapter in `adapters/[framework].ts`
2. Implement sync handler that writes to `.grabbed_element`
3. Create setup script in `scripts/setup-[framework].js`
4. Update `package.json` with new script
5. Add example in `examples/[framework]-example.md`

### Customizing Client Behavior

The client script can be modified to:
- Change keyboard shortcuts
- Customize visual styling
- Add additional data extraction
- Modify sync endpoint
- Add custom event handlers

### Extending Data Format

The `.grabbed_element` format can be extended with:
- Accessibility data (ARIA attributes)
- Performance metrics (render time)
- Event listeners attached
- React/Vue component info
- Custom metadata

---

## Performance Considerations

### Client Performance

- **Event Throttling**: Uses passive listeners where possible
- **DOM Queries**: Cached element references
- **Visual Updates**: CSS transforms for smooth animations
- **Memory Management**: AbortController cleans up listeners

### Server Performance

- **Minimal Processing**: Simple JSON parse and file write
- **No Database**: Direct file system access
- **Async Operations**: Non-blocking I/O
- **Watch Ignore**: Prevents dev server reload loops

---

## Security Considerations

### Client Security

- **No Eval**: No dynamic code execution
- **Sanitized Output**: HTML entities escaped in tooltips
- **Isolated Scope**: IIFE prevents global pollution
- **Singleton Pattern**: Prevents multiple instances

### Server Security

- **Payload Validation**: Checks for required fields
- **File Path Resolution**: Uses `path.resolve()` to prevent traversal
- **Error Handling**: Catches and logs errors safely
- **Development Only**: Should not be used in production

---

## Future Enhancements

### Planned Features

- [ ] TypeScript types for grabbed element data
- [ ] Browser extension version
- [ ] Real-time sync with WebSocket
- [ ] Multi-element selection
- [ ] Element comparison mode
- [ ] Screenshot capture
- [ ] Video recording of interactions
- [ ] Integration with design tools (Figma, Sketch)

### Framework Support Roadmap

- [x] Vite
- [x] Next.js (App Router)
- [x] Next.js (Pages Router)
- [ ] Remix
- [ ] SvelteKit
- [ ] Nuxt
- [ ] Astro
- [ ] Solid Start

---

Built with 🖤 for AI-assisted development
