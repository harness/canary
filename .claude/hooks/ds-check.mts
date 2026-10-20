// PostToolUse adapter: runs the shared contract check on the edited file. Logic lives in packages/ui/scripts/ds/check-staged.ts.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8')) as { tool_input?: { file_path?: string } }
const file = input.tool_input?.file_path
if (file) {
  const ui = resolve(import.meta.dirname, '../../packages/ui')
  const result = spawnSync('node', ['scripts/ds/check-staged.ts', file], { cwd: ui, encoding: 'utf8' })
  if (result.status !== 0) {
    process.stderr.write(`${result.stdout}${result.stderr}\npnpm ds:check failed for ${file}. Fix it before continuing.\n`)
    process.exitCode = 2
  }
}
