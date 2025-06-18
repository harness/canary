import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning'] as const

function createSelectThemeStyles() {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-select-${theme}):not(:disabled)`] = {
      borderColor: `var(--cn-border-${theme})`,
      boxShadow: `var(--cn-ring-${theme})`,

      '&:where(:hover), &:where(:focus)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme}-hover)`
      }
    }
  })

  return styles
}

export default {
  '.cn-select': {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--cn-input-radius)',
    height: 'var(--cn-input-size-default)',
    border: 'var(--cn-input-border) solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-bg-2)',
    color: 'var(--cn-text-1)',
    textAlign: 'start',
    '@apply transition-[box-shadow,border-color]': '',

    '&:focus-visible': {
      outline: 'none'
    },

    '&:focus-visible, &:where([data-state="open"])': {
      borderColor: 'var(--cn-border-1)',
      boxShadow: 'var(--cn-ring-selected)',
      outline: 'none'
    },

    '&:where(:disabled)': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      borderColor: 'var(--cn-state-disabled-border)',
      color: 'var(--cn-state-disabled-text)',
      cursor: 'not-allowed',

      '.cn-select-indicator-icon': {
        color: 'var(--cn-state-disabled-text)'
      }
    },

    '&:where(:hover):not(:disabled)': {
      borderColor: 'var(--cn-border-1)'
    },

    '&-content': {
      maxWidth: 'calc(var(--cn-dropdown-min-width) * 2)'
    },

    '&-indicator-icon': {
      color: 'var(--cn-text-2)'
    },

    '&-trigger': {
      '@apply w-full flex items-center justify-between truncate': '',
      padding:
        'var(--cn-input-default-py) var(--cn-input-default-pr) var(--cn-input-default-py) var(--cn-input-default-pl)',
      gap: 'var(--cn-input-default-gap)'
    },

    '&-suffix': {
      '@apply border-l flex items-center justify-center': '',
      borderRadius: '0 var(--cn-input-radius) var(--cn-input-radius) 0',
      borderColor: 'inherit',
      aspectRatio: '1',
      height: '100%'
    },

    ...createSelectThemeStyles()
  }
}
