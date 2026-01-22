#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VITE_CONFIG = path.join(process.cwd(), 'vite.config.ts');
const INDEX_HTML = path.join(process.cwd(), 'index.html');

console.log('🎯 Grabby Setup for Vite...\n');

// 1. Update vite.config.ts
if (fs.existsSync(VITE_CONFIG)) {
    let content = fs.readFileSync(VITE_CONFIG, 'utf8');

    // Add import if missing
    if (!content.includes('grabbySyncPlugin')) {
        content = "import { grabbySyncPlugin } from '@grabby/cli/adapters/vite';\n" + content;
        console.log('✅ Added import to vite.config.ts');
    }

    // Add plugin call if missing
    if (!content.includes('grabbySyncPlugin()')) {
        content = content.replace(/plugins:\s*\[/, 'plugins: [grabbySyncPlugin(), ');
        console.log('✅ Added plugin to vite.config.ts');
    }

    // Add watch ignore if missing
    if (!content.includes('".grabbed_element"')) {
        if (content.includes('watch: {')) {
            content = content.replace(/ignored:\s*\[/, 'ignored: [".grabbed_element", ');
        } else if (content.includes('server: {')) {
            content = content.replace('server: {', 'server: {\n    watch: {\n      ignored: [".grabbed_element"],\n    },');
        } else {
            content = content.replace('export default defineConfig({', 'export default defineConfig({\n  server: {\n    watch: {\n      ignored: [".grabbed_element"],\n    },\n  },');
        }
        console.log('✅ Added watch ignore to vite.config.ts');
    }

    fs.writeFileSync(VITE_CONFIG, content);
} else {
    console.log('⚠️  vite.config.ts not found. Please add manually:');
    console.log(`
import { grabbySyncPlugin } from '@grabby/cli/adapters/vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['.grabbed_element'],
    },
  },
  plugins: [grabbySyncPlugin()],
});
    `);
}

// 2. Update index.html
if (fs.existsSync(INDEX_HTML)) {
    let content = fs.readFileSync(INDEX_HTML, 'utf8');

    if (!content.includes('grabby.js')) {
        const scriptTag = '\n    <script src="./node_modules/@grabby/cli/client/grabby.js"></script>\n  </head>';
        content = content.replace('</head>', scriptTag);
        fs.writeFileSync(INDEX_HTML, content);
        console.log('✅ Added script to index.html');
    } else {
        console.log('ℹ️  Script already exists in index.html');
    }
} else {
    console.log('⚠️  index.html not found. Please add manually:');
    console.log('<script src="./node_modules/@grabby/cli/client/grabby.js"></script>');
}

// 3. Create placeholder .grabbed_element
const grabbedFile = path.join(process.cwd(), '.grabbed_element');
if (!fs.existsSync(grabbedFile)) {
    fs.writeFileSync(grabbedFile, JSON.stringify({ note: "Ready to grab!" }, null, 2));
    console.log('✅ Created .grabbed_element');
}

console.log('\n🚀 Setup complete! Run your dev server and add "?grab=true" to the URL.');
console.log('   Example: http://localhost:5173?grab=true\n');
