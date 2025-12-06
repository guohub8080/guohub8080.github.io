# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application that serves as a documentation and tools platform. The project includes:
- Interactive documentation books (SVG, Music Theory, Prompt Engineering, Web Development, etc.)
- Utility applications (Color tools, Crypto, MIDI toolkit, etc.)
- **TonicML**: A custom music notation compiler with a 10-stage compilation pipeline
- Reusable SVG components library

## Development Commands

```bash
# Development
pnpm dev              # Start development server with HMR

# Build
pnpm build            # Type check with tsc, then build for production
                      # Output directory: docs/

# Code Quality
pnpm lint             # Run ESLint on .ts and .tsx files

# Preview
pnpm preview          # Preview production build locally
```

## Architecture

### Project Structure

```
src/
├── dev/                          # Main application code
│   ├── main.tsx                  # Application entry point
│   ├── App.tsx                   # Root component with RouterProvider
│   ├── router/                   # React Router configuration
│   │   ├── index.tsx            # Route definitions using createHashRouter
│   │   └── paths.ts             # Centralized route path constants
│   ├── components/               # Shared UI components
│   │   └── layout/              # Layout components (MainLayout, BookLayout)
│   ├── store/                    # Zustand state management
│   │   ├── useGlobalSettings/   # Global app settings (theme, fonts, etc.)
│   │   ├── useDrawerStore.ts    # Drawer state
│   │   └── useViewSettingsStore.ts
│   ├── apps/                     # Standalone app pages
│   │   ├── Home/                # Home page
│   │   ├── Settings/            # Settings page
│   │   ├── Color/               # Color utility tools
│   │   ├── Crypto/              # Cryptography tools
│   │   ├── Mtkit/               # MIDI toolkit
│   │   ├── TonicMLEditor/       # TonicML notation editor
│   │   ├── PlanToDo/            # Todo list app
│   │   └── IME/                 # Input method editor
│   ├── pubComponents/            # Reusable components library
│   │   ├── PureHTML/            # Pure HTML components
│   │   ├── SVG/                 # SVG component categories
│   │   └── PubUtils/            # Utility functions for components
│   ├── tonicml/                  # TonicML music notation compiler
│   │   ├── index.ts             # Compiler main entry (TonicMLCompiler class)
│   │   └── stageProcess/        # 10-stage compilation pipeline (s1-s10)
│   ├── shadcn/                   # shadcn/ui components
│   ├── utils/                    # Utility functions
│   ├── api/                      # API related code
│   ├── assets/                   # Static assets
│   └── styles/                   # Global styles
├── books/                        # Documentation books
│   ├── SvgDocument/             # SVG documentation
│   ├── Music12Document/         # 12-tone music theory
│   ├── MusicTheoryDocument/     # General music theory
│   ├── PromptDocument/          # Prompt engineering guide
│   ├── TonicMLDocument/         # TonicML language docs
│   ├── TonicMLScore/            # TonicML score examples
│   └── WebDevDocument/          # Web development docs
└── articles/                     # Article pages
```

### Path Aliases

The project uses extensive path aliases for cleaner imports. Always use these aliases instead of relative paths:

- `@/*` → `./src/*`
- `@dev/*` → `./src/dev/*`
- `@comps/*` → `./src/dev/components/*`
- `@apps/*` → `./src/dev/apps/*`
- `@styles/*` → `./src/dev/styles/*`
- `@assets/*` → `./src/dev/assets/*`
- `@utils/*` → `./src/dev/utils/*`
- `@api/*` → `./src/dev/api/*`
- `@pubHTML/*` → `./src/dev/pubComponents/PureHTML/*`
- `@pubSVG/*` → `./src/dev/pubComponents/SVG/*`
- `@pubUtils/*` → `./src/dev/pubComponents/PubUtils/*`
- `@shadcn/*` → `./src/dev/shadcn/*`
- `@books/*` → `./src/books/*`
- `@svgDocument/*` → `./src/books/SvgDocument/*`
- `@music12doc/*` → `./src/books/Music12Document/*`
- `@tonicml/*` → `./src/dev/tonicml/*`

### Routing System

- Uses **React Router v6** with `createHashRouter` (hash-based routing)
- Main routes defined in `src/dev/router/index.tsx`
- Route paths centralized in `src/dev/router/paths.ts` - always use these constants
- Two main layouts:
  - `MainLayout`: Top navigation + content area (for apps and home)
  - `BookLayout`: Sidebar navigation + content area (for documentation books)
- Invalid routes redirect to `/home/` with a console warning

### Documentation Book System

Documentation books follow a convention-based auto-loader pattern:

**Folder Structure:**
```
src/books/{BookName}/
├── data/
│   ├── info.tsx                    # Book config (title, slug, icon)
│   ├── {bookName}Loader.tsx       # Auto-loader function
│   ├── components/                 # Book-specific components
│   └── assets/                     # Book-specific assets
├── [01]CategoryName/               # Categories ordered by [x] prefix
│   ├── info.tsx                   # Category config (slug, icon)
│   ├── [1]article-slug.tsx        # Article files (tsx/md/mdx)
│   ├── [2]another-article.md
│   └── [3]third-article.mdx
└── [02]AnotherCategory/
    └── ...
```

