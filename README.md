> This repository also serves as a personal design note. Some parts are intentionally experimental and not optimized for external reuse.

# Principle
An executable blog where every code snippet is guaranteed to work.  
All snippets are tested, and UI implementations are validated at compile time using `foxp`.

- Code snippets can be guaranteed at build time
- UI layout can be validated at compile time by `foxp`
- Documentation can be derived from executable source code by `mdx`

## Description
Code snippets in articles or Markdown do not guarantee correctness. Using playgrounds is a common workaround, but it requires extra effort from readers (even if it is just a single click).

This project eliminates that friction.

By generating Markdown from actual source code and comments, every snippet is validated at build time. There is no need to doubt whether the code works.

Another time-consuming task is visually checking UI layout. This project demonstrates how `foxp` eliminates layout collisions and invalid style definitions at compile time.

This project addresses both of these issues in a unified workflow.

# Implementation
## System Architecture
A multi-stage pipeline that transforms raw source code into structured Markdown, eventually rendering into optimized static HTML.

- **Content Source** (`content/typescript`): Articles are written as code to allow for direct validation of logic and types.
- **Transpiler**: `content/typescript/ts2md.sh` extracts documentation and code snippets into Markdown files.

## Dependent Flow
Frontend and Backend should not depend on each other. Developer should not need to know which libraries are used on the other side when working on either the frontend or backend. This is why I did not choose frameworks like Astro, as I avoid any DSL *leakage* between layers.

    Contents -> mdx -> Frontend / Backend

Frontend and Backend are as loosely coupled as possible (`App` is always imported from Frontend though). Both depend on `mdx`; this acts as a shared requirement.

The `contents/*` directory is separated as submodules, so it can be viewed independently as a documentation repository.

This allows the tech stack on either side to be replaced at any time. Any documentation can be placed in `contents/*` as Markdown.

But this is an experimental project exploring compile-time guarantees for UI and content systems. Currently, MDX acts as the central integration layer between content and rendering.

The pipeline is designed to be replaceable, allowing experimentation with different technologies and architectures.

## foxp as a checker
A custom meta-programming layer that bridges the gap between CSS strings and TypeScript types.

It prevents runtime layout bugs (e.g., static analysis of overlaps for x, y, width, height) and syntax errors (e.g., invalid RGBA strings) at the type level. It ensures that the "Strictly Typed Styles" philosophy is enforced by the compiler, not just by convention.

**Note** - `foxp` is a beta-project. The syntax may change and affect this codebase.

# Development Flow
## Tree
- `ui`: Frontend. Currently uses React 19.
  - `animation`: Animation and timeline domains. `gsap` picks them.
  - `common`: Constants. Not intended to be used as engine initialization, unlike `animation` and `engine`.
  - `components`: Reusable components for pages.
    - `UI`: Wrappers and header for content.
	- `gsap`: Wrappers using gsap.
	- `icon`: Icons.
	- `mdx`: UI side to show Markdown.
  - `engine`: Layout domains. `foxp` checks here.
  - `pages`: This does not use slugs in pathnames and does not strictly follow conventional routing.
    - `docs` Page for `docs/*` route.
	- `root`: Page for `/`. Currently renders a profile page.
  - `lib`: Functions.
  - `store`: Zustand.
- `pipeline`: SSG generator. Currently uses Vite.
  - `server`: Ignite for SSG generator. Insert metadatas here.
  - `mdx`: AST generator. These outputs are used in both the frontend and backend.
  - `ssg`: Core SSG generator.
- `shared`: Types and constants used in both above. Almost all are about `mdx`.
## Adding/Updating Articles
To ensure content integrity, raw Markdown is not written directly. Instead, we use a code-first approach.
1. Write and validate code within `content/typescript` - `cd content/typescript`
2. Convert code to Markdown there - `sh ts2md.sh`
3. From the project root, build the project and execute the SSG - `cd ../../ && pnpm build`
## Commands
### Watch
- `pnpm dev`: Starts the development server using vite.config.dev.ts.
- `pnpm preview`: Locally previews the generated static site.
### Format & Lint
- `pnpm format`: Runs Biome for instant code formatting.
### Type Check
- `pnpm type`: Type check for `src` directory, including layout type check.
- `pnpm type:test`: Type check for `test` directory, including collision detection check used in layout compile-time checker.
- `pnpm type:pipe`: Type Check for SSG scripts.
- `pnpm type:playwright`: Type check for playwright test code.
### Runtime test
- `pnpm test`: Runs Vitest tests.
- `pnpm test:ui`: Runs Playwright tests.
   > Note: Avoid [this issue]( https://github.com/vitest-dev/vitest/discussions/4289 ), made a `playwright` directory.
- `pnpm test:ssg`: Check if generated ssg fills the requirements.
### Build 
- `pnpm build`: Executes the full production build and SSG process.
- `pnpm build:test`: Build then check SSG outputs and run UI test consequently.
- `pnpm build:finally`: All-in-one build command. 

# TODO
- [ ] refactor: tsconfig
- [ ] test: add more playwright cases
- [ ] test: add more pipeline cases

# License
BSD 3-Clause License
