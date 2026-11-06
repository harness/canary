import * as monaco from 'monaco-editor'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderHookCompat } from '../../../config/test-utils'
import { ThemeDefinition } from '../../types/themes'
import { useTheme } from '../useTheme'

const monacoRef = { current: undefined }

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useTheme', () => {
  it('registers every configured theme with monaco on mount', () => {
    const defineTheme = vi.spyOn(monaco.editor, 'defineTheme')
    const themes: ThemeDefinition[] = [
      { themeName: 'dark', themeData: { base: 'vs-dark' } as ThemeDefinition['themeData'] },
      { themeName: 'light', themeData: { base: 'vs' } as ThemeDefinition['themeData'] }
    ]

    renderHookCompat(() => useTheme({ monacoRef, themeConfig: { themes }, editor: undefined }), undefined)

    expect(defineTheme).toHaveBeenCalledTimes(2)
    expect(defineTheme).toHaveBeenCalledWith('dark', themes[0].themeData)
    expect(defineTheme).toHaveBeenCalledWith('light', themes[1].themeData)
  })

  it('applies the active theme and returns it', () => {
    const setTheme = vi.spyOn(monaco.editor, 'setTheme')

    const { result } = renderHookCompat(
      () => useTheme({ monacoRef, themeConfig: {}, editor: {}, theme: 'light' }),
      undefined
    )

    expect(setTheme).toHaveBeenCalledWith('light')
    expect(result.current.theme).toBe('light')
  })

  it('falls back to the default theme, then vs-dark, when no theme prop is given', () => {
    const withDefault = renderHookCompat(
      () => useTheme({ monacoRef, themeConfig: { defaultTheme: 'my-default' }, editor: {} }),
      undefined
    )
    expect(withDefault.result.current.theme).toBe('my-default')

    const noConfig = renderHookCompat(() => useTheme({ monacoRef, editor: {} }), undefined)
    expect(noConfig.result.current.theme).toBe('vs-dark')
  })
})
