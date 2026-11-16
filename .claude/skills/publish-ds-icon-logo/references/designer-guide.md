# Publishing a new icon or logo: designer guide

This guide takes you from a finished Figma design to a merged pull request in canary. You have **view-only** access to the main Figma file, and that stays the same. You never need a Figma token.

The flow in one line: **build on a Figma branch, lint it with the HDS Icon & Logo Lint plugin, an admin re-lints and merges it into main, then you run the publish skill against main.**

## Prerequisites

Set these up once before your first icon or logo:

- [ ] **Figma access:** view access to the HDS Icons 3.0 file, and permission to create branches in it.
- [ ] **HDS Icon & Logo Lint plugin:** installed from the Harness Figma org plugins (Plugins, then Harness org).
- [ ] **Claude Code or Cursor:** installed and signed in.
- [ ] **Official Figma MCP:** connected in your tool. No Figma token is needed.
- [ ] **Canary repo:** cloned locally, with `pnpm install` run once.
- [ ] **Git access:** you can push branches to the canary repo on Harness Code.
- [ ] **Harness and Jira access:** so the skill can create the ticket and open the PR (Harness MCP and Atlassian MCP connected).
- [ ] **A reviewing admin:** know who will review your Figma branch (Jared, Katie, Igor or Aaron).

## Who does what

| Step | Who | Tool |
| --- | --- | --- |
| Build the icon/logo on a Figma branch | You (designer) | Figma |
| Self-lint the branch | You | Lint plugin |
| Re-lint as the gate, review by eye, merge into main | An admin: Jared, Katie, Igor or Aaron | Lint plugin |
| Run the publish skill, open the Jira ticket and PR | You | Claude Code or Cursor |
| Review and approve the PR | A canary code reviewer | Harness Code |
| Merge the PR | You | Harness Code |

---

## Part 1: Design it in Figma

1. Open the **HDS Icons 3.0** file (file key `NYeN8I4D3anR9it8ds0lyr`).
2. Create a **Figma branch** off main. Name it after the asset, for example `add-<name>-icon`. If main has moved since, **update the branch from main** so the page lists every shipped name.
3. Build the component on the right page:
   - Icons go on `icons-to-dev`.
   - Logos go on `brands-to-dev`.
4. Follow the naming and structure rules in `.claude/skills/publish-ds-icon-logo/references/figma-spec.md`. The most common problems are:
   - the name is wrong or collides with an existing asset (the lint plugin and the publish skill both stop on this)
   - the name differs from an existing one only by where a hyphen sits (`ab-1` vs `ab1`); these clash in code
   - the node is not a `COMPONENT`
   - masks or leftover colour rectangles remain
   - strokes have mixed caps or joins
   - a logo's description is missing its brand hex (for example `#4A154B`)
   - the mark is invisible on its own background
5. Never delete or rename an existing component on these pages. They are the permanent catalogue.

## Part 2: Lint it with the plugin

Run this before you ask for review.

1. In Figma, open **Plugins, then Harness org, then HDS Icon & Logo Lint**.
2. Select your new component and click **Lint selection**. Fix every error.
3. Click **Lint whole page**. This also catches name collisions with assets that already shipped.
4. Click an item in the results to jump to that component.
5. On the whole-page run, warnings on assets that have already shipped are hidden by default so they don't bury your component. The summary says how many are hidden, and a checkbox shows them. Errors always show.
6. If the panel says **Branch may be out of date**, update your branch from main and re-run.
7. Re-run until there are no errors. Warnings are worth reading but do not block you.

## Part 3: Get it reviewed and merged

1. Ask an admin (Jared, Katie, Igor or Aaron) to review your branch.
2. The admin does the following:
   - updates your branch from main
   - runs **Lint whole page** as the gate
   - ticks the plugin's **Admin review** checklist by eye (correct page, name, size, reads well at actual size, no deleted or renamed components)
