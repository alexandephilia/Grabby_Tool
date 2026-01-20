# Vite Integration Example

## Installation

```bash
npm install @grabby/inspector
npm run setup:vite
```

## Manual Setup

### 1. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { grabbySyncPlugin } from '@grabby/inspector/adapters/vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['.grabbed_element'],
    },
  },
  plugins: [
    react(),
    grabbySyncPlugin(),
  ],
});
```

### 2. index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
    <script src="./node_modules/@grabby/inspector/client/grabby.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Usage

1. Start your dev server: `npm run dev`
2. Open your app with the grab parameter: `http://localhost:5173?grab=true`
3. Hold `Cmd` (Mac) or `Ctrl` (Windows) to activate the inspector
4. Click on any element to grab its data
5. Check `.grabbed_element` file for the captured data

## Tips

- Use arrow keys to navigate the DOM tree while holding Cmd/Ctrl
- Scroll to cycle through overlapping elements
- Press `Esc` to reset to cursor position
- The HUD only activates when `?grab=true` is in the URL
