import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = ['danger', 'warning', 'success'] as const

const createCaptionThemeStyles = () => {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    styles[`&:where(.cn-caption-${theme})`] = {
      color: `var(--cn-text-${theme})`
    }
  })

  return styles
}

export default {
  '.cn-caption': {
    color: 'var(--cn-text-3)',
    gap: 'var(--cn-spacing-1)',
    '@apply w-full inline-flex items-center font-body-normal': '',

    ...createCaptionThemeStyles()
  }
}
