# Manual stress harness — Canary Copilot plugin

Use this to validate UI interactivity on large frames (Task 16).

## Target

- ~**500** `❖Button` instances on one page
- Check page completes without freezing the plugin UI
- Progress updates appear (“Scanned N instances…”) while the main thread yields

## Setup in Figma Desktop

1. Open a scratch file (or a copy of an HDS Components frame).
2. Place one library `❖Button` instance.
3. Duplicate until you have ~500 instances (select → duplicate in a grid; avoid nesting deeply).
4. Optional: mix in ~50 `❖Badge` / Tag instances.
5. `pnpm --filter @harnessio/figma-plugin build`, then run **Canary Copilot** from Development plugins.

## Run

1. Open the plugin → **Check** tab → **Check page**.
2. Confirm:
   - Spinner / live region updates while scanning
   - Summary chips appear when finished
   - Selecting a finding still scrolls the canvas
3. Time wall-clock from click to summary (document in dogfood notes). Goal: interactive UI throughout; total under a few seconds for ~500 instances after walk starts.

## If the UI freezes

- Main-thread collection should yield every **CHUNK** instances (`CHECK_PROGRESS` messages).
- If freezes persist, lower chunk size in `src/main/collect.ts` (`PROGRESS_CHUNK`) and rebuild.
- Core check of 2k snapshots is covered by `tests/check.perf.test.ts` (&lt; 100ms in Node).

## Cap

Page scans truncate at **2,000** instances (`PAGE_INSTANCE_CAP`) with a warn banner.