**Naming Conventions:**
- Folders: `[x]CategoryName` where `x` is sort order (e.g., `[01]概述`, `[02]基本动画`)
- Files: `[x]article-slug.{tsx,md,mdx}` where `x` is sort order within category
- Each category folder must have `info.tsx` defining `slug` and `icon`
- The main `data/info.tsx` defines the book's title, slug, and icon

**Loader Functions:**
- Each book has a `{bookName}Loader.tsx` that exports `generate{BookName}Routes()`
- This function auto-scans folders and files to build routes
- Routes are imported in `src/dev/router/index.tsx`

**Example:** File `src/books/SvgDocument/[02]基本动画/[1]translate.tsx` becomes route `/svg-document/basic/translate`

### State Management

Uses **Zustand** for state management:

- `useGlobalSettings`: Theme, fonts, background settings, last visited URL
- `useDrawerStore`: Sidebar drawer state
- `useViewSettingsStore`: View-specific settings
- `useUserLog`: User activity logging

Store files can be organized as single files (`.ts`) or folders with `index.tsx` for complex stores.

### TonicML Compiler

TonicML is a custom music notation language with a **10-stage compilation pipeline**:

1. **s1_text_to_blocks**: Split raw text into blocks
2. **s2_basic_token_recognition**: Tokenize blocks
3. **s3_syntax_error_filtration**: Filter syntax errors
4. **s4_token_enhancement**: Enhance tokens with metadata
5. **s5_state_assignment**: Assign musical states
6. **s6_structure_build**: Build musical structure
7. **s7_note_parse**: Parse individual notes
8. **s8_score_validation**: Validate complete score
9. **s9_chord_phrase**: Process chord phrases
10. **s10_final_build**: Generate final output structure

**Usage:**
```typescript
import { TonicMLCompiler } from '@tonicml';

const compiler = new TonicMLCompiler(rawText);
compiler.compile();
const result = compiler.getFinalResult();
```

Each stage is in `src/dev/tonicml/stageProcess/sX_stage_name/` with its own types and utilities.

### UI Component Libraries

- **Primary**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Legacy**: Ant Design (commented out, being phased out)
- **Icons**: lucide-react, @heroicons/react, react-icons
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **Animations**: motion (Framer Motion fork), tailwindcss-animate

### MDX Support

The project supports MDX files for documentation:

- Configured via `@mdx-js/rollup` plugin in vite.config.ts
- Supports GitHub Flavored Markdown (remark-gfm)
- MDX files can be imported as React components
- File extensions: `.md`, `.mdx`, `.tsx`

### Build Configuration

- **Output directory**: `docs/` (for GitHub Pages deployment)
- **Base URL**: Uses hash routing (no base path needed)
- **Code splitting**: Vendor chunks for react, baseTool (lodash/ramda), dayjs, monaco
- **Asset naming**: `assets/[ext]/[name]-[hash][extname]`
- **Minification**: Terser (production only)

### Development Proxy

The dev server has a proxy for WeChat images:

```javascript
// Proxies /api/wechat-img/* to https://mmbiz.qpic.cn/*
// Removes referer/origin headers to bypass restrictions
```

## Common Tasks

### Adding a New Book

1. Create folder structure in `src/books/NewBook/`
2. Create `data/info.tsx` with book config
3. Create loader file `data/newBookLoader.tsx` following existing patterns
4. Add category folders with `[x]Name` format
5. Add `info.tsx` to each category folder
6. Add route generation to `src/dev/router/index.tsx`
7. Update `src/dev/router/paths.ts` with new route constant

### Adding a New App

1. Create folder in `src/dev/apps/NewApp/`
2. Create `index.tsx` as the main component
3. Add route in `src/dev/router/index.tsx`
4. Add path constant to `src/dev/router/paths.ts`
5. Optionally add to navigation in `MainLayout/Navigation.tsx`

### Working with TonicML

When modifying the TonicML compiler:
- Each stage is independent and has its own types
- Stages pass results via `StageResult<T>` wrapper
- Debug logs use `buildDebugMessage()` and `LogType` enum
- Always run all 10 stages in sequence
- Stage results are stored in the compiler instance

### Path Resolution

Always use path aliases (`@dev`, `@comps`, etc.) instead of relative paths. If you need to import from another part of the codebase, check `tsconfig.json` and `vite.config.ts` for the appropriate alias.

### ESLint Configuration

The project has `no-mixed-spaces-and-tabs` disabled in package.json. Follow existing code style for consistency.
- 尽量使用pnpm来安装文件；尽可能使用短路径，例如能用@shancn就不用@dev/shandcn；
- 我需要shadcn作为自己的组件库，如果没有，先尝试上网搜索，下载到@shadcn文件夹中再继续
- 我的项目中的tailwind版本是v4，请勿使用v3的代码；请勿动global.css的内容