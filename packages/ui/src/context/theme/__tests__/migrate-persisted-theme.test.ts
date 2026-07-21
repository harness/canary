import { describe, expect, it } from 'vitest'

import { migrateLowContrastTheme } from '../migrate-persisted-theme'

describe('migrateLowContrastTheme', () => {
  it('rewrites deprecated low contrast themes to standard', () => {
    expect(migrateLowContrastTheme('dark-std-low')).toBe('dark-std-std')
    expect(migrateLowContrastTheme('light-pro-low')).toBe('light-pro-std')
    expect(migrateLowContrastTheme('dark-deu-low')).toBe('dark-deu-std')
  })

  it('leaves other themes unchanged', () => {
    expect(migrateLowContrastTheme('dark-std-std')).toBe('dark-std-std')
    expect(migrateLowContrastTheme('light-std-high')).toBe('light-std-high')
    expect(migrateLowContrastTheme(undefined)).toBeUndefined()
  })
})
