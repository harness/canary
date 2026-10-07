# Troubleshooting

Failure modes observed while actually publishing assets. Where something is a firm rule it is marked
as such; where it was observed once and may vary by project, it is marked as a hint to verify rather
than gospel.

---

## Export failures

### Route A — Figma Desktop Bridge

| Symptom | Cause and fix |
|---|---|
| `figma_get_status` shows a different file | The bridge attaches per-file, and `HDS \| Components 3.0` is usually the one open. `figma_navigate` to `https://www.figma.com/design/NYeN8I4D3anR9it8ds0lyr/` with `lock: true`. |
| `page not found` | Compare against the returned page list. The icon page is `icons-to-dev`, the logo page is `brands-to-dev` — not the emoji-prefixed designer pages. |
| `component not found` | The name must be dot-prefixed and the node type must be `COMPONENT`. A frame or group will not be found. |
| Parity check fails | Do not ship from the bridge. Switch to Route B. The script prints ranked causes — most often `exportAsync` settings not matching the REST API defaults. |
| Export returns a huge byte count | You selected a section or page rather than the 16×16/22×22 component. A single icon is a few hundred bytes. |

### Route B — PAT script

| Symptom | Cause and fix |
|---|---|
| `Please set your FIGMA_TOKEN` | `.env` missing, misnamed, or in the wrong folder. It must be `packages/ui/.env`, and you must run from `packages/ui`. A fresh worktree needs its own copy — `.env` is gitignored. |
| `Page "X" not found` | Copy the exact name from the printed list. `Page "undefined"` means the page variable is missing from `.env` entirely. |
| `414 Request-URI Too Large` | `FIGMA_PAGE_NAME` points at `💠 all icons` (~2500 nodes). Must be `icons-to-dev`. |
| Junk files named like `sizexs.svg` | `FIGMA_LOGO_PAGE_NAME` points at `⭐ brand logos`. Must be `brands-to-dev`. Restore, fix `.env`, re-run. |
| `unable to get local issuer certificate`, `self-signed certificate in certificate chain`, `getaddrinfo ENOTFOUND api.figma.com` | Corporate VPN interfering with TLS to the Figma API. Reconnect the VPN and retry before changing anything else. |
| `403` from the Figma API | The token expired. Generate a new one (`File content: Read` scope only). |
| `Cannot find package 'dotenv'` | `pnpm install` was never run in this worktree. |
| Empty diff | The Figma branch was not merged, the component is not on the export page, it is not a `COMPONENT`, or it is nested more than two levels deep. |
| Many missing map entries | Downloads failed. Look for `❌ Failed to download` in the output. Fix the cause, restore from `main`, re-run. |

**The export scripts catch their own errors and still exit 0.** Read the output for `💥` and `❌`
lines; never treat the exit code as success.

### Diff noise on Route B — expected, not a bug

The scripts regenerate everything from the whole export page every run, so your diff can contain
other people's work. Two observed modes:

1. **An unrelated asset appears** — someone else's component, mid-publishing on the same page, shows
   up as a stray `.svg` plus a map entry.
2. **An existing asset silently disappears from the map** — someone deleted its component from the
   export page since `main`'s map was last generated, so the regenerated map omits it. This should
   never happen deliberately (both pages are permanent catalogues) but it has happened: 103 icon
   SVGs sit on disk with no map entry and no component on the page. Guard B catches it.

Fix: restore the map from `origin/main`, delete stray SVGs that are not yours, then re-add your own
entry with `add-asset.mjs`.

```bash
git diff packages/ui/src/components/icon-v2/icon-name-map.ts
git show origin/main:packages/ui/src/components/icon-v2/icon-name-map.ts | grep <other-asset>
git checkout origin/main -- packages/ui/src/components/icon-v2/icon-name-map.ts
```

---

## Jira

**Accepted projects: `UUI`, `CODE`, `ENGOPS`. `XD` is rejected by `messageCheck`** — firm rule, even
though `XD` is the natural home for design-system tickets. Canary tickets live in **`UUI`
("Unified 3.0")**.

### Verified working values (2026-10-06, from publishing UUI-4033)

Saves rediscovering these. All confirmed by a real end-to-end run.

| Thing | Value |
|---|---|
| Jira `cloudId` | `85cd207b-0617-4d47-81a2-6cd6e902ca59` |
| `FF Added` field | `customfield_10785`; option `No` = id `10911` |
| Setting it on create | `additional_fields: {"FF Added": "No"}` — resolves by name, no lookup needed |
| Transition 1 | name `In Progress` (id 551) → status **In Progress** |
| Transition 2 | name `Review` (id 441) → status **Under Review** |
| Issue type | **`Task`** (id `10101`) |
| Summary pattern | **`<type>: [<KEY>]: <description>`** — same format as the PR title, e.g. `feat: [UUI-4033]: Add ai-evals icon` |

