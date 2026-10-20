# Assist CLI — Design

Status: agreed, not yet implemented.
Terms used here (Assist, Task, Category, Contributor, Feature branch, Get latest code, Save & push) are defined in [CONTEXT.md](../CONTEXT.md).

## 1. Problem

Non-technical Contributors change the design system and packages in this repo by instructing an AI, and then raise the PR themselves. They do not use the terminal, so they cannot run the everyday tasks the repo needs: updating icons and logos, formatting, linting, testing, building, running the portal, publishing to yalc, pulling the latest `main`, and committing and pushing.

## 2. Goal

One command, `pnpm assist`, run from the repo root. It shows a menu of Tasks grouped by Category, each with a one-line description. Every Task can also be run directly by id, so the AI can run it for the Contributor.

## 3. Hard constraints

- **No existing script is modified**: not in the root `package.json`, not in any app or package. Assist only calls scripts that already exist, or runs tools directly.
- The only edits outside the new `scripts/assist/` folder are:
  - a new `assist` script and new devDependencies in the root `package.json` (plus the lockfile),
  - `.assist/` added to `.gitignore`,
  - a short section in `canary/CLAUDE.md`,
  - `CONTEXT.md` and this document.
- React 17 and the PNPM monorepo conventions stay untouched. Assist is not a workspace package and is not part of `pnpm -r` builds.
- Node `>=18.17.1`, PNPM 9.5.0.

## 4. Invocation

| Command | Behaviour |
| --- | --- |
| `pnpm assist` | Opens the interactive menu |
| `pnpm assist -- <id>` | Runs one Task without the menu |
| `pnpm assist <id>` | Same as above (a leading `--` is ignored) |

Interactive prompts inside a Task (stash consent, branch name, commit details) still appear in id mode. The AI is expected to relay them to the Contributor.

## 5. Tech

- TypeScript in `scripts/assist/`, run with `tsx`.
- `@inquirer/prompts` for menus and questions.
- A spinner library (for example `ora`) for progress display.
- All three are root devDependencies.
- Child processes run through `execa` or Node `child_process`, with output captured rather than streamed.

## 6. Structure

```
scripts/assist/
  index.ts            entry: parse args, show menu or run by id
  registry.ts         single typed array of Tasks (id, label, category, description, run)
  runner.ts           step runner: spinner, capture output, error handling
  git.ts              git helpers (status, stash, branch, push, parse link)
  tasks/
    fetch-latest.ts
    start-new-feature.ts
    save-and-push.ts
    apps.ts           start:portal, start:design-system
    ui-package.ts     update:icons, update:logos, build:ui, publish:yalc
    quality.ts        format, lint, typecheck, test, check-all
```

The registry is the single source of truth. The menu and the by-id mode both read from it, and the CLAUDE.md section lists the same ids.

## 7. Menu

One flat list with category separators. Each item has a description line beneath it.

**Daily workflow**
- `fetch-latest` — Get latest code: update your workspace to the newest `main`.
- `start:new-feature` — Start a new feature: create a fresh branch from the newest `main`.
- `save-and-push` — Save & push: commit your changes and push them to your branch.

**Apps**
- `start:portal` — Build the packages and run the documentation portal.
- `start:design-system` — Build the packages and run the design-system preview.

**UI package**
- `update:icons` — Refresh the icon set.
- `update:logos` — Refresh the logo set.
- `build:ui` — Build the UI package.
- `publish:yalc` — Build the UI package and publish it locally with yalc.

**Quality**
- `format` — Fix code formatting.
- `lint` — Check code style problems.
- `typecheck` — Check for type errors.
- `test` — Run the tests.
- `check-all` — Run format, lint, typecheck and test in order; stop at the first failure.

## 8. Task specifications

### 8.1 `fetch-latest`
1. If the working tree has uncommitted changes, ask in plain language: "You have changes that are not saved yet. To continue I need to put them aside safely. Is that OK?" Declining stops the Task with no changes.
2. If approved, `git stash push --include-untracked`.
3. `git checkout main`, then `git pull`.
4. `pnpm install`, then `pnpm build` (the root scripts).
5. If changes were stashed, they stay stashed. The final message says so and tells the Contributor to ask the AI to restore them. The stash is never dropped by Assist.

Steps run in sequence; the first failure stops the run (section 10).

### 8.2 `start:new-feature`
1. Same stash consent and stash as `fetch-latest` step 1–2.
2. `git checkout main`, then `git pull`. No install or build.
3. Ask: "Enter a Jira ticket (for example UUI-1234) or a short name for your work."
4. If the input matches a Jira id pattern (`^[A-Z][A-Z0-9]+-\d+$`), the branch name is the id exactly. Otherwise the input is converted to a slug and prefixed `feat/`.
5. If the branch already exists, ask for another name rather than reusing it.
6. `git checkout -b <branch>`.

