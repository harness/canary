import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning'] as const

function createSelectThemeStyles() {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-select-${theme}):not(:disabled)`] = {
      borderColor: `var(--cn-border-${theme})`,
      boxShadow: `var(--cn-ring-${theme})`,

      '&:where(:hover)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme}-hover)`
      },

      '&:where(:focus)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme})`
      }
    }
  })

  return styles
}

export default {
  '.cn-select': {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    gap: 'var(--cn-spacing-1-half)',
    borderRadius: 'var(--cn-input-radius)',
    padding:
      'var(--cn-input-default-py) var(--cn-input-default-pr) var(--cn-input-default-py) var(--cn-input-default-pl)',
    minHeight: 'var(--cn-input-size-default)',
    border: 'var(--cn-input-border) solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-bg-2)',
    color: 'var(--cn-text-1)',
    textAlign: 'start',

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

    '&:where(:hover):not(:disabled):not(.cn-select-danger)': {
      borderColor: 'var(--cn-border-1)'
    },

    '&-indicator-icon': {
      color: 'var(--cn-text-2)'
    },

    ...createSelectThemeStyles()
  }
}