3. If there are issues, the admin clicks **Copy summary** and pastes the note to you. Fix them, re-lint and ask again.
4. When it is clean, the admin **merges the branch into main**.
5. Wait for the admin to confirm the merge before you continue. The publish skill reads main only, and it will stop if your component is not there yet.

## Part 4: Run the publish skill

You need Claude Code open in the canary repo, with the official **Figma MCP** connected.

1. Start Claude Code (or Cursor's agent) in your canary checkout.
2. Ask it, for example: *"Publish the `<name>` icon to canary"* (or *"publish the `<name>` logo"*). Give it the Figma link to the component on main if you have one.
3. For a logo, have the brand hex ready. It is in the component description in Figma.
4. The skill then does the following without you:
   - confirms the component is on main
   - exports the SVG and a screenshot, read-only
   - runs the parity check
   - adds the asset and updates the name maps (it stops, and undoes its changes, if the name already exists)
   - runs the checks and commits locally
5. If it reports that the component is not on main, stop and go back to Part 3.

## Part 5: Approve the Jira ticket and PR

The skill stops here and shows you drafts. **Nothing is created until you approve.**

1. Read the diff summary, the screenshot, the drafted Jira ticket and the drafted PR.
2. Check:
   - the title looks like `feat: [UUI-1234]: Add <name> icon`
   - the Figma source and the screenshot are right
   - only the expected files changed
3. Reply with your approval, or ask for changes.
4. The skill creates the Jira ticket, pushes the branch and opens the PR. Canary adds the design lead as a reviewer automatically.

## Part 6: Merge

1. Wait for CI to go green and for a code reviewer to approve. Chasing the review is your job.
2. Once approved, **you merge the PR**.
3. After merge, check the asset shows up in the design-system preview.

## If something goes wrong

| Symptom | What to do |
| --- | --- |
| "Component not on main" | Your Figma branch has not been merged. Ask an admin. |
| Plugin reports an error | Fix it in Figma and re-run. The message names the component and the rule. |
| Parity check fails | Stop. Tell a canary maintainer. Do not work around it. |
| Name already exists, or clashes with another name | Pick a different name, or check whether the asset is already published. The lint plugin should have caught this on your branch. |
| CI fails | Open the failing check. If it is not obviously yours, ask in the design-system channel. |
| The plugin is missing or will not run | See Appendix A. |
| You do not have the Figma MCP | See Appendix B. |

Details for maintainers are in `.claude/skills/publish-ds-icon-logo/SKILL.md` and `references/troubleshooting.md`.

---

## Appendix: backup workflows

Use these only when the main workflow is blocked.

### A. Lint without the plugin (command line)

Use this if the plugin is not available to you or will not run. The command line runs the same rules as the plugin.

1. In Claude Code with the Figma tools connected, dump the export page's components to a JSON file. Use the snippet in Step 2 of `.claude/skills/publish-ds-icon-logo/SKILL.md`.
2. In your canary checkout, run:

   ```bash
   node .claude/skills/publish-ds-icon-logo/scripts/lint-page.mjs --in page.json
   ```

3. Add `--only <name>` to check one component, or `--quiet` to show errors only.
4. The admin checklist from Part 3 still applies. The admin does it by eye, since the command line has no checklist.

### B. You have no Figma MCP

Ask an admin to run the publish skill for you from Part 4. You still build and lint the component yourself, and you still approve the drafted ticket and PR with them.

### C. Using Cursor instead of Claude Code

The skill works in Cursor. Enable the official Figma MCP, and make sure the agent can read `.claude/skills/publish-ds-icon-logo/SKILL.md`. Everything else is the same.

### D. Publishing before the branch is merged (maintainers only)

If the component must ship before its Figma branch can merge into main, a maintainer can use the bridge route in `.claude/skills/publish-ds-icon-logo/SKILL.md` (Route A). It reads the branch instead of main and needs a plugin page dump. Do not use it as a shortcut around admin review.