### 8.3 `save-and-push`
1. Refuse on `main`: "You are on the main branch. Start a new feature first."
2. If nothing changed, say so and stop.
3. List changed files in plain words (counts of modified, new and deleted, then names) and ask for confirmation.
4. Ask for the commit type (feat, fix, chore, docs), an optional Jira id, and a short description. The message is `type: [ID]: description`, or `type: description` when no id is given.
5. `git add -A`, then `git commit`. Hooks are never bypassed; a hook failure follows section 10.
6. `git push -u origin <branch>`.
7. Parse the `remote: https://…/pulls/compare/…` line from the push output and ask permission, then open it in the default browser. The link is always printed.
8. If no link is found, tell the Contributor to open the repo and create the PR manually.

### 8.4 `start:portal` and `start:design-system`
1. Build the packages (spinner, logs hidden): the same package builds the existing `portal:dev` and `view-preview:dev` scripts perform.
2. Run the dev server in the foreground, handing the terminal over.
3. Print the local URL and "Press Ctrl+C to stop".

### 8.5 UI package tasks
- `update:icons`: runs the existing `update:icons` script in `packages/ui`.
- `update:logos`: runs the existing `update:logos` script in `packages/ui`.
- `build:ui`: runs the `build` script in `packages/ui`.
- `publish:yalc`: builds `@harnessio/ui`, then runs `yalc publish` in `packages/ui`. It does not push to any target app.

### 8.6 Quality tasks
- `format`: `pnpm -r pretty:fix` (covers `packages/ui` and `apps/portal`), then `prettier --write ./src` in packages that only have a `pretty` script: ai-chat-core, filters, forms, yaml-editor and apps/design-system. No script is added or changed.
- `lint`: the root `pnpm lint`. It is check-only; failures are explained, and the AI fixes them.
- `typecheck`: the root `pnpm typecheck`.
- `test`: the root `pnpm test`.
- `check-all`: `format`, `lint`, `typecheck`, `test` in that order, stopping at the first failure.

## 9. Progress display

- Each step shows a spinner with the step name at the bottom of the screen.
- Output from finite steps is captured and hidden; a green tick or red cross replaces the spinner when the step ends.
- Server Tasks show a spinner for the build, then give the terminal to the server.

## 10. Failure handling

- Full output of the failed step is written to `.assist/last-error.log` (gitignored; the folder is added to `.gitignore`).
- The Contributor sees a one-line plain-language message, for example "Something went wrong while building the UI package."
- A paste-able line follows: `Ask Claude: fix the error in .assist/last-error.log`.
- Git merge or pull conflicts stop the Task and show the same message. Assist never force-pushes, resets or drops stashes.

## 11. AI guidance (CLAUDE.md section)

A short section in `canary/CLAUDE.md` will:
- state that `pnpm assist -- <id>` is the preferred way to run common tasks,
- list the task ids from section 7,
- say that when a needed action is not in the list, the raw command may be used.

## 12. Global command

`assist install` (or the menu item under Setup) makes a global `assist` command so Contributors do not type `pnpm assist`.

- A launcher, `scripts/assist/bin/assist.js` (plain CommonJS), is symlinked as `assist` into a folder on the `PATH`: `~/.local/bin`, then the pnpm global bin, then `/usr/local/bin`.
- If none is on the `PATH`, it creates `~/.local/bin` and, after asking, appends one `export PATH` line to `~/.zshrc` or `~/.bashrc`.
- The launcher looks upward from the current folder for the canary clone (`package.json` named `harness-canary` with `scripts/assist/index.ts`) and runs that clone's Assist. Outside a canary clone it prints a message and exits; it never runs another clone's Assist.
- If `node_modules/.bin/tsx` is missing, it runs `pnpm install` first.
- It never overwrites a different program named `assist`. `uninstall` removes only symlinks that point at a canary launcher and leaves shell config alone.
- macOS and Linux only; Windows users keep using `pnpm assist`.

## 13. Out of scope

- Opening the PR through an API (the Contributor uses the compare link).
- Pushing yalc builds into a target app.
- Restoring stashed changes automatically.
- Any changes to existing scripts, packages or apps.

## 14. Verification plan

- Run each Task from a scratch branch and confirm spinner display, success output and failure output (force one failure per Task type).
- `fetch-latest` and `start:new-feature`: test with a clean tree, with a dirty tree (approve and decline), and from `main` and from a feature branch.
- `save-and-push`: test refusal on `main`, no changes, a failing hook, and a push that prints no link.
- Confirm `git diff` shows only the files listed in section 3 outside `scripts/assist/`.
- Run `pnpm assist -- <id>` and `pnpm assist <id>` for every id.