**The summary embeds the ticket's own key, so creation is two steps:** create with a bare summary
(`Add ai-evals icon`) plus `FF Added`, then edit the summary to the full form using the returned key.

**Ignore the older icon tickets as precedent.** UUI-3837 / UUI-3854 / UUI-3855 are type `Story` with
bare summaries — the superseded convention. Searching for precedent and copying it gives the wrong
type *and* the wrong summary.

**Changing issue type preserves `FF Added`** — verified on UUI-4033 (Story → Task kept
`customfield_10785 = No`). Still worth re-reading the field after any type change, since Jira drops
fields that are absent from the new type's screen.

**Two Atlassian MCP servers may be connected at once, and only one works.** One returns
**403 "The app is not installed on this instance"** for every Jira call while still answering
`atlassianUserInfo` — which makes it look authenticated. If Jira 403s, check whether a second
Atlassian server is available and retry against that one before concluding Jira is unreachable.

### Harness Code PR creation (verified)

```
harness_create(resource_type='pull_request',
  org_id='PROD', project_id='Harness_Commons',
  params={repo_id: 'canary'},
  body={title, source_branch, target_branch, description})
```

An empty result from `harness_list(resource_type='repository', search_term=...)` is a **scope**
problem, not a credential one — pass `org_id` and `project_id` explicitly. Do not conclude the
Harness integration is broken from an empty list alone.

Open a PR as a **draft** with `is_draft: true` in the body. A draft is on the remote but not
requesting review.

**`harness_update` on a pull request requires `title` even when you only want to change the
description** — omitting it fails with `Pull request title can't be empty`. Send both fields.

### PR comments — three gotchas, all hit for real

| Task | Correct call |
|---|---|
| **Read** comments | `harness_list(resource_type='pr_activity', filters={type: ['comment','code-comment']})` — **not** `pr_comment`, which is write-only |
| **Reply** in a thread | `harness_create(resource_type='pr_comment', body={parent_id: <id>, text: '...'})` |
| **Resolve** a thread | `harness_execute(resource_type='pr_comment', action='resolve', org_id, project_id, params={repo_id, pr_number, comment_id})` |

1. **`parent_id` belongs in `body`, not `params`.** Putting it in `params` is silently ignored and
   your reply posts as a **new top-level comment** instead of threading. The response shows
   `parent_id: null` — check for that rather than assuming it threaded.

2. **`resolve` / `unresolve` do not accept a PR URL.** Unlike `harness_list`, they will not extract
   identifiers from `url` and return a bare **`Not Found`**. Pass `repo_id`, `pr_number` and
   `comment_id` explicitly, plus `org_id` / `project_id`.

3. **`comment_id` must be the thread parent.** A reply id is rejected with
   `Can't change status of replies.` Take an id from `pr_activity` whose `parent_id` is `null`.

**Unresolved comments block merge**, including any stray top-level comment you posted by accident.
If you cannot delete one (a decline is authoritative — do not retry), **resolve** it so it stops
blocking, and tell the user it is still there.

**`FF Added` is a required custom field** on Story-type tickets. Set it to `No` at creation time. If
empty, CI fails with:

```
ERROR: The JIRA field 'FF Added' has not been updated. Please ensure that 'FF Added' is updated before proceeding
```

If the issue type is not `Story`, the required field may differ — read the exact field name from the
`ERROR:` line in the CI log rather than guessing.

**There may be no literal "Dev Complete" status.** Observed in `UUI`: transition `To Do → In
Progress` first, then to whichever status represents "code done, in review" (observed: `Review`,
landing at `Under Review`). This is workflow configuration and differs per project — verify against
the actual transitions rather than assuming. Jira's dev-panel automation may also advance the ticket
on its own once a commit containing the ticket key is linked to the PR (observed moving
`Under Review → PR Test` unprompted).

**If the Jira or Harness integration returns empty lists or `Not Found`** for something you know
exists, the credential is scoped to the wrong account. The MCP's account is a separate concern from
your browser login — you can be correctly logged in while the integration points at a different,
empty account. This is not fixable by retrying; it needs an admin to repoint the API key. Do that one
step by hand in the browser meanwhile.

---

## CI — `messageCheck`

