import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning'] as const
const sizes = ['sm'] as const

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

      '&:where(:focus-visible)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme})`
      }
    }
  })

  sizes.forEach(size => {
    styles[`&.cn-textarea-${size}`] = {
      padding: `var(--cn-input-${size}-py) var(--cn-input-${size}-pr) var(--cn-input-${size}-py) var(--cn-input-${size}-pl)`
    }
  })

  return styles
}

export default {
  '.cn-textarea': {
    borderRadius: 'var(--cn-input-radius)',
    padding: 'var(--cn-input-md-py) var(--cn-input-md-pr) var(--cn-input-md-py) var(--cn-input-md-pl)',
    minHeight: 'var(--cn-input-text-area-min-height)',
    border: 'var(--cn-input-border) solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-comp-input-bg)',
    '@apply font-body-normal': '',
    color: 'var(--cn-text-1)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    resize: 'none',

    '&:focus-visible': {
      borderColor: 'var(--cn-border-brand)',
      boxShadow: 'var(--cn-ring-selected)',

      // Adding !important to override global :focus-visible
      outline: 'none !important'
    },

    '&::placeholder': {
      color: 'var(--cn-state-disabled-text)'
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

    '&:where(:hover):not(:disabled):not(.cn-textarea-danger):not(.cn-textarea-warning)': {
      borderColor: 'var(--cn-border-brand)'
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
