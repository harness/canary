#!/usr/bin/env node
// Launcher for the global `assist` command. Plain CommonJS so it needs no build step.
// Runs the Assist code of the canary clone you are standing in. Outside a canary
// clone it refuses to run.
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')

function isCanaryRoot(dir) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    return manifest.name === 'harness-canary' && fs.existsSync(path.join(dir, 'scripts/assist/index.ts'))
  } catch {
    return false
  }
}

function findRoot() {
  let dir = process.cwd()
  for (;;) {
    if (isCanaryRoot(dir)) return dir
    const parent = path.dirname(dir)
    if (parent === dir) return undefined
    dir = parent
  }
}

const root = findRoot()
if (!root) {
  console.error('The "assist" command only works inside the canary repository.')
  console.error('Open your terminal in the canary folder (or any folder inside it) and try again.')
  process.exit(1)
}
const tsx = path.join(root, 'node_modules/.bin/tsx')

if (!fs.existsSync(tsx)) {
  console.log('Setting things up for the first time. This can take a few minutes...')
  const install = spawnSync('pnpm', ['install'], { cwd: root, stdio: 'inherit' })
  if (install.status !== 0) {
    console.error('Setup did not finish. Ask the AI to run "pnpm install" in the canary folder and look at the error.')
    process.exit(install.status || 1)
  }
}

const result = spawnSync(tsx, [path.join(root, 'scripts/assist/index.ts'), ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit'
})
process.exit(result.status ?? 1)
