import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

import { describe, expect, it } from 'vitest'

const PACKAGE_ROOT = path.resolve(__dirname, '../..')
const SCRIPT_PATH = path.resolve(__dirname, '../ds-check.ts')

/**
 * Run ds-check with given flags and return exit code + output
 */
function runDsCheck(flags: string[] = []): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn('tsx', [SCRIPT_PATH, ...flags], { cwd: PACKAGE_ROOT })
    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', data => {
      stdout += data.toString()
    })

    proc.stderr.on('data', data => {
      stderr += data.toString()
    })

    proc.on('error', reject)

    proc.on('close', exitCode => {
      resolve({ exitCode: exitCode ?? 0, stdout, stderr })
    })
  })
}

const STATUS_BADGE_MANIFEST = path.resolve(PACKAGE_ROOT, 'schemas/status-badge.manifest.json')

/**
 * Run `body` against a throwaway manifest derived from status-badge, so a test can
 * inject a defect without mutating the real manifest.
 *
 * The probe inherits status-badge's `code.path` and `governance.rulesDocs`, so
 * `--source` resolves a real component and `--refs` resolves real docs — only the
 * injected defect should fail. Both the probe manifest and any spec generated for
 * it are removed in a `finally`, so a failing assertion cannot leave the repo dirty.
 */
async function withProbeManifest(
  name: string,
  mutate: (manifest: Record<string, any>) => void,
  body: (manifestPath: string) => Promise<void>
): Promise<void> {
  const manifestPath = path.resolve(PACKAGE_ROOT, `schemas/${name}.manifest.json`)
  const specPath = path.resolve(PACKAGE_ROOT, `schemas/${name}.openapi.json`)

  const manifest = JSON.parse(fs.readFileSync(STATUS_BADGE_MANIFEST, 'utf-8'))
  manifest.id = `canary.${name}`
  mutate(manifest)
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  try {
    await body(manifestPath)
  } finally {
    for (const file of [manifestPath, specPath]) {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    }
  }
}

