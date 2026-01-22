# Grabby Installation Guide

## What is Grabby?

Grabby is an **AI-powered frontend development infrastructure** that combines:

1. **Element Inspector** - Click any UI element to capture its context
2. **AI Knowledge Base** - 980KB of curated skills (design patterns, state management, animations)
3. **Automated Workflows** - Bash scripts that analyze, refactor, and improve your code
4. **Semantic Search** - mgrep-powered knowledge retrieval for AI agents

**The Skills System:**
- `Skills/AGENTS.md` - AI operational framework (how AI thinks and operates)
- `Skills/skills/` - Knowledge base (52 Jotai docs, design patterns, Motion library, Tailwind CSS)
- `Skills/workflows/` - Executable scripts (accessibility audits, component extraction, style refactoring)

When you run `grabby init`, it **injects this entire AI brain into your project**.

---

## Install from GitHub (Recommended for now)

Since this package isn't published to npm yet, install directly from the GitHub repo:

```bash
npm install -g git+https://github.com/alexandephilia/Grabby_Tool.git
```

Then run in your project:

```bash
grabby init
```

This will:
- ✓ Copy `Skills/` folder (AI knowledge base) to your project
- ✓ Install dependencies (mgrep, comby)
- ✓ Set up framework adapters (Vite/Next.js)
- ✓ Initialize semantic search indexing

---

## Alternative: Local Development Install

If you want to work on Grabby itself:

```bash
# Clone the repo
git clone https://github.com/alexandephilia/Grabby_Tool.git
cd Grabby_Tool

# Install dependencies
npm install

# Build TypeScript
npm run build

# Link globally
npm link

# Now run anywhere
grabby init
```

---

## Usage

After installation:

1. Navigate to your project directory
2. Run `grabby init`
3. Start your dev server (`npm run dev`)
4. Add `?grab=true` to your browser URL
5. Hold Cmd/Ctrl and click any element

**AI Workflow Example:**

```bash
# User clicks a button element
# .grabbed_element is created with element data

# AI detects intent: "make this more accessible"
bash Skills/workflows/accessibility-audit.sh

# AI reads output
cat .workflow_output/accessibility-audit.md

# AI applies WCAG recommendations automatically
```

---

## What Gets Installed

**Core Files:**
- `bin/cli.js` - Main CLI executable
- `dist/` - Built TypeScript adapters (Vite/Next.js)
- `client/grabby.js` - Browser-side element picker
- `scripts/` - Framework setup scripts

**AI Knowledge System (Skills/):**
- `AGENTS.md` (52KB) - AI operational framework
- `skills/frontend-design/` - Design patterns, React rules, aesthetics
- `skills/motion-dev/` - Motion animation library docs
- `skills/jotai/` - 52 files of state management knowledge
- `skills/tailwind-css/` - CSS framework reference
- `skills/codebase-context/` - Project analysis patterns
- `workflows/` - Executable bash scripts for AI actions

**Dependencies:**
- `mgrep` - Semantic search for AI knowledge retrieval
- `comby` - Structural code transformation tool

---

## Troubleshooting

**Error: "Cannot find module 'dist/index.js'"**
- The repo needs to have built files committed
- Run `npm run build` in the Grabby repo and commit the `dist/` folder

**Error: "command not found: grabby"**
- Make sure you installed globally with `-g` flag
- Or use `npx grabby init` instead

**Error: "mgrep not found"**
- Run `npm install -g @mixedbread-ai/mgrep`
- Or let `grabby init` install it for you

**Error: "Skills/ not found in package"**
- The `Skills/` folder must be committed to the repo
- Verify with: `ls -la Skills/`

---

## How the AI System Works

**1. Element Capture:**
```
User adds ?grab=true → Clicks element → .grabbed_element created (JSON)
```

**2. AI Workflow Execution:**
```bash
# AI detects intent and runs workflow
bash Skills/workflows/element-redesign.sh

# Workflow uses mgrep to search Skills/ knowledge base
mgrep search "design patterns modern UI" Skills/

# Workflow generates recommendations
cat .workflow_output/redesign-proposal.md
```

**3. AI Application:**
```
AI reads workflow output → Applies changes using Skills/ knowledge
```

**The Power:** AI has instant access to 980KB of curated knowledge (design patterns, state management, animations) through semantic search, enabling context-aware code generation and refactoring.

---

## Skills Directory Structure

```
Skills/
├── AGENTS.md (52KB operational framework)
├── skills/ (Knowledge base)
│   ├── frontend-design/ (Design patterns, React rules)
│   ├── motion-dev/ (Motion library comprehensive docs)
│   ├── jotai/ (52 files - complete state management)
│   ├── tailwind-css/ (CSS framework reference)
│   └── codebase-context/ (Project analysis tools)
└── workflows/ (Executable scripts)
    ├── query-skill.sh (Semantic search)
    ├── accessibility-audit.sh (WCAG checking)
    ├── component-extract.sh (Component extraction)
    ├── element-redesign.sh (Design proposals)
    └── style-refactor.sh (Tailwind conversion)
```

This entire system gets copied to your project when you run `grabby init`.
