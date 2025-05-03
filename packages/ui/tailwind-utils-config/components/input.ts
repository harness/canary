import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning', 'success'] as const

function createInputThemeStyles() {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-input-${theme}):not(:has(input[disabled]))`] = {
      borderColor: `var(--cn-border-${theme})`,
      boxShadow: `var(--cn-ring-${theme})`,

      '&:where(:hover)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme}-hover)`
      },

      '&:where(:focus-within)': {
        borderColor: `var(--cn-border-${theme})`,
        boxShadow: `var(--cn-ring-${theme})`
      }
    }
  })

  return styles
}

export default {
  '.cn-input': {
    '&-input': {
      height: '100%',
      minWidth: '0',
      maxWidth: '100%',
      borderRadius: 'var(--cn-input-radius)',
      padding:
        'var(--cn-input-default-py) var(--cn-input-default-pr) var(--cn-input-default-py) var(--cn-input-default-pl)',
      '@apply font-body-normal w-full text-inherit bg-transparent': '',

      '&:focus-visible': {
        outline: 'none'
      },

      '&::placeholder': {
        color: 'var(--cn-text-3)'
      },

      '&:where([readonly])': {
        backgroundColor: 'var(--cn-set-gray-soft-bg)'
      },

      '&:where([disabled])': {
        cursor: 'not-allowed',

        '&::placeholder': {
          color: 'var(--cn-state-disabled-text)'
        }
      }
    },
    '&-container': {
      color: 'var(--cn-text-1)',
      height: 'var(--cn-input-size-default)',
      border: 'var(--cn-input-border) solid var(--cn-border-2)',
      borderRadius: 'var(--cn-input-radius)',
      backgroundColor: 'var(--cn-bg-2)',
      '@apply p-0 flex items-center transition-[color,box-shadow,border-color]': '',

      '&:where(:focus-within)': {
        borderColor: 'var(--cn-border-1)',
        boxShadow: 'var(--cn-ring-selected)',
        outline: 'none'
      },

      '&:where(:has(input[disabled]))': {
        backgroundColor: 'var(--cn-state-disabled-bg)',
        borderColor: 'var(--cn-state-disabled-border)',
        color: 'var(--cn-state-disabled-text)',
        cursor: 'not-allowed'
      },

      '&:where(:hover):not(:has(input[disabled])):not(.cn-input-success, .cn-input-warning, .cn-input-danger)': {
        borderColor: 'var(--cn-border-1)'
      },

      '&:where(.cn-input-sm)': {
        height: 'var(--cn-input-size-sm)',

        '&:where(.cn-input-input)': {
          padding: 'var(--cn-input-sm-py) var(--cn-input-sm-pr) var(--cn-input-sm-py) var(--cn-input-sm-pl)'
        }
      },

      ...createInputThemeStyles()
    }
  }
}

// input[type="search"]::-webkit-search-cancel-button {
//   -webkit-appearance: none;
//   appearance: none;
//   display: none;
// }
