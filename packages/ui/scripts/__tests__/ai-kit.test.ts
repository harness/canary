import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const repoRoot = resolve(__dirname, '../../../..')
const pkgDir = resolve(__dirname, '../..')
const read = (file: string): string => readFileSync(file, 'utf8')

const { initAi, mergeSettings, mergeClaudeMd, claudeMdBlock } = require(resolve(pkgDir, 'bin/harnessio-ui.cjs'))
const { readTypes, componentNames } = require(resolve(pkgDir, 'scripts/ai/lib-exports.cjs'))
const dsConfig = require(resolve(pkgDir, 'eslint/ds-prototyping.js'))

const hasDist = existsSync(resolve(pkgDir, 'dist/components.d.ts'))
// Set DS_KIT_REQUIRE_DIST=1 in a pipeline that builds first, so a missing build fails instead of skipping.
const requireDist = process.env.DS_KIT_REQUIRE_DIST === '1'

describe('ai kit: copies stay in sync with canary', () => {
  it('eslint/rules.js matches the root eslint/rules.js', () => {
    expect(read(resolve(pkgDir, 'eslint/rules.js'))).toBe(read(resolve(repoRoot, 'eslint/rules.js')))
  })

  it('docs/DESIGN.md matches the root DESIGN.md', () => {
    expect(read(resolve(pkgDir, 'docs/DESIGN.md'))).toBe(read(resolve(repoRoot, 'DESIGN.md')))
  })

  it.skipIf(!hasDist && !requireDist)('forbidden-element messages name components the package exports', () => {
    const available = new Set<string>(componentNames(readTypes(pkgDir)))
    const forbid: { element: string; message: string }[] = dsConfig.rules['react/forbid-elements'][1].forbid
    for (const { element, message } of forbid) {
      const named = (message.replace('@harnessio/ui/components', '').match(/\b[A-Z][A-Za-z0-9]+\b/g) ?? []).filter(
        n => n !== 'Use'
      )
      expect(named.length, `<${element}> names no component`).toBeGreaterThan(0)
      for (const name of named) expect(available.has(name), `<${element}> names ${name}`).toBe(true)
    }
  })
})

