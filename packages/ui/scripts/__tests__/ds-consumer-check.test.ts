import { spawn } from 'child_process'
import * as path from 'path'

import { describe, expect, it } from 'vitest'

const PACKAGE_ROOT = path.resolve(__dirname, '../..')
const SCRIPT_PATH = path.resolve(__dirname, '../ds-consumer-check.ts')
const FIXTURES = path.resolve(__dirname, 'fixtures')

function run(target: string): Promise<{ exitCode: number; stdout: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn('tsx', [SCRIPT_PATH, target], { cwd: PACKAGE_ROOT })
    let stdout = ''
    proc.stdout.on('data', data => {
      stdout += data.toString()
    })
    proc.on('error', reject)
    proc.on('close', exitCode => resolve({ exitCode: exitCode ?? 0, stdout }))
  })
}

describe('ds-consumer-check', () => {
  it('passes code that follows the design system', async () => {
    const { exitCode, stdout } = await run(path.join(FIXTURES, 'consumer-good'))
    expect(stdout).toContain('All rules passed.')
    expect(exitCode).toBe(0)
  }, 30_000)

  it('fails every rule on a deliberately violating file', async () => {
    const { exitCode, stdout } = await run(path.join(FIXTURES, 'consumer-bad'))
    expect(exitCode).toBe(1)
    for (let i = 1; i <= 10; i++) {
      const id = `DSC-${String(i).padStart(3, '0')}`
      expect(stdout, `${id} should fail`).toMatch(new RegExp(`FAIL  ${id}`))
    }
  }, 30_000)
})
