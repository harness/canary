# Portal changelog

The doc-site Change Log (`apps/portal`) reads `apps/portal/src/data/changelog.json`
and lists merged canary PRs.

The original GitHub Action (`.github/workflows/update-changelog.yml`) never ran —
this repo lives on Harness Code, not GitHub.

## How it stays current

1. **Live site (Netlify).** `apps/portal/astro.config.ts` regenerates
   `changelog.json` from git history during `astro build` when `NETLIFY=true`.
   Any main deploy of the portal therefore shows recently merged PRs without a
   write-back job.
2. **Committed JSON.** `node apps/portal/scripts/backfill-changelog.mjs --from-git --limit=60`
   refreshes the checked-in file for local `portal:dev`. The backfill refuses to
   shrink the file (guards shallow clones).
3. **Optional merge pipeline.** `.harness/update_changelog.yaml` appends the
   merged PR via `update-changelog.mjs` and pushes to `main`. The trigger
   (`.harness/update_changelog_trigger.yaml`) fires on Harness Code PR merge to
   `main`. Import it only if you also want the git copy updated on every merge;
   the live site does not depend on that.

Skip a PR by putting `[skip changelog]` in its title.
