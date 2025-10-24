import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['info', 'danger', 'warning', 'success'] as const

const themeStyleMapper: Record<
  (typeof themes)[number],
  { backgroundColor: string; color: string; fadeBgColor: string }
> = {
  info: {
    backgroundColor: 'gray-secondary',
    color: 'text-2',
    fadeBgColor: 'default'
  },
  danger: {
    backgroundColor: 'danger-secondary',
    color: 'text-danger',
    fadeBgColor: 'danger'
  },
  warning: {
    backgroundColor: 'warning-secondary',
    color: 'text-warning',
    fadeBgColor: 'warning'
  },
  success: {
    backgroundColor: 'success-secondary',
    color: 'text-success',
    fadeBgColor: 'success'
  }
}

function createAlertVariantStyles() {
  const combinationStyles: CSSRuleObject = {}

  themes.forEach(theme => {
    const style: CSSRuleObject = {}
    const { backgroundColor, color, fadeBgColor } = themeStyleMapper[theme as keyof typeof themeStyleMapper]

    style[`backgroundColor`] = `var(--cn-set-${backgroundColor}-bg)`
    style[`> .cn-alert-icon`] = {
      color: `var(--cn-${color})`
    }
    style[` .cn-alert-fade-overlay`] = {
      background: `var(--cn-comp-alert-fade-${fadeBgColor})`
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
    backgroundColor: 'var(--cn-set-gray-secondary-bg)',
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
      minHeight: 'var(--cn-alert-min-h)'
    },

    '&-text-wrap': {
      background: 'inherit',
      transition: 'padding 0.2s linear',
      '@apply relative': '',

      '&-expanded': {
        paddingBottom: 'calc(var(--cn-spacing-3) + var(--cn-btn-size-md))'
      }
    },

    '&-fade-overlay': {
      background: 'var(--cn-comp-alert-fade-default)',
      visibility: 'visible',
      height: 'var(--cn-alert-fade-height)',
      opacity: '1',
      transition: 'opacity 0.2s linear',
      borderRadius: 'var(--cn-alert-radius)',
      '@apply absolute bottom-0 left-0 right-0 pointer-events-none': '',

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
      '@apply font-body-normal break-all': ''
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
      '@apply absolute bottom-0 left-0 z-[1]': '',

      '&:where(:focus-visible)': {
        // TODO: remove !important after fixing the cn-button:focus-visible
        position: 'absolute !important'
      },

      '&-icon': {
        width: 'var(--cn-icon-size-sm)',
        height: 'var(--cn-icon-size-sm)',

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
