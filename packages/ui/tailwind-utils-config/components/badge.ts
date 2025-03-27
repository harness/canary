// <Badge variant="solid" theme="success">Private</Badge>

import { CSSProperties } from 'react'

import { CSSRuleObject } from 'tailwindcss/types/config'

// Private
// - bg - --cn-set-green-solid-bg
// - text - --cn-set-green-solid-text
// - border - --cn-set-green-solid-border
// - border - --cn-comp-badge-

const variants = ['solid', 'soft', 'surface']

const themes = ['success', 'info', 'warning', 'destructive', 'primary', 'muted']

const themeStyleMapper: Record<(typeof themes)[number], string> = {
  success: 'green',
  info: 'blue',
  warning: 'orange',
  destructive: 'red',
  primary: 'brand',
  muted: 'gray'
}

function createBadgeStyles() {
  const combinationStyles: CSSRuleObject = {}
  variants.forEach(variant => {
    themes.forEach(theme => {
      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
      style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
      style[`borderColor`] = `var(--cn-set-${themeStyle}-${variant}-border)`

      combinationStyles[`&.badge-${variant}.badge-${theme}`] = style
    })
  })

  return combinationStyles
}

export default {
  '.badge': {
    ...createBadgeStyles()
  }
}
// export default {
//   '.badge': {
//     border: 'var(--cn-badge-border) solid var(--cn-set-default-border)',
//     color: 'var(--cn-set-default-text)',
//     backgroundColor: 'var(--cn-set-default-background)',
//     padding: 'var(--cn-badge-py) var(--cn-badge-px)',
//     gap: 'var(--cn-badge-gap)',
//     height: 'var(--cn-badge-size-default)',

//     // '&:hover': {
//     //   backgroundColor: 'var(--cn-state-hover)'
//     // },
//     // font: theme!('font.caption.soft'),

//     /**
//      * Variants
//      */
//     '&-neutral': {
//       color: 'var(--cn-set-neutral-text)',
//       backgroundColor: 'var(--cn-set-neutral-background)',
//       borderColor: 'var(--cn-set-neutral-border)'
//     },
//     '&-success': {
//       color: 'var(--cn-set-success-text)',
//       backgroundColor: 'var(--cn-set-success-background)',
//       borderColor: 'var(--cn-set-success-border)'
//     },
//     '&-warning': {
//       color: 'var(--cn-set-warning-text)',
//       backgroundColor: 'var(--cn-set-warning-background)',
//       borderColor: 'var(--cn-set-warning-border)'
//     },
//     '&-danger': {
//       color: 'var(--cn-set-danger-text)',
//       backgroundColor: 'var(--cn-set-danger-background)',
//       borderColor: 'var(--cn-set-danger-border)'
//     },
//     '&-info': {
//       color: 'var(--cn-set-info-text)',
//       backgroundColor: 'var(--cn-set-info-background)',
//       borderColor: 'var(--cn-set-info-border)'
//     },
//     '&-merged': {
//       color: 'var(--cn-set-merged-text)',
//       backgroundColor: 'var(--cn-set-merged-background)',
//       borderColor: 'var(--cn-set-merged-border)'
//     },
//     '&-ai': {
//       color: 'var(--cn-set-ai-text)',
//       backgroundImage: `linear-gradient(to right, var(--cn-set-ai-background), var(--cn-set-ai-background)), var(--cn-set-ai-border)`,
//       backgroundOrigin: 'border-box',
//       backgroundClip: 'padding-box, border-box',
//       border: '1px solid transparent'
//     },

//     /**
//      * Rounded
//      */

//     '&-rounded': {
//       '&-default': {
//         borderRadius: 'var(--cn-badge-radius)'
//       }

//       // '&-full': {
//       //   padding: 'var(--cn-badge-default-py) var(--cn-badge-rounded-px)',
//       //   borderRadius: 'var(--cn-badge-rounded-radius)'
//       // }
//     },

//     /**
//      * Size
//      */

//     '&-sm': {
//       height: 'var(--cn-badge-size-sm)',
//       // font: 'var(--cn-caption-soft)'
//       '@apply font-caption-soft': ''
//     }
//   }
// }
