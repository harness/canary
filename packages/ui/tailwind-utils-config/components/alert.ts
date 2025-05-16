import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['info', 'danger', 'warning'] as const

const themeStyleMapper: Record<(typeof themes)[number], { backgroundColor: string; color: string }> = {
  info: {
    backgroundColor: 'gray-soft',
    color: 'text-2'
  },
  danger: {
    backgroundColor: 'red-soft',
    color: 'text-danger'
  },
  warning: {
    backgroundColor: 'yellow-soft',
    color: 'text-warning'
  }
}

function createAlertVariantStyles() {
  const combinationStyles: CSSRuleObject = {}

  themes.forEach(theme => {
    const style: CSSRuleObject = {}
    const { backgroundColor, color } = themeStyleMapper[theme as keyof typeof themeStyleMapper]

    style[`backgroundColor`] = `var(--cn-set-${backgroundColor}-bg)`
    style[`> .cn-alert-icon`] = {
      color: `var(--cn-${color})`
    }

    combinationStyles[`&:where(.cn-alert-${theme})`] = style
  })

  return combinationStyles
}

export default {
  '.cn-alert': {
    gap: 'var(--cn-alert-gap)',
    paddingTop: 'var(--cn-alert-py)',
    paddingBottom: 'var(--cn-alert-py)',
    paddingLeft: 'var(--cn-alert-pl)',
    paddingRight: 'var(--cn-alert-pr)',
    borderRadius: 'var(--cn-alert-radius)',
    minWidth: 'var(--cn-alert-min-width)',
    backgroundColor: 'var(--cn-set-gray-soft-bg)',
    color: 'var(--cn-text-1)',
    '@apply w-full flex relative': '',

    '&-content-box': {
      background: 'inherit',
      transition: 'grid-template-rows 0.2s ease-out',
      '@apply grid grid-rows-[0fr]': ''
    },

    '&-content': {
      background: 'inherit',
      gap: 'var(--cn-spacing-1)',
      '@apply grid relative': '',

      '&-overflow': {
        overflow: 'hidden'
      }
    },

    '&-content-expanded': {
      '@apply grid-rows-[1fr]': ''
    },

    '&-min-h-content': {
      '@apply min-h-[70px]': ''
    },

    '&-min-h-content-no-title': {
      '@apply min-h-[60px]': ''
    },

    '&-text-wrap': {
      background: 'inherit',
      gap: 'var(--cn-spacing-3)',
      '@apply grid justify-items-start': ''
    },

    '&-fade-overlay': {
      background: 'inherit',
      maskImage: 'linear-gradient(to top, black, transparent)',
      visibility: 'visible',
      opacity: '1',
      transition: 'opacity 0.2s linear',
      '@apply absolute inset-0 pointer-events-none': '',

      '&-not-visible': {
        visibility: 'hidden',
        opacity: '0',
        transition: 'visibility 0s 2s, opacity 0.2s linear'
      }
    },

    '&-title': {
      '@apply font-body-strong': ''
    },

    '&-description': {
      '@apply font-body-normal break-words': ''
    },

    '&-close-button': {
      '&-icon': {
        flexShrink: '0',
        width: 'var(--cn-icon-size-sm)',
        height: 'var(--cn-icon-size-sm)'
      },

      '&:where(:focus-visible)': {
        // TODO: remove !important after fixing the cn-button:focus-visible
        position: 'absolute !important'
      },
      '@apply absolute right-2 top-2': ''
    },

    '&-expand-button': {
      '&-icon': {
        width: 'var(--cn-icon-size-default)',
        height: 'var(--cn-icon-size-default)',

        '&-rotate-180': {
          transform: 'rotate(180deg)',
          transition: 'transform 0.2s ease-out'
        }
      }
    },

    '&-icon': {
      flexShrink: '0',
      width: 'var(--cn-icon-size-md)',
      height: 'var(--cn-icon-size-md)',
      marginTop: 'var(--cn-spacing-px)'
    },

    '&-link-wrapper': {
      paddingTop: 'var(--cn-spacing-1)'
    },

    ...createAlertVariantStyles()
  }
}