PR title format is strictly enforced:

```
<type>: [<TICKET-KEY>]: <description>
```

Accepted types: `feat` `fix` `techdebt` `hotfixpreqa` `chore`. **`docs` is rejected** — use `chore`
for docs-only changes.

### Re-running a failed check

Fix the underlying cause, then comment `trigger messagecheck` (lowercase) as a **fresh, top-level
comment on the PR's main Conversation feed**. Replies inside a review or code-comment thread are not
picked up by the trigger listener.

Each such comment counts as an unresolved comment, which blocks merge. Resolve them once checks pass.

### When neither Re-run nor the comment trigger starts a build

A real failure mode, and it happens **silently** — no error, just no new execution.

- The manual **Re-run** button can return 403 `core_template_access` when it tries to resume a
  bundle of stages (e.g. `messageCheck | gitLeaks | ...`) and your account lacks template-read
  access to one of them, even with permission to run the pipeline itself.
- The `trigger messagecheck` comment hits the same authorization path internally and fails the same
  way, but with no visible error at all. Compare the Checks tab timestamp against when you posted.

**Reliable workaround — push a new commit.** A fresh commit fires the same webhook that created the
original run and does not need the blocked permission:

```bash
git commit --allow-empty -m "chore: [<TICKET-KEY>]: retrigger PR checks"
git push origin <branch>
```

Confirm a genuinely new execution appeared — new build ID *and* a current timestamp.

Root-cause fix if it recurs: ask a pipeline admin to grant `core_template_access` on the template
named in the 403.

---

## Merge conflicts

**Name-map conflicts are the most common problem**, since every asset PR touches the same generated
files. Keep **both** your entry and whatever landed on `main` — never take one side wholesale. Then
confirm nothing else silently vanished.

For logos, fix **both** `logo-name-map.ts` and `symbol-name-map.ts`. Fixing only one produces a logo
that works in `LogoV2` and is missing from `LogoSymbol`. Afterwards each file must show exactly one
import and one entry for your name.

```bash
grep -n "<name>" packages/ui/src/components/logo-v2/logo-name-map.ts
grep -n "<name>" packages/ui/src/components/logo-v2/symbol-name-map.ts
```

### Other git issues

| Symptom | Fix |
|---|---|
| `cannot rebase: Your index contains uncommitted changes` | Check both columns of `git status --short` (staged vs unstaged). Usual culprits are build artifacts or auto-generated token files a tool staged. Inspect before unstaging — do not blanket `git clean` with hundreds of files staged. The worktree approach avoids this entirely. |
| `git worktree add` permission denied | It writes outside the repo directory. Needs a one-time filesystem permission grant, or run the command yourself. |

---

## Other checks

- **Perceptual-diff / visual-regression failure — expect this on every asset PR.** Adding an asset
  shifts the icon/logo gallery snapshot, so `canaryUiPerceptualDiffCheck-Perceptual_Diff` fails.
  Confirmed on PR #11430 (`ai-evals`): it is `required: false`, so it does **not** block merge while
  all six required checks pass. Do not try to fix it inside an asset PR. If it ever becomes
  required, the baseline needs updating — coordinate with the visual-test suite owner.

  For reference, the six **required** checks on a canary asset PR, all of which must pass:
  `Harness0-messageCheck`, and `canaryUiPrChecks` stages `Build`, `Lint`, `Prettier`, `Test`,
  `Typecheck`.
- **Pre-existing failures on `main`**: run the same check against a clean `main` checkout. If it
  fails there too, it is not yours to fix.
- **A dependency fails to resolve on `pnpm install` or the dev server**: usually a pnpm hoisting
  issue rather than a missing install. Adding it as a direct dependency of the consuming package
  usually fixes it, but treat that as separate infra work — do not bundle it into an asset PR.

---

## After merge

- Move the ticket to its final state.
- `git worktree remove ../canary-<name>-<icon|logo>` (does not delete the branch).
- Confirm it actually landed on `main` — especially if the PR was closed as a duplicate because a
  sibling PR carried the commit:

  ```bash
  git fetch origin
  git show origin/main:packages/ui/src/components/icon-v2/icon-name-map.ts | grep <name>
  ```

- Verify it **renders** in the preview app (`pnpm dev` in `apps/design-system`), not merely that the
  file exists.
- **Logos: leave the component on `brands-to-dev`.** It is the permanent catalog; the next export
  drops anything removed from it. **The same is true of `icons-to-dev`** — despite older docs saying
  icons are cleaned off it after merge. They are not, and removing one breaks its consumers.
