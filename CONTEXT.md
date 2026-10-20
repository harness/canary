# Canary — Assist Glossary

**Assist**: The interactive helper that non-technical contributors run from the repo root to perform everyday tasks without knowing terminal commands.

**Task**: One selectable action in Assist (for example "Update icons"). Each has a short description and belongs to a Category.

**Category**: A grouping of Tasks by the app or package they act on, or by purpose (Daily workflow, Apps, UI package, Quality, Publishing).

**Contributor**: A non-technical person who changes the design system or packages by instructing an AI, and who raises the PR themselves.

**Feature branch**: A branch a Contributor starts for one piece of work, named from a Jira ticket id or a free-text name.

**Get latest code**: The Task that brings the Contributor's workspace up to date with `main`, installs packages, and rebuilds.

**Save & push**: The Task that commits all of a Contributor's changes with a message they provide and pushes the Feature branch, then opens the PR-compare link.

**Global command**: The `assist` shortcut a Contributor can type in any terminal instead of `pnpm assist`. It only runs inside a canary clone, using that clone's Assist.
