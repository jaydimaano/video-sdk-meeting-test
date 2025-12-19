# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` - Start development server (localhost:3000)
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint

## Architecture

This is a Next.js 16 App Router project with TypeScript and Tailwind CSS v4.

- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with Geist font configuration
- `src/app/page.tsx` - Home page component
- `@/*` path alias maps to `./src/*`
