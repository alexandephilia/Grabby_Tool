# Next.js Integration Example

## Installation

```bash
npm install @grabby/inspector
npm run setup:next
```

## Manual Setup

### App Router (Next.js 13+)

#### 1. Create API Route: `app/api/grabby-sync/route.ts`

```typescript
import { createGrabbyAppHandler } from '@grabby/inspector/adapters/next';

export const POST = createGrabbyAppHandler();
```

#### 2. Add Script to Layout: `app/layout.tsx`

```tsx
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script src="/grabby-client.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router (Next.js 12 and below)

#### 1. Create API Route: `pages/api/grabby-sync.ts`

```typescript
import { createGrabbyHandler } from '@grabby/inspector/adapters/next';

export default createGrabbyHandler();
```

#### 2. Add Script to Document: `pages/_document.tsx`

```tsx
import { Html, Head, Main, NextScript } from 'next/document';
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

## Usage

1. Start your dev server: `npm run dev`
2. Open your app with the grab parameter: `http://localhost:3000?grab=true`
3. Hold `Cmd` (Mac) or `Ctrl` (Windows) to activate the inspector
4. Click on any element to grab its data
5. Check `.grabbed_element` file for the captured data

## Tips

- The setup script automatically copies the client script to your `public` folder
- The API route handles syncing element data to `.grabbed_element`
- Works with both App Router and Pages Router
- Compatible with Next.js 12, 13, 14, and 15