describe('ds-check', () => {
  describe('parseArgs', () => {
    it('should run all checks with no flags', async () => {
      const result = await runDsCheck([])
      // Should pass for status-badge and exit with 0
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('status-badge')
      expect(result.stdout).toContain('✅')
    })

    it('should run only schema check with --schema flag', async () => {
      const result = await runDsCheck(['--schema'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('status-badge')
    })

    it('should run only refs check with --refs flag', async () => {
      const result = await runDsCheck(['--refs'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('registry.json')
    })

    it('should run only code check with --code flag', async () => {
      const result = await runDsCheck(['--code'])
      expect(result.exitCode).toBe(0)
    })

    it('should run only source check with --source flag', async () => {
      const result = await runDsCheck(['--source'])
      expect(result.exitCode).toBe(0)
    })

    it('should run only generated check with --generated flag', async () => {
      const result = await runDsCheck(['--generated'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('status-badge')
    })

    it('should combine multiple flags', async () => {
      const result = await runDsCheck(['--schema', '--refs', '--code'])
      expect(result.exitCode).toBe(0)
    })

    it('should reject unknown flags with exit 1', async () => {
      const result = await runDsCheck(['--unknown-flag'])
      expect(result.exitCode).toBe(1)
    })

    it('should reject combinations with unknown flags', async () => {
      const result = await runDsCheck(['--schema', '--invalid-thing'])
      expect(result.exitCode).toBe(1)
    })
  })

  describe('validation checks', () => {
    it('should validate schema structure', async () => {
      const result = await runDsCheck(['--schema'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('status-badge')
    })

    it('should detect stale OpenAPI specs with --generated', async () => {
      await withProbeManifest(
        'drift-probe',
        () => {},
        async manifestPath => {
          // Seed a spec that matches the probe manifest, and confirm it reads as fresh
          expect((await runDsCheck(['--write'])).exitCode).toBe(0)
          expect((await runDsCheck(['--generated'])).exitCode).toBe(0)

          // Add a prop so the on-disk spec no longer matches the manifest
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          manifest.props.shared.push({ name: 'driftProbe', type: 'string', default: 'x' })
          fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

          const result = await runDsCheck(['--generated'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('generated spec is stale')
        }
      )
    })

    it('should detect enum mismatches with --source', async () => {
      await withProbeManifest(
        'enum-probe',
        manifest => {
          // Declare a variant the component's CVA definition does not have
          const variant = manifest.props.shared.find((prop: { name: string }) => prop.name === 'variant')
          variant.values.push('notARealVariant')
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('source prop validation failed')
          expect(result.stdout + result.stderr).toContain('notARealVariant')
        }
      )
    })

    it('should pass --source when manifest enums match the CVA source', async () => {
      const result = await runDsCheck(['--source'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('✅ status-badge')
    })

    it('should validate registry paths with --refs', async () => {
      const result = await runDsCheck(['--refs'])
      // Should check that all paths in registry.json exist
      expect(result.exitCode).toBe(0)
    })

    it('should validate code paths with --code', async () => {
      const result = await runDsCheck(['--code'])
      expect(result.exitCode).toBe(0)
    })

    it('should pass when all checks succeed', async () => {
      const result = await runDsCheck(['--schema', '--refs', '--code', '--source', '--generated'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('✅ status-badge')
      expect(result.stdout).toContain('0 failed')
    })
  })

  describe('error handling', () => {
    it('should handle broken rulesDocs paths', async () => {
      await withProbeManifest(
        'refs-probe',
        manifest => {
          manifest.governance.rulesDocs = ['docs/system/this-file-does-not-exist.md']
        },
        async () => {
          const result = await runDsCheck(['--refs'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('non-existent file')
          expect(result.stdout + result.stderr).toContain('this-file-does-not-exist.md')
        }
      )
    })

    it('should pass --refs when rulesDocs all resolve', async () => {
      const result = await runDsCheck(['--refs'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('✅ status-badge')
    })

    it('should report errors in readable format', async () => {
      // Create a broken manifest to test error reporting
      const brokenManifestPath = path.resolve(PACKAGE_ROOT, 'schemas/broken.manifest.json')
      const brokenContent = JSON.stringify({
        id: 'canary.broken',
        name: 'Broken'
        // missing required fields: description, props, governance
      })
      fs.writeFileSync(brokenManifestPath, brokenContent)

      try {
        const result = await runDsCheck(['--schema'])
        expect(result.exitCode).toBe(1)
        expect(result.stderr || result.stdout).toContain('❌')
      } finally {
        // Cleanup
        if (fs.existsSync(brokenManifestPath)) {
          fs.unlinkSync(brokenManifestPath)
        }
      }
    })

    it('should validate registry integrity', async () => {
      const result = await runDsCheck(['--refs'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('registry.json')
    })
  })

  describe('exit codes', () => {
    it('should exit 0 when all checks pass', async () => {
      const result = await runDsCheck(['--schema'])
      expect(result.exitCode).toBe(0)
    })

    it('should exit 1 on unknown flag', async () => {
      const result = await runDsCheck(['--invalid-flag-xyz'])
      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain('Unknown flag')
    })

    it('should exit 1 on unknown flag mixed with valid flags', async () => {
      const result = await runDsCheck(['--schema', '--bad-flag'])
      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain('Unknown flag')
    })

    it('should report valid flags when given invalid flag', async () => {
      const result = await runDsCheck(['--nope'])
      expect(result.exitCode).toBe(1)
      expect(result.stderr).toContain('Valid flags')
      expect(result.stderr).toContain('--schema')
    })
  })

  describe('status-badge manifest', () => {
    it('should pass all checks for status-badge', async () => {
      const result = await runDsCheck(['--schema', '--refs', '--code', '--source', '--generated'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('✅ status-badge')
      expect(result.stdout).toContain('0 failed')
    })

    it('should have valid schema', async () => {
      const manifestPath = path.resolve(PACKAGE_ROOT, 'schemas/status-badge.manifest.json')
      expect(fs.existsSync(manifestPath)).toBe(true)

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      expect(manifest.id).toBe('canary.status-badge')
    })

    it('should have fresh OpenAPI spec', async () => {
      const specPath = path.resolve(PACKAGE_ROOT, 'schemas/status-badge.openapi.json')
      expect(fs.existsSync(specPath)).toBe(true)

      const result = await runDsCheck(['--generated'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('status-badge')
    })
  })
})
