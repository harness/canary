import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning', 'success'] as const

function createInputThemeStyles() {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-input-${theme})`] = {
      borderColor: `var(--cn-border-${theme})`,

      '&:where(:focus-visible)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme})`
      }
    }
  })

  return styles
}

export default {
  '.cn-input': {
    height: 'var(--cn-input-size-default)',
    color: 'var(--cn-text-1)',
    backgroundColor: 'var(--cn-bg-2)',
    borderRadius: 'var(--cn-input-radius)',
    border: 'var(--cn-input-border) solid var(--cn-border-2)',
    padding:
      'var(--cn-input-default-py) var(--cn-input-default-pr) var(--cn-input-default-py) var(--cn-input-default-pl)',
    '@apply font-body-tight-strong w-full transition-[color,box-shadow]': '',

    '&:where(:focus-visible)': {
      borderColor: 'var(--cn-border-1)',
      boxShadow: 'var(--cn-ring-selected)',
      outline: 'none'
    },

    '&:where([disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      color: 'var(--cn-state-disabled-text)',
      borderColor: 'var(--cn-state-disabled-border)',
      cursor: 'not-allowed',

      '&::placeholder': {
        color: 'var(--cn-state-disabled-text)'
      }
    },

    '&:where([readonly])': {
      backgroundColor: 'var(--cn-set-gray-soft-bg)'
    },

    // '&:where(:hover):not([disabled])': {
    //   borderColor: 'var(--cn-border-1)'
    // },

    '&::placeholder': {
      color: 'var(--cn-text-3)'
    },

    '&:where(.cn-input-sm)': {
      height: 'var(--cn-input-size-sm)',
      padding: 'var(--cn-input-sm-py) var(--cn-input-sm-pr) var(--cn-input-sm-py) var(--cn-input-sm-pl)'
    },

    ...createInputThemeStyles()
  }
}

// input[type="search"]::-webkit-search-cancel-button {
//   -webkit-appearance: none;
//   appearance: none;
//   display: none;
// }
