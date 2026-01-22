# Grabby: AI-Powered Frontend Development Infrastructure

**Elevate your workflow.** Grabby is a precision-engineered AI knowledge system that combines element inspection, semantic search, and automated workflows to enable autonomous code generation and structural refactoring.

## The Architecture

Grabby operates as a three-layer system:

1.  **The Context Inspector (Eyes)**: High-precision element picker integrated into your dev environment (Vite, Next.js). Captures component metadata, styles, and context—feeding it directly to AI agents.

2.  **The Knowledge Base (Brain)**: 980KB of curated AI skills including:
    - **52 Jotai state management docs** (complete library knowledge)
    - **Frontend design patterns** (aesthetics, React rules, typography)
    - **Motion animation library** (comprehensive Motion.dev docs)
    - **Tailwind CSS reference** (utility-first styling)
    - **Codebase analysis tools** (project structure detection)

3.  **The Workflow Engine (Hands)**: Executable bash scripts that query the knowledge base via semantic search (`mgrep`) and perform automated actions:
    - Accessibility audits (WCAG compliance)
    - Component extraction (modularization)
    - Style refactoring (Tailwind conversion)
    - Design transformation (UI/UX improvements)
    - Code refactoring (AST-based with `comby`)

### The Arsenal (Supported Stack)

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## Installation

### Install via npx (Recommended)

The easiest way to use Grabby:

```bash
npx grabby-cli init
```

This will:
- ✓ Copy **Skills/ folder** (980KB AI knowledge base) to your project
- ✓ Install **mgrep** (semantic search engine) globally if needed
- ✓ Install **comby** (structural code transformation) via Homebrew if needed
- ✓ Configure **framework adapters** (Vite plugin or Next.js handlers) automatically
- ✓ Initialize **semantic indexing** for instant AI knowledge retrieval

### Alternative: Global Install

```bash
npm install -g grabby-cli
grabby init
```

### Alternative: Local Development

```bash
git clone https://github.com/alexandephilia/Grabby_Tool.git
cd Grabby_Tool
npm install
npm run build
npm link
grabby init
```

---

## The Skills System

After running `grabby init`, your project gains access to the complete AI knowledge infrastructure:

```
Skills/
├── AGENTS.md (52KB)
│   └── AI operational framework (atomic thinking, ethical nihilism)
│
├── skills/ (Knowledge Base)
│   ├── frontend-design/
│   │   └── Design patterns, React rules, typography, aesthetics
│   ├── motion-dev/
│   │   └── Motion animation library comprehensive docs
│   ├── jotai/ (52 files!)
│   │   └── Complete state management knowledge
│   ├── tailwind-css/
│   │   └── CSS framework reference
│   └── codebase-context/
│       └── Project analysis and structure detection
│
└── workflows/ (Executable Scripts)
    ├── query-skill.sh → Semantic search via mgrep
    ├── accessibility-audit.sh → WCAG compliance checking
    ├── component-extract.sh → Component modularization
    ├── element-redesign.sh → Design transformation
    ├── style-refactor.sh → Tailwind conversion
    └── codemod-refactor.sh → AST-based code refactoring
```

### Automated Workflows

| Command                                        | Capability                                                                           |
| :--------------------------------------------- | :----------------------------------------------------------------------------------- |
| `bash Skills/workflows/accessibility-audit.sh` | **Accessibility Enforcement**: WCAG compliance auditing with actionable fixes        |
| `bash Skills/workflows/style-refactor.sh`      | **Style Optimization**: Convert inline styles to Tailwind utility classes           |
| `bash Skills/workflows/element-redesign.sh`    | **Design Transformation**: AI-driven UI/UX improvements using design knowledge       |
| `bash Skills/workflows/component-extract.sh`   | **Structural Refactoring**: Extract reusable components with proper patterns         |
| `bash Skills/workflows/query-skill.sh`         | **Knowledge Retrieval**: Semantic search across 980KB of curated AI knowledge        |
| `bash Skills/workflows/codemod-refactor.sh`    | **Code Transformation**: AST-based refactoring with Codemod CLI                      |

---

## Usage

### Basic Workflow

1.  **Initialize**: Run `grabby init` in your project
2.  **Activate**: Start your dev server (`npm run dev`)
3.  **Inspect**: Add `?grab=true` to your URL
4.  **Capture**: Hold Cmd/Ctrl and click any UI element
5.  **Execute**: AI automatically processes `.grabbed_element` and runs workflows

### AI Workflow Example

```bash
# User clicks a button element
# → .grabbed_element created with element data

# AI detects intent: "make this more accessible"
bash Skills/workflows/accessibility-audit.sh

# AI reads generated recommendations
cat .workflow_output/accessibility-audit.md

# AI applies WCAG fixes automatically using Skills/ knowledge
```

### Semantic Knowledge Retrieval

```bash
# AI needs design pattern knowledge
bash Skills/workflows/query-skill.sh "React useEffect alternatives"

# mgrep searches Skills/ semantically
# Returns ranked results from 52 Jotai docs, design patterns, etc.

# AI applies knowledge to current task
```

### Manual Workflow Execution

```bash
# Check accessibility of grabbed element
bash Skills/workflows/accessibility-audit.sh

# Convert inline styles to Tailwind
bash Skills/workflows/style-refactor.sh

# Get design improvement proposals
bash Skills/workflows/element-redesign.sh

# Extract component from grabbed element
bash Skills/workflows/component-extract.sh
```

## Framework Integration

### Vite

```typescript
// vite.config.ts
import { grabbySyncPlugin } from '@grabby/cli'

export default {
  plugins: [grabbySyncPlugin()]
}
```

### Next.js (Pages Router)

```typescript
// pages/api/grabby-sync.ts
import { createGrabbyHandler } from '@grabby/cli'
export default createGrabbyHandler()
```

### Next.js (App Router)

```typescript
// app/api/grabby-sync/route.ts
import { createGrabbyAppHandler } from '@grabby/cli'
export const POST = createGrabbyAppHandler()
```

## System Requirements

- **Node.js** 16+ (for npm/npx)
- **Homebrew** (optional, for comby installation)
- **mgrep** (installed automatically via npm)
- **comby** (installed automatically via Homebrew)
- **Supported Frameworks**: Vite 4+, Next.js 13+

## Key Features

- **Zero Configuration**: Automatic framework detection and setup
- **Portable Knowledge**: Skills/ folder works in any project
- **Semantic Search**: mgrep-powered AI knowledge retrieval
- **AST-Based Refactoring**: Precise code transformations with comby
- **Visual Element Picker**: Browser-integrated inspector
- **Automated Workflows**: Bash scripts for common AI tasks
- **Type-Safe**: Full TypeScript support with .d.ts files

## Documentation

- **[INSTALL.md](./INSTALL.md)** - Detailed installation guide
- **[USAGE.md](./USAGE.md)** - Comprehensive usage documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture deep dive
- **[Skills/AGENTS.md](./Skills/AGENTS.md)** - AI operational framework

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

© 2026 alexandeism. Precision Development. Modular Intelligence.
