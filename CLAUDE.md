# Project Architecture & AI Coding Rules

## 1. Core Principles
- **Modularity First:** Never build monolithic files. Keep components small, focused, and reusable.
- **Strict File Size Limit:** Maximum **350 lines** per component file and **250 lines** for page/orchestrator files. If a file approaches this limit, proactively split it into sub-components or custom hooks before adding new code.
- **Separation of Concerns:** Keep UI rendering completely separate from business logic, data fetching, and complex state management.

## 2. Standard Directory Structure
- `src/types/`: All TypeScript interfaces, types, and data schemas.
- `src/constants/`: Static configurations, default values, options, mock data, and i18n dictionaries.
- `src/lib/`: Pure helper functions (formatting, file export/import, validation) with zero React/DOM state dependencies.
- `src/hooks/`: Custom hooks managing state, `localStorage`, API calls, undo/redo history, and CRUD operations.
- `src/components/<feature>/`: Feature-specific UI organized into:
  - `topbar/` (navigation & global actions)
  - `sidebar/` (control drawers & form tabs)
  - `workspace/` (main canvas / content viewer)
  - `modals/` (isolated dialog components with `isOpen` & `onClose` props)

## 3. Refactoring & Feature Development Workflow
1. **Plan Before Coding:** For any new feature or refactoring task involving more than 2 files, ALWAYS output the proposed file structure and execution plan first. Wait for user confirmation before writing or modifying code.
2. **Batch Execution:** When refactoring large files (>1,000 lines), execute in small, safe batches (e.g., 3–4 components per turn) moving from static data -> pure helpers -> UI components -> state hooks.
3. **Scoped Edits Only:** When fixing bugs or tweaking UI styles, modify ONLY the specific sub-component responsible. Do not rewrite unrelated files or alter existing TypeScript interfaces unless explicitly requested.
4. **Dispatcher Pattern:** If rendering 3 or more layout/template variations, extract each variation into its own component file and use a clean Switch/Map dispatcher component.