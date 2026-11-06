import { describe, expect, it } from 'vitest'

import { monacoThemes, monacoThemesForBlame } from '../monaco-themes'

describe('monaco themes', () => {
  it('exposes a dark and light theme with the expected base and non-empty rules/colors', () => {
    for (const themes of [monacoThemes, monacoThemesForBlame]) {
      const byName = Object.fromEntries(themes.map(t => [t.themeName, t]))
      expect(Object.keys(byName).sort()).toEqual(['dark', 'light'])
      expect(byName.dark.themeData.base).toBe('vs-dark')
      expect(byName.light.themeData.base).toBe('vs')
      expect(byName.dark.themeData.rules.length).toBeGreaterThan(0)
      expect(byName.dark.themeData.colors['editor.background']).toBe('#0F0F11')
      expect(byName.light.themeData.colors['editor.background']).toBe('#f8f8f8')
    }
  })
})
