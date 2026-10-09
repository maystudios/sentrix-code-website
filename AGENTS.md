# Sentrix Code Website – agent instructions

Before any project work, read [WEBSITE.md](WEBSITE.md). It is the shared, binding
reference for the website's goals, fixed project decisions and working methods.
Follow the provisions relevant to the task. Keep these provisions in WEBSITE.md
rather than duplicating them here.

## Protected project instructions

Treat `WEBSITE.md`, `AGENTS.md` and `CLAUDE.md` as read-only by default.
Do not edit, rewrite, reformat, replace, rename or delete them unless the user
explicitly requests or authorizes the specific change in the current task.
A general implementation, refactoring, cleanup or documentation request is not
permission to modify these files. Earlier permission to create or edit them is
not standing permission for later tasks or other agents. The Next.js block below
is maintained by `next dev` and is the only exception.

When the user explicitly asks to develop these documents together, make only
the requested changes and preserve all unrelated content. Never change WEBSITE.md
to fit an implementation, and never remove or weaken this protection without
explicit user authorization. If a task conflicts with these documents, report
the conflict and obtain explicit direction before changing them.

## Public repository

This repository is public. Never commit secrets, `.env` files, internal documents,
customer or contract data, or content from the project owner's Second Brain.

## Workflow Harness

Use the Workflow Harness installed from `C:\Users\conta\harness-workflow` (Sven's PC) or
`C:\DevTools\harnesses\harness-workflow` (Luca's PC) for substantial project work.
Keep project-only facts in `.harness/notes/` and generated run artefacts in
`.harness/runs/`, which is not committed.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
