import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning'] as const

function createMultiSelectThemeStyles() {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-multi-select-${theme}):not(:has(input[disabled]))`] = {
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
  '.cn-multi-select': {
    '&-outer-container': {
      '@apply flex flex-col gap-cn-xs': ''
    },
    '&-container': {
      color: 'var(--cn-text-1)',
      minHeight: 'var(--cn-input-size-md)',
      border: 'var(--cn-input-border) solid var(--cn-border-2)',
      borderRadius: 'var(--cn-input-radius)',
      backgroundColor: 'var(--cn-comp-input-bg)',
      '@apply w-full font-body-normal transition-[color,box-shadow,border-color] px-cn-sm py-cn-xs': '',

      '&:where(:focus-within):not(.cn-multi-select-danger)': {
        borderColor: 'var(--cn-border-brand)',
        boxShadow: 'var(--cn-ring-selected)',
        outline: 'none'
      },

      '&:where(:hover):not(:has(input[disabled]))': {
        borderColor: 'var(--cn-border-brand)'
      },

      ...createMultiSelectThemeStyles()
    },

    '&-tag-wrapper': {
      '@apply relative flex flex-wrap items-center gap-cn-xs': ''
    },

    '&-input': {
      minWidth: '50px',
      '@apply flex-1 bg-transparent text-inherit outline-none w-full': '',
      '&::placeholder': {
        color: 'var(--cn-text-3)'
      },

      '&:where([disabled])': {
        cursor: 'not-allowed',
        '&::placeholder': {
          color: 'var(--cn-state-disabled-text)'
        }
      },

      '&:where(:focus-visible)': {
        outline: 'none !important'
      }
    },

    '&-dropdown': {
      backgroundColor: 'var(--cn-bg-3)',
      borderColor: 'var(--cn-border-2)',
      '@apply border rounded-3 shadow-3 mt-cn-3xs overflow-hidden animate-in absolute top-1 z-[55] w-full outline-none':
        ''
    }
  }
}
