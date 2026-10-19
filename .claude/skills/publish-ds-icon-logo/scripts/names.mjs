/**
 * Name helpers shared by every script in this skill.
 *
 * Deliberately dependency-free (no svgo, no liquidjs) so the linter can run
 * from any directory. lib.mjs re-exports these, so there is exactly one
 * definition of each rule.
 *
 * These mirror packages/ui/scripts/{icons,logos}.js. See lib.mjs for why that
 * duplication exists and how parity-check.mjs contains the risk.
 */

/** Figma component name (e.g. `.agent-dlc`) -> on-disk basename (`agent-dlc`). */
export function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^\w\-_.]/g, '')
    .replace(/^\./, '')
    .toLowerCase()
}

/** `agent-dlc.svg` -> `AgentDlc` (the TS import identifier). */
export function toComponentName(filename) {
  return filename
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

/** `agent-dlc.svg` -> `agent-dlc` (the map key consumers use). */
export function toAssetKey(filename) {
  return filename.replace(/\.svg$/, '').toLowerCase()
}

/**
 * The upstream sort. Verified against all three committed maps (534 icons,
 * 181 logos, 181 symbols) — reproduces their exact order, so inserting at the
 * position this implies keeps a future full regen diff-free.
 *
 * Sorts on the FULL filename including `.svg`, which is why `aws-ec2.svg`
 * precedes `aws.svg`.
 */
export function sortFilenames(filenames) {
  return [...filenames].sort((a, b) => a.localeCompare(b))
}

/**
 * The naming rule that actually breaks the build: a dot in the name (node.js)
 * or a leading digit (1password) produces an invalid TypeScript import
 * identifier and typecheck fails.
 */
export const VALID_NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

/** Minimal argv parser: --key value, and --flag for booleans. */
export function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue
    const key = argv[i].slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) {
      out[key] = true
    } else {
      out[key] = next
      i++
    }
  }
  return out
}
