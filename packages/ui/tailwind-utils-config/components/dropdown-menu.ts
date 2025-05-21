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
    '&-content': {
      zIndex: '50',
      minWidth: 'var(--cn-dropdown-min-width)',
      maxHeight: 'var(--cn-dropdown-max-height)',
      padding: 'var(--cn-dropdown-container)',
      border: 'var(--cn-dropdown-border) solid var(--cn-border-2)',
      borderRadius: 'var(--cn-dropdown-radius)',
      backgroundColor: 'var(--cn-bg-3)',
      boxShadow: 'var(--cn-shadow-4)',
      '@apply data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2':
        ''
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

      '&:not(:where([data-disabled]))': {
        '&:hover, &:where([data-highlighted]), &:where([data-state="open"])': {
          backgroundColor: 'var(--cn-state-hover)',
          outline: 'none'
        },

        '&:hover': {
          cursor: 'pointer'
        }
      },

      '&-subtrigger': {
        '&:hover': {
          cursor: 'default'
        }
      },

      '&:where([data-disabled])': {
        opacity: '0.5'
      },

      '& .cn-radio-item, & .cn-checkbox-root': {
        position: 'static',
        outline: 'none'
      },

      '&-indicator': {
        width: 'var(--cn-badge-indicator-size-default)',
        height: 'var(--cn-badge-indicator-size-default)',
        borderRadius: 'var(--cn-rounded-full)',
        flexShrink: '0',

        ...createIndicatorVariantStyles()
      }
    },

    '&-group-label': {
      paddingTop: 'var(--cn-dropdown-item-py)',
      paddingLeft: 'var(--cn-dropdown-item-px)',
      paddingRight: 'var(--cn-dropdown-item-px)',
      color: 'var(--cn-text-3)',
      '@apply font-caption-normal': ''
    },

    '&-separator': {
      height: '1px',
      backgroundColor: 'var(--cn-border-3)'
    },

    '&-header, &-footer': {
      padding: 'var(--cn-dropdown-container)'
    }
  }
}
