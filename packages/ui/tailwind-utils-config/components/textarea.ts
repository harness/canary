import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning'] as const

function createInputThemeStyles() {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-textarea-${theme}):not(:disabled)`] = {
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
  '.cn-textarea': {
    borderRadius: 'var(--cn-input-radius)',
    padding:
      'var(--cn-input-default-py) var(--cn-input-default-pr) var(--cn-input-default-py) var(--cn-input-default-pl)',
    minHeight: 'var(--cn-input-text-area-min-height)',
    border: 'var(--cn-input-border) solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-bg-2)',
    '@apply font-body-normal': '',
    color: 'var(--cn-text-1)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    resize: 'none',

    '&:focus-visible': {
      outline: 'none'
    },

    '&::placeholder': {
      color: 'var(--cn-text-3)'
    },

    '&:where(:focus)': {
      borderColor: 'var(--cn-border-1)',
      boxShadow: 'var(--cn-ring-selected)',
      outline: 'none'
    },

    '&:where(:disabled)': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      borderColor: 'var(--cn-state-disabled-border)',
      color: 'var(--cn-state-disabled-text)',
      cursor: 'not-allowed',

      '&::placeholder': {
        color: 'var(--cn-state-disabled-text)'
      }
    },

    '&:where(:readonly)': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      borderColor: 'var(--cn-state-disabled-border)'
    },

    '&:where(:hover):not(:disabled):not(.cn-textarea-danger)': {
      borderColor: 'var(--cn-border-1)'
    },

    '&-resizable': {
      resize: 'vertical'
    },

    ...createInputThemeStyles(),

    '&-label-wrapper': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--cn-spacing-2)',
      width: '100%',
      maxWidth: '100%'
    },

    '&-counter': {
      '@apply font-caption-normal': '',
      whiteSpace: 'nowrap',
      color: 'var(--cn-text-3)',

      '&:where(.cn-textarea-counter-danger)': {
        color: 'var(--cn-text-danger)'
      },

      '&:where(.cn-textarea-counter-disabled)': {
        color: 'var(--cn-state-disabled-text)'
      }
    }
  }
}
