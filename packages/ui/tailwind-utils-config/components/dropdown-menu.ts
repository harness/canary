import { CSSRuleObject } from 'tailwindcss/types/config'

const indicatorColors = [
  'gray',
  'green',
  'red',
  'yellow',
  'blue',
  'purple',
  'brown',
  'cyan',
  'indigo',
  'lime',
  'mint',
  'orange',
  'pink',
  'violet'
] as const

const createIndicatorVariantStyles = () => {
  const style: CSSRuleObject = {}

  indicatorColors.forEach(color => {
    style[`&.cn-dropdown-menu-item-indicator-${color}`] = {
      backgroundColor: `var(--cn-set-${color}-solid-bg)`
    }
  })

  return style
}

export default {
  '.cn-dropdown-menu': {
    zIndex: '50',
    minWidth: 'var(--cn-dropdown-min-width)',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: 'var(--cn-dropdown-border) solid var(--cn-border-2)',
    borderRadius: 'var(--cn-dropdown-radius)',
    backgroundColor: 'var(--cn-bg-3)',
    boxShadow: 'var(--cn-shadow-4)',
    '@apply data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2':
      '',

    '&-container': {
      padding: 'var(--cn-dropdown-container)',

      '&-header': {
        borderBottom: 'var(--cn-dropdown-border) solid var(--cn-border-3)'
      },

      '&-footer': {
        borderTop: 'var(--cn-dropdown-border) solid var(--cn-border-3)'
      }
    },

    '&-content': {
      maxHeight: 'var(--cn-dropdown-max-height)'
    },

    '&-base-item': {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--cn-dropdown-item-gap)',
      color: 'var(--cn-text-2)'
    },

    '&-item': {
      padding: 'var(--cn-dropdown-item-py) var(--cn-dropdown-item-px)',
      borderRadius: 'var(--cn-dropdown-item-radius)',
      userSelect: 'none',
      '@apply transition-colors': '',

      '&:not(:where([aria-disabled=true]))': {
        '&:where([data-highlighted]), &:where([data-state="open"])': {
          backgroundColor: 'var(--cn-state-hover)',
          outline: 'none',
          cursor: 'default'
        }
      },

      '&-subtrigger': {
        '&:hover': {
          cursor: 'default'
        }
      },

      '&:where([aria-disabled=true])': {
        opacity: 'var(--cn-disabled-opacity)',
        cursor: 'not-allowed'
      },

      '& .cn-radio-item, & .cn-checkbox-root': {
        position: 'static',
        pointerEvents: 'none',
        outline: 'none'
      },

      '&-indicator': {
        width: 'var(--cn-badge-indicator-size-sm)',
        height: 'var(--cn-badge-indicator-size-sm)',
        borderRadius: 'var(--cn-rounded-full)',
        flexShrink: '0',

        ...createIndicatorVariantStyles()
      }
    },

    '&-group-label': {
      padding: 'var(--cn-dropdown-item-py) var(--cn-dropdown-item-px)',
      paddingBottom: 'var(--cn-spacing-1)',
      color: 'var(--cn-text-3)',
      userSelect: 'none',
      '@apply font-caption-normal': ''
    },

    '&-separator': {
      height: 'var(--cn-dropdown-border)',
      backgroundColor: 'var(--cn-border-3)'
    },

    '&-header, &-footer': {
      padding: 'var(--cn-spacing-1-half) var(--cn-spacing-2)'
    },

    '&-spinner': {
      display: 'flex',
      placeContent: 'center',
      padding: 'var(--cn-dropdown-item-py) var(--cn-dropdown-item-px)'
    },

    '&-no-options': {
      display: 'flex',
      placeContent: 'center',
      padding: 'calc(var(--cn-dropdown-item-py) + var(--cn-spacing-4)) var(--cn-dropdown-item-px)'
    }
  }
}
