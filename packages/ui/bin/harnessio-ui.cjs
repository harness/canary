#!/usr/bin/env node
// CLI for @harnessio/ui. One subcommand today:
//
//   npx harnessio-ui init-ai [--dry-run]
//
// Wires Claude Code in the current project to the design-system rules shipped in this package:
//   1. .claude/settings.json  PostToolUse hook that lints every .ts/.tsx Claude writes
//   2. .claude/skills/design-system/SKILL.md  the workflow, with paths pointing at node_modules
//   3. CLAUDE.md  a marked block that makes reading the skill unconditional
// Safe to re-run: it updates what it owns and leaves everything else alone. It never installs
// anything; it prints the install command for missing lint dependencies.
const fs = require('fs')
const path = require('path')

const PKG_NAME = '@harnessio/ui'
const HOOK_SCRIPT = 'eslint/post-edit-lint.js'
const LINT_DEPENDENCIES = ['eslint', 'eslint-plugin-react', 'eslint-plugin-tailwindcss', '@typescript-eslint/parser']
const BLOCK_START = '<!-- harnessio-ui:design-system:start -->'
const BLOCK_END = '<!-- harnessio-ui:design-system:end -->'

const readIfExists = file => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null)

function findInstalledPackage(cwd) {
  for (let dir = path.resolve(cwd); ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, 'node_modules', PKG_NAME)
    if (fs.existsSync(path.join(candidate, 'package.json'))) return candidate
    if (path.dirname(dir) === dir) return null
  }
}

// Path of the installed package as the hook and skill should refer to it: relative to the
// project root, so the committed settings file works on every machine.
function packageRef(cwd, pkgDir) {
  return path.relative(path.resolve(cwd), pkgDir).split(path.sep).join('/')
}

function hookCommand(ref) {
  return `node "$CLAUDE_PROJECT_DIR/${ref}/${HOOK_SCRIPT}"`
}

function isOurHook(hook) {
  return typeof hook?.command === 'string' && hook.command.includes(`${PKG_NAME}/${HOOK_SCRIPT}`)
}

function mergeSettings(existing, command) {
  const settings = existing ?? {}
  const hooks = (settings.hooks = settings.hooks ?? {})
  const groups = (hooks.PostToolUse = hooks.PostToolUse ?? [])
  const entry = { type: 'command', command, timeout: 60, statusMessage: 'Checking design-system rules...' }
  for (const group of groups) {
    const index = (group.hooks ?? []).findIndex(isOurHook)
    if (index !== -1) {
      group.hooks[index] = entry
      return settings
    }
  }
  groups.push({ matcher: 'Write|Edit', hooks: [entry] })
  return settings
}

// The skill is written against paths inside the package (`docs/...`, `eslint/...`). In a
// consuming project those live under node_modules, so rewrite the backtick-quoted references.
function rewriteSkillPaths(skill, ref) {
  return skill.replace(/`(docs|eslint)\//g, (_, dir) => `\`${ref}/${dir}/`)
}

function claudeMdBlock(ref) {
  return [
    BLOCK_START,
    '## Design system',
    'Before writing or editing any UI, read `.claude/skills/design-system/SKILL.md`.',
    `Use only components and props that exist in \`${ref}/dist/components.d.ts\`.`,
    'No hard-coded colours, no className/style overrides on design-system components.',
    'Run `tsc --noEmit` before finishing.',
    BLOCK_END
  ].join('\n')
}

function mergeClaudeMd(existing, block) {
  if (existing === null) return `${block}\n`
  const start = existing.indexOf(BLOCK_START)
  const end = existing.indexOf(BLOCK_END)
  if (start !== -1 && end > start) return existing.slice(0, start) + block + existing.slice(end + BLOCK_END.length)
  return `${existing.replace(/\s*$/, '')}\n\n${block}\n`
}

function missingDependencies(cwd) {
  return LINT_DEPENDENCIES.filter(name => {
    try {
      require.resolve(name, { paths: [path.resolve(cwd)] })
      return false
    } catch {
      return true
    }
  })
}

function initAi({ cwd = process.cwd(), dryRun = false, log = console.log } = {}) {
  const pkgDir = findInstalledPackage(cwd)
  if (!pkgDir) throw new Error(`${PKG_NAME} is not installed in ${cwd} or a parent directory. Install it first.`)
  const ref = packageRef(cwd, pkgDir)
  const writes = []

  const settingsFile = path.join(cwd, '.claude', 'settings.json')
  const settingsText = readIfExists(settingsFile)
  let existing = null
  try {
    existing = settingsText === null ? null : JSON.parse(settingsText)
  } catch (e) {
    throw new Error(`${settingsFile} is not valid JSON (${e.message}). Fix it, then re-run; nothing was changed.`)
  }
  writes.push([settingsFile, `${JSON.stringify(mergeSettings(existing, hookCommand(ref)), null, 2)}\n`])

  const skillFile = path.join(cwd, '.claude', 'skills', 'design-system', 'SKILL.md')
  const skill = fs.readFileSync(path.join(pkgDir, '.claude', 'skills', 'design-system', 'SKILL.md'), 'utf8')
  writes.push([skillFile, rewriteSkillPaths(skill, ref)])

  const claudeMdFile = path.join(cwd, 'CLAUDE.md')
  writes.push([claudeMdFile, mergeClaudeMd(readIfExists(claudeMdFile), claudeMdBlock(ref))])

  for (const [file, content] of writes) {
    const rel = path.relative(cwd, file)
    if (readIfExists(file) === content) {
      log(`unchanged  ${rel}`)
      continue
    }
    log(`${dryRun ? 'would write' : 'wrote'}  ${rel}`)
    if (dryRun) continue
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }

  const missing = missingDependencies(cwd)
  if (missing.length > 0) {
    log(`\nThe lint hook needs dev dependencies that are not installed: ${missing.join(', ')}`)
    log(`Install them (eslint must be version 8): npm install -D ${missing.map(n => (n === 'eslint' ? 'eslint@8' : n)).join(' ')}`)
  }
  log('\nOpen /hooks once, or restart Claude Code, so it picks up the new hook.')
  log('Your tailwind.config must use the @harnessio/ui preset, or the class checks cannot tell which classes exist.')
  return { pkgDir, ref, missing }
}

function main(argv) {
  const [command, ...flags] = argv
  if (command !== 'init-ai') {
    console.error('usage: harnessio-ui init-ai [--dry-run]')
    process.exit(command ? 2 : 0)
  }
  try {
    initAi({ dryRun: flags.includes('--dry-run') })
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}

if (require.main === module) main(process.argv.slice(2))

module.exports = { initAi, mergeSettings, mergeClaudeMd, rewriteSkillPaths, hookCommand, claudeMdBlock }
