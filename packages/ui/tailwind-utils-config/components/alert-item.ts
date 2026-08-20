import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['info', 'success', 'warning', 'danger'] as const

const themeColorMap: Record<(typeof themes)[number], string> = {
  info: 'var(--cn-border-brand)',
  success: 'var(--cn-border-success)',
  warning: 'var(--cn-border-warning)',
  danger: 'var(--cn-border-danger)'
}

function createThemeVariantStyles() {
  const combinationStyles: CSSRuleObject = {}

  themes.forEach(theme => {
    combinationStyles[`&:where(.cn-alert-item-${theme})`] = {
      '--alert-item-theme-color': themeColorMap[theme]
    }
  })

  return combinationStyles
}

export default {
  '.cn-alert-item': {
    '@apply relative': '',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      width: '3px',
      backgroundColor: 'var(--alert-item-theme-color)'
    },

    '&-indicator': {
      width: 'var(--cn-spacing-2)',
      height: 'var(--cn-spacing-2)',
      margin: 'var(--cn-spacing-2)',
      borderRadius: 'var(--cn-rounded-full)',
      flexShrink: '0',

      '&-unread': {
        backgroundColor: 'var(--cn-text-brand)'
      }
    },

    ...createThemeVariantStyles()
  }
}
