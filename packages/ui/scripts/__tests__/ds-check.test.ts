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

/**
 * These probes are partial manifests pointed at other components, so they exercise the enum
 * check only. The prop-name check, which compares the full prop list, correctly fails them;
 * assert on the enum outcome alone.
 */
function expectNoEnumProblems(output: string): void {
  expect(output).not.toContain('cannot verify enum')
  expect(output).not.toMatch(/props\.(shared|codeOnly) "/)
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

    // --source used to return valid+skipped whenever it could not parse a CVA variants
    // block, printing ✅ for enum claims it had never checked. An unverifiable claim must
    // not be reportable as a verified one.
    it('should fail --source when an enum prop resolves in neither CVA nor the type', async () => {
      await withProbeManifest(
        'unverifiable-probe',
        manifest => {
          // split-button.tsx uses no cva(), and declares no `ghostProp` in its types, so
          // neither source can confirm the manifest's claim.
          manifest.code.path = 'packages/ui/src/components/split-button.tsx'
          manifest.code.export = 'SplitButton'
          manifest.props.shared = [{ name: 'ghostProp', type: 'enum', values: ['a', 'b'], default: 'a' }]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('cannot verify enum props')
          expect(result.stdout + result.stderr).toContain('ghostProp')
        }
      )
    })

    // A CVA key that needs quoting (`'forest-green': 'cn-tag-forest-green'`) was swallowed
    // by the string-literal skip before it could be read as a key, so every hyphenated
    // variant looked absent from the source and a correct manifest failed.
    it('should read a quoted, hyphenated CVA variant key', async () => {
      await withProbeManifest(
        'quoted-key-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/tag.tsx'
          manifest.code.export = 'Tag'
          // Deliberately omits tag.tsx's quoted 'forest-green' key: the drift must be
          // reported against the source, which only happens if the key was parsed.
          manifest.props.shared = [{ name: 'theme', type: 'enum', values: ['gray', 'lime'], default: 'gray' }]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('in tag.tsx but not the manifest')
          expect(result.stdout + result.stderr).toContain('forest-green')
        }
      )
    })

    it('should fail --source when a declared enum prop is absent from a CVA component', async () => {
      await withProbeManifest(
        'unchecked-prop-probe',
        manifest => {
          manifest.props.shared.push({ name: 'notInCva', type: 'enum', values: ['a', 'b'], default: 'a' })
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('not declared via CVA variants or a TypeScript union')
          expect(result.stdout + result.stderr).toContain('notInCva')
        }
      )
    })

    // Only 25 of 77 flat components use CVA; the rest declare variants in the TypeScript
    // type. Without this, a manifest for any of those 52 could not pass without dropping
    // `values` — i.e. withholding the exact information agents need.
    it('should verify enum props declared as a TypeScript union', async () => {
      await withProbeManifest(
        'union-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/split-button.tsx'
          manifest.code.export = 'SplitButton'
          // split-button.tsx: `size?: 'sm' | 'md' | 'xs'`, no cva() anywhere
          manifest.props.shared = [{ name: 'size', type: 'enum', values: ['sm', 'md', 'xs'], default: 'md' }]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expectNoEnumProblems(result.stdout + result.stderr)
        }
      )
    })

    it('should detect drift against a TypeScript union', async () => {
      await withProbeManifest(
        'union-drift-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/split-button.tsx'
          manifest.code.export = 'SplitButton'
          manifest.props.shared = [{ name: 'size', type: 'enum', values: ['sm', 'md', 'HUGE'], default: 'md' }]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('HUGE')
          expect(result.stdout + result.stderr).toContain('xs') // real value the manifest omits
        }
      )
    })

    it('should resolve a one-level type alias to its union values', async () => {
      await withProbeManifest(
        'alias-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/card-select.tsx'
          manifest.code.export = 'CardSelect'
          // card-select.tsx: `type: CardSelectType` with `type CardSelectType = 'single' | 'multiple'`
          manifest.props.shared = [{ name: 'type', type: 'enum', values: ['single', 'multiple'], default: 'single' }]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expectNoEnumProblems(result.stdout + result.stderr)
        }
      )
    })

    // dialog.tsx makes several cva() calls: `size` lives in the first block, `theme` in a
    // later one (headerVariants) with no matching TS union. Scanning only the first cva()
    // would leave `theme` unverifiable and falsely fail a correct manifest.
    it('should verify an enum prop defined in a non-first cva() block', async () => {
      await withProbeManifest(
        'multi-cva-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/dialog.tsx'
          manifest.code.export = 'Content'
          manifest.props.shared = [
            { name: 'theme', type: 'enum', values: ['default', 'warning', 'danger'], default: 'default' }
          ]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expectNoEnumProblems(result.stdout + result.stderr)
        }
      )
    })

    it('should detect drift against an enum in a non-first cva() block', async () => {
      await withProbeManifest(
        'multi-cva-drift-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/dialog.tsx'
          manifest.code.export = 'Content'
          manifest.props.shared = [
            { name: 'theme', type: 'enum', values: ['default', 'warning', 'WRONG'], default: 'default' }
          ]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('WRONG')
          expect(result.stdout + result.stderr).toContain('danger') // real value the manifest omits
        }
      )
    })

    // The enum check never looked at props without values, so a prop added to, removed from or
    // renamed in the component left the manifest wrong with every gate green.
    it('should fail --source when a manifest prop does not exist in the component', async () => {
      await withProbeManifest(
        'ghost-prop-probe',
        manifest => {
          manifest.props.codeOnly.push({ name: 'ghostProp', type: 'string' })
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('"ghostProp": in the manifest but not declared')
        }
      )
    })

    it('should fail --source when the component declares a prop the manifest omits', async () => {
      await withProbeManifest(
        'missing-prop-probe',
        manifest => {
          manifest.props.codeOnly = manifest.props.codeOnly.filter((prop: { name: string }) => prop.name !== 'pulse')
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain(
            '"pulse": declared in status-badge.tsx but not in the manifest'
          )
        }
      )
    })

    // onlyWhen / neverWhen name another prop and its values; a typo would describe a rule
    // that never applies, so --schema must reject references that do not resolve.
    it('should fail --schema when onlyWhen names a value the enum does not have', async () => {
      await withProbeManifest(
        'bad-condition-value-probe',
        manifest => {
          manifest.props.codeOnly.find((prop: { name: string }) => prop.name === 'pulse').onlyWhen = {
            variant: ['statuss']
          }
        },
        async () => {
          const result = await runDsCheck(['--schema'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('"statuss", which is not a value of "variant"')
        }
      )
    })

    it('should fail --schema when neverWhen names a prop that is not an enum in the manifest', async () => {
      await withProbeManifest(
        'bad-condition-prop-probe',
        manifest => {
          manifest.props.codeOnly.find((prop: { name: string }) => prop.name === 'icon').neverWhen = {
            varient: ['status']
          }
        },
        async () => {
          const result = await runDsCheck(['--schema'])
          expect(result.exitCode).toBe(1)
          expect(result.stdout + result.stderr).toContain('"varient", which is not an enum prop')
        }
      )
    })

    it('should still skip --source cleanly when there are no enum props to verify', async () => {
      await withProbeManifest(
        'no-enums-probe',
        manifest => {
          manifest.code.path = 'packages/ui/src/components/alert-dialog.tsx'
          manifest.props.shared = [{ name: 'onClick', type: 'function', default: 'noop' }]
        },
        async () => {
          const result = await runDsCheck(['--source'])
          expectNoEnumProblems(result.stdout + result.stderr)
        }
      )
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

  describe('tag manifest', () => {
    it('should pass all checks for tag', async () => {
      const result = await runDsCheck(['--schema', '--refs', '--code', '--source', '--generated'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('✅ tag')
      expect(result.stdout).toContain('0 failed')
    })

    it('should have fresh OpenAPI spec', async () => {
      const specPath = path.resolve(PACKAGE_ROOT, 'schemas/tag.openapi.json')
      expect(fs.existsSync(specPath)).toBe(true)

      const result = await runDsCheck(['--generated'])
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toContain('tag')
    })
  })
})
