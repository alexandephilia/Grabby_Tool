# Grabby Inspector - Complete Usage Guide

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Framework Integration](#framework-integration)
4. [Controls & Navigation](#controls--navigation)
5. [Output Format](#output-format)
6. [AI Integration](#ai-integration)
7. [Troubleshooting](#troubleshooting)

---

## Installation

### NPM
```bash
npm install @grabby/inspector
```

### Yarn
```bash
yarn add @grabby/inspector
```

### PNPM
```bash
pnpm add @grabby/inspector
```

---

## Quick Start

### Vite Projects

```bash
npm install @grabby/inspector
npm run setup:vite
npm run dev
```

Then open: `http://localhost:5173?grab=true`

### Next.js Projects

```bash
npm install @grabby/inspector
npm run setup:next
npm run dev
```

Then open: `http://localhost:3000?grab=true`

---

## Framework Integration

### Vite

The Vite adapter uses a middleware plugin to handle element syncing.

**vite.config.ts:**
```typescript
import { grabbySyncPlugin } from '@grabby/inspector/adapters/vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['.grabbed_element'], // Prevent reload on sync
    },
  },
  plugins: [grabbySyncPlugin()],
});
```

**index.html:**
```html
<script src="./node_modules/@grabby/inspector/client/grabby.js"></script>
```

### Next.js (App Router)

**app/api/grabby-sync/route.ts:**
```typescript
import { createGrabbyAppHandler } from '@grabby/inspector/adapters/next';

export const POST = createGrabbyAppHandler();
```

**app/layout.tsx:**
```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script src="/grabby-client.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Next.js (Pages Router)

**pages/api/grabby-sync.ts:**
```typescript
import { createGrabbyHandler } from '@grabby/inspector/adapters/next';

export default createGrabbyHandler();
```

**pages/_document.tsx:**
```tsx
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
        <Script src="/grabby-client.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

## Controls & Navigation

### Activation

The inspector only activates when:
1. The URL contains `?grab=true`
2. You hold `Cmd` (Mac) or `Ctrl` (Windows)

### Keyboard Controls

| Key | Action |
|-----|--------|
| `Cmd/Ctrl` + Hover | Activate inspector HUD |
| `Cmd/Ctrl` + Click | Grab element data |
| `↑` | Navigate to parent element |
| `↓` | Navigate to first child |
| `←` | Navigate to previous sibling |
| `→` | Navigate to next sibling |
| `Scroll` | Cycle through element stack |
| `Esc` | Reset to cursor position |

### Visual Feedback

- **Crosshairs**: Precision cursor tracking
- **Highlight**: Blue border around target element
- **Blur Overlay**: Spotlight effect on selected element
- **Tooltip**: Shows element tag and class
- **Breadcrumb**: Shows DOM path (bottom-left)
- **Info Panel**: Shows dimensions and controls (bottom-right)
- **Green Flash**: Confirms successful sync

---

## Output Format

Grabbed elements are saved to `.grabbed_element` at your project root:

```json
{
  "tagName": "BUTTON",
  "id": "submit-btn",
  "className": "btn btn-primary",
  "selector": "main > section.hero > div.actions > button.btn-primary",
  "innerText": "Get Started",
  "innerHTML": "<span>Get Started</span>",
  "childCount": 1,
  "attributes": {
    "type": "button",
    "aria-label": "Submit form"
  },
  "styles": {
    "color": "rgb(255, 255, 255)",
    "backgroundColor": "rgb(59, 130, 246)",
    "fontSize": "16px",
    "padding": "12px 24px",
    "margin": "0px",
    "display": "inline-flex",
    "position": "relative",
    "width": "auto",
    "height": "48px"
  },
  "rect": {
    "x": 100,
    "y": 200,
    "width": 120,
    "height": 48
  },
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

---

## AI Integration

### Setup

Tell your AI assistant:

> "I have Grabby Inspector active. Before suggesting UI changes, read `.grabbed_element` to see the element I selected. Use the selector path, computed styles, and dimensions to provide accurate recommendations."

### Example Workflow

1. **Grab an element** you want to modify
2. **Ask your AI**: "Make this button larger and change the color to green"
3. **AI reads** `.grabbed_element` and sees:
   - Selector: `main > section.hero > button.btn-primary`
   - Current styles: `backgroundColor: "rgb(59, 130, 246)"`
   - Current dimensions: `width: 120, height: 48`
4. **AI provides** precise CSS changes or component modifications

### Benefits

- **Precision**: AI knows exactly which element you're referring to
- **Context**: AI sees current styles, dimensions, and DOM position
- **Efficiency**: No need to describe elements manually
- **Accuracy**: Reduces misunderstandings and wrong suggestions

---

## Troubleshooting

### Inspector Not Activating

**Problem**: HUD doesn't appear when holding Cmd/Ctrl

**Solutions**:
- Ensure URL contains `?grab=true`
- Check browser console for errors
- Verify script is loaded (check Network tab)
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### Element Not Syncing

**Problem**: Click doesn't save to `.grabbed_element`

**Solutions**:
- Check API route is set up correctly
- Verify server is running
- Check browser console for fetch errors
- Ensure `.grabbed_element` file exists and is writable

### Vite Hot Reload Issues

**Problem**: Page reloads every time you grab an element

**Solutions**:
- Add `.grabbed_element` to watch ignore in `vite.config.ts`:
  ```typescript
  server: {
    watch: {
      ignored: ['.grabbed_element'],
    },
  }
  ```

### Next.js API Route Not Found

**Problem**: 404 error when clicking elements

**Solutions**:
- Verify API route exists at correct path:
  - App Router: `app/api/grabby-sync/route.ts`
  - Pages Router: `pages/api/grabby-sync.ts`
- Restart Next.js dev server
- Check route exports `POST` handler

### Script Not Loading

**Problem**: Script tag doesn't load the client

**Solutions**:
- For Vite: Use relative path `./node_modules/@grabby/inspector/client/grabby.js`
- For Next.js: Copy script to `public/` folder and use `/grabby-client.js`
- Check file exists at specified path
- Verify no CSP (Content Security Policy) blocking scripts

---

## Advanced Usage

### Custom Endpoint

You can customize the sync endpoint by modifying the client script:

```javascript
// In grabby.js, change:
const endpoint = window.__NEXT_DATA__ ? '/api/grabby-sync' : '/__grabby_sync';

// To your custom endpoint:
const endpoint = '/api/my-custom-grabby-endpoint';
```

### Conditional Loading

Only load Grabby in development:

```tsx
// Next.js example
{process.env.NODE_ENV === 'development' && (
  <Script src="/grabby-client.js" />
)}
```

```typescript
// Vite example
export default defineConfig({
  plugins: [
    process.env.NODE_ENV === 'development' && grabbySyncPlugin(),
  ].filter(Boolean),
});
```

### Multiple Projects

You can use Grabby across multiple projects simultaneously. Each project will have its own `.grabbed_element` file.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/grabby-inspector/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/grabby-inspector/discussions)
- **Documentation**: [Full Docs](https://grabby-inspector.dev)

---

Built with 🖤 for AI-assisted development
