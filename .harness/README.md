# Harness pipelines

## Update Changelog

Keeps the doc-site changelog (`apps/portal/src/data/changelog.json`) current by
regenerating it from `main`'s git history whenever a PR merges to `main`.

This replaces the old GitHub Actions workflow (`.github/workflows/update-changelog.yml`),
which never ran — this repo lives on **Harness Code**, not GitHub, so the GitHub
`pull_request` event that workflow listened for was never delivered.

| File | Purpose |
|------|---------|
| `update_changelog.yaml` | CI pipeline: checks out the repo, runs `apps/portal/scripts/backfill-changelog.mjs --from-git`, commits + pushes `changelog.json` if it changed. |
| `update_changelog_trigger.yaml` | Trigger: fires the pipeline on PR **Merge** into `main`. |

### One-time setup in Harness (needs a valid login + repo admin)

These definitions are code; they still have to be registered once in the Harness UI:

1. **Create the push secret.** Add a Harness **secret** named `changelog_bot_pat`
   (project `Harness_Commons`, org `PROD`) holding a PAT / service-account token
   with **write** access to the `canary` repo. The push step references it as
   `<+secrets.getValue('changelog_bot_pat')>`.
2. **Import the pipeline** from Git: Pipelines → New Pipeline → Import From Git →
   point at `.harness/update_changelog.yaml` on `main`.
3. **Import the trigger** (or add it under the pipeline's Triggers tab) from
   `.harness/update_changelog_trigger.yaml`, and confirm it shows as enabled.
4. **Test it:** merge a throwaway PR to `main` and confirm the pipeline runs and
   pushes a `docs(portal): update changelog …` commit.

### Notes / things to verify on first run

- The bot's own commit ends in `[skip changelog]` and has no `(#NN)` suffix, so
  the backfill parser skips it — no self-triggering loop.
- Infra is set to Harness **Cloud** (`node:20`); switch to the project's standard
  K8s/VM infra if that's preferred.
- If two PRs merge at nearly the same time, both runs regenerate from git and push;
  the second may need a rebase/retry. Add a concurrency guard if that becomes noisy.