describe('ai kit: published package', () => {
  const pkg = JSON.parse(read(resolve(pkgDir, 'package.json')))

  it('lists every shipped path in files, and each exists', () => {
    const shipped = ['.claude/skills', 'docs/system', 'docs/components-index.md', 'docs/DESIGN.md', 'eslint', 'bin']
    for (const entry of shipped) {
      expect(pkg.files, entry).toContain(entry)
      expect(existsSync(resolve(pkgDir, entry)), entry).toBe(true)
    }
    expect(existsSync(resolve(pkgDir, pkg.bin['harnessio-ui']))).toBe(true)
    expect(existsSync(resolve(pkgDir, pkg.exports['./eslint']))).toBe(true)
  })

  it('skill references only files the package ships', () => {
    const skill = read(resolve(pkgDir, '.claude/skills/design-system/SKILL.md'))
    const refs = [...skill.matchAll(/`((?:docs|eslint)\/[^`*]+\.(?:md|js))`/g)].map(m => m[1])
    expect(refs.length).toBeGreaterThan(0)
    for (const ref of refs) expect(existsSync(resolve(pkgDir, ref)), ref).toBe(true)
  })

  it('system docs do not reference manifests or files outside the package', () => {
    const dir = resolve(pkgDir, 'docs/system')
    for (const file of readdirSync(dir)) {
      expect(read(join(dir, file)), file).not.toMatch(/manifest|ds-check|packages\/ui\/AGENTS\.md/i)
    }
  })
})

describe('init-ai', () => {
  const tmp: string[] = []
  const installed = ['.claude/settings.json', '.claude/skills/design-system/SKILL.md', 'CLAUDE.md']

  const makeProject = (): string => {
    const dir = mkdtempSync(join(tmpdir(), 'init-ai-'))
    tmp.push(dir)
    mkdirSync(join(dir, 'node_modules', '@harnessio'), { recursive: true })
    symlinkSync(pkgDir, join(dir, 'node_modules', '@harnessio', 'ui'))
    return dir
  }
  const run = (cwd: string): void => void initAi({ cwd, log: () => {} })

  afterEach(() => {
    for (const d of tmp.splice(0)) rmSync(d, { recursive: true, force: true })
  })

  it('writes the hook, skill and CLAUDE.md block, and is idempotent', () => {
    const cwd = makeProject()
    run(cwd)
    const first = installed.map(f => read(join(cwd, f)))
    expect(JSON.parse(first[0]).hooks.PostToolUse[0].hooks[0].command).toBe(
      'node "$CLAUDE_PROJECT_DIR/node_modules/@harnessio/ui/eslint/post-edit-lint.js"'
    )
    run(cwd)
    expect(installed.map(f => read(join(cwd, f)))).toEqual(first)
  })

  it('points the installed skill at paths inside node_modules', () => {
    const cwd = makeProject()
    run(cwd)
    const skill = read(join(cwd, '.claude/skills/design-system/SKILL.md'))
    expect(skill).not.toMatch(/`(docs|eslint)\//)
    expect(skill).toContain('`node_modules/@harnessio/ui/docs/components-index.md`')
    expect(existsSync(join(cwd, 'node_modules/@harnessio/ui/docs/components-index.md'))).toBe(true)
  })

  it('keeps existing settings, hooks and CLAUDE.md content', () => {
    const cwd = makeProject()
    mkdirSync(join(cwd, '.claude'))
    const other = { matcher: 'Bash', hooks: [{ type: 'command', command: 'echo hi' }] }
    writeFileSync(
      join(cwd, '.claude/settings.json'),
      JSON.stringify({ permissions: { allow: ['Bash(ls)'] }, hooks: { PostToolUse: [other] } })
    )
    writeFileSync(join(cwd, 'CLAUDE.md'), '# My project\n\nExisting rules.\n')
    run(cwd)
    const settings = JSON.parse(read(join(cwd, '.claude/settings.json')))
    expect(settings.permissions.allow).toEqual(['Bash(ls)'])
    expect(settings.hooks.PostToolUse[0]).toEqual(other)
    expect(settings.hooks.PostToolUse).toHaveLength(2)
    const md = read(join(cwd, 'CLAUDE.md'))
    expect(md).toContain('Existing rules.')
    expect(md).toContain('read `.claude/skills/design-system/SKILL.md`')
  })

  it('refuses to touch invalid settings.json', () => {
    const cwd = makeProject()
    mkdirSync(join(cwd, '.claude'))
    writeFileSync(join(cwd, '.claude/settings.json'), '{ not json')
    expect(() => run(cwd)).toThrow(/not valid JSON/)
    expect(existsSync(join(cwd, 'CLAUDE.md'))).toBe(false)
  })

  it('fails when the package is not installed', () => {
    const dir = mkdtempSync(join(tmpdir(), 'init-ai-empty-'))
    tmp.push(dir)
    expect(() => run(dir)).toThrow(/not installed/)
  })

  it('--dry-run writes nothing', () => {
    const cwd = makeProject()
    initAi({ cwd, dryRun: true, log: () => {} })
    expect(existsSync(join(cwd, '.claude'))).toBe(false)
    expect(existsSync(join(cwd, 'CLAUDE.md'))).toBe(false)
  })

  it('merge helpers replace their own entries in place', () => {
    const a = mergeSettings(null, 'node "$CLAUDE_PROJECT_DIR/a/@harnessio/ui/eslint/post-edit-lint.js"')
    const b = mergeSettings(a, 'node "$CLAUDE_PROJECT_DIR/b/@harnessio/ui/eslint/post-edit-lint.js"')
    expect(b.hooks.PostToolUse).toHaveLength(1)
    expect(b.hooks.PostToolUse[0].hooks[0].command).toContain('/b/')
    const md = mergeClaudeMd(mergeClaudeMd('# x\n', claudeMdBlock('old')), claudeMdBlock('new'))
    expect(md.match(/harnessio-ui:design-system:start/g)).toHaveLength(1)
    expect(md).toContain('new/dist/components.d.ts')
    expect(md).not.toContain('old/dist')
  })

  it('bin exits 0 with no subcommand and non-zero with an unknown one', () => {
    const bin = resolve(pkgDir, 'bin/harnessio-ui.cjs')
    expect(() => execFileSync('node', [bin], { stdio: 'pipe' })).not.toThrow()
    expect(() => execFileSync('node', [bin, 'nope'], { stdio: 'pipe' })).toThrow()
  })
})
