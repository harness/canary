import { describe, expect, it } from 'vitest'

import { MonacoCommonDefaultOptions } from '../monaco-common-default-options'

describe('MonacoCommonDefaultOptions', () => {
  it('disables the minimap and enables automatic layout with the shared editor defaults', () => {
    expect(MonacoCommonDefaultOptions.minimap).toEqual({ enabled: false })
    expect(MonacoCommonDefaultOptions.automaticLayout).toBe(true)
    expect(MonacoCommonDefaultOptions.scrollBeyondLastLine).toBe(false)
    expect(MonacoCommonDefaultOptions.fontSize).toBe(14)
    expect(MonacoCommonDefaultOptions.padding).toEqual({ top: 16, bottom: 16 })
  })
})
