#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 Grabby Setup for Next.js...\n');

const isAppRouter = fs.existsSync(path.join(process.cwd(), 'app'));
const isPagesRouter = fs.existsSync(path.join(process.cwd(), 'pages'));

if (!isAppRouter && !isPagesRouter) {
    console.log('❌ Could not detect Next.js project structure.');
    console.log('   Please ensure you are in a Next.js project directory.\n');
    process.exit(1);
}

// 1. Create API route
if (isAppRouter) {
    const apiDir = path.join(process.cwd(), 'app', 'api', 'grabby-sync');
    const routeFile = path.join(apiDir, 'route.ts');

    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
    }

    if (!fs.existsSync(routeFile)) {
        fs.writeFileSync(routeFile, `import { createGrabbyAppHandler } from '@grabby/cli/adapters/next';

export const POST = createGrabbyAppHandler();
`);
        console.log('✅ Created app/api/grabby-sync/route.ts');
    } else {
        console.log('ℹ️  API route already exists');
    }
} else if (isPagesRouter) {
    const apiDir = path.join(process.cwd(), 'pages', 'api');
    const routeFile = path.join(apiDir, 'grabby-sync.ts');

    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
    }

    if (!fs.existsSync(routeFile)) {
        fs.writeFileSync(routeFile, `import { createGrabbyHandler } from '@grabby/cli/adapters/next';

export default createGrabbyHandler();
`);
        console.log('✅ Created pages/api/grabby-sync.ts');
    } else {
        console.log('ℹ️  API route already exists');
    }
}

// 2. Copy client script to public
const publicDir = path.join(process.cwd(), 'public');
const clientSource = path.join(__dirname, '..', 'client', 'grabby.js');
const clientDest = path.join(publicDir, 'grabby-client.js');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

if (fs.existsSync(clientSource)) {
    fs.copyFileSync(clientSource, clientDest);
    console.log('✅ Copied client script to public/grabby-client.js');
} else {
    console.log('⚠️  Could not find client script. Please copy manually from node_modules/@grabby/cli/client/grabby.js');
}

// 3. Instructions for adding script
console.log('\n📝 Next steps:');
if (isAppRouter) {
    console.log('   Add this to your root layout (app/layout.tsx):');
    console.log(`
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
    `);
} else {
    console.log('   Add this to your _document.tsx:');
    console.log(`
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
    `);
}

// 4. Create placeholder .grabbed_element
const grabbedFile = path.join(process.cwd(), '.grabbed_element');
if (!fs.existsSync(grabbedFile)) {
    fs.writeFileSync(grabbedFile, JSON.stringify({ note: "Ready to grab!" }, null, 2));
    console.log('✅ Created .grabbed_element');
}

console.log('\n🚀 Setup complete! Run your dev server and add "?grab=true" to the URL.');
console.log('   Example: http://localhost:3000?grab=true\n');
