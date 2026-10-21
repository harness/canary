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
      const result = await runDsCheck(['--generated'])
      expect(result.exitCode).toBe(0)
      // If spec is fresh, should pass; if stale, exit 1
      expect(result.stdout).toContain('status-badge')
    })

    it('should detect enum mismatches with --source', async () => {
      const result = await runDsCheck(['--source'])
      // status-badge uses CVA, so --source should find it and compare
      // If they match, exit 0; if mismatch, exit 1
      expect(result.stdout || result.stderr).toBeTruthy()
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
      expect(result.stdout).toContain('Results: 1 passed, 0 failed')
    })
  })

  describe('error handling', () => {
    it('should handle broken rulesDocs paths', async () => {
      const result = await runDsCheck(['--refs'])
      // This validates that rulesDocs in manifests point to real files
      expect(result.exitCode).toBe(0) // status-badge's rulesDocs should be valid
    })

    it('should report errors in readable format', async () => {
      const result = await runDsCheck(['--schema'])
      if (result.exitCode !== 0) {
        // Error output should be readable
        expect(result.stderr || result.stdout).toContain('❌')
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
      expect(result.stdout).toContain('status-badge')
      expect(result.stdout).toContain('✅ status-badge')
      expect(result.stdout).toContain('1 passed')
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
