import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = [
  'gray',
  'blue',
  'brown',
  'cyan',
  'green',
  'indigo',
  'lime',
  'mint',
  'orange',
  'pink',
  'purple',
  'red',
  'violet',
  'yellow'
] as const

const sharedStyles: CSSRuleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: 'var(--cn-tag-py) var(--cn-tag-px)',
  gap: 'var(--cn-tag-gap)',
  borderWidth: `var(--cn-tag-border)`,
  borderRadius: `var(--cn-tag-radius-default)`,
  font: `var(--cn-body-tight-normal)`,
  maxWidth: `var(--cn-tag-max-width)`,
  height: `var(--cn-tag-size-default)`,
  '&.tag-sm': {
    font: `var(--cn-caption-tight-normal)`,
    height: `var(--cn-tag-size-sm)`
  },
  '&.tag-rounded': {
    borderRadius: `var(--cn-tag-radius-full)`
  },
  '&.tag-split-left': {
    borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,
    '&.tag-rounded': {
      borderRadius: `var(--cn-tag-radius-full) 0 0 var(--cn-tag-radius-full)`
    }
  },
  '&.tag-split-right': {
    borderRadius: `var(--cn-tag-split-right-radius-l) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-l)`,
    borderWidth: `var(--cn-tag-border) var(--cn-tag-border) var(--cn-tag-border) 0`,
    '&.tag-rounded': {
      borderRadius: `0 var(--cn-tag-radius-full) var(--cn-tag-radius-full) 0`
    }
  }
}

function createTagVariantStyles(variant: 'outline' | 'secondary'): CSSRuleObject {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    const isOutline = variant === 'outline'
    const style: CSSRuleObject = {
      color: `var(--cn-set-${theme}-${isOutline ? 'surface-text' : 'soft-text'})`,
      backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'surface-bg' : 'soft-bg'})`,
      borderColor: `var(--cn-set-${theme}-${isOutline ? 'surface-border' : 'soft-bg'})`,
      '&:hover': {
        backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'surface-bg-hover' : 'soft-bg-hover'})`,
        borderColor: `var(--cn-set-${theme}-${isOutline ? 'surface-border' : 'soft-bg-hover'})`
      },
      '&.tag-split-left': {
        '.tag-split:hover &': {
          backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'surface-bg-hover' : 'soft-bg-hover'})`,
          borderColor: `var(--cn-set-${theme}-${isOutline ? 'surface-border' : 'soft-bg-hover'})`
        }
      },
      '&.tag-split-right': isOutline
        ? {
            borderColor: `var(--cn-set-${theme}-soft-bg)`,
            '.tag-split:hover &': {
              borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
            }
          }
        : {
            backgroundColor: `var(--cn-set-${theme}-surface-bg)`,
            '.tag-split:hover &': {
              backgroundColor: `var(--cn-set-${theme}-surface-bg-hover)`
            }
          }
    }

    styles[`&:where(.tag-${theme})`] = style
  })

  return styles
}

export default {
  '.tag-outline': {
    ...sharedStyles,
    ...createTagVariantStyles('outline')
  },
  '.tag-secondary': {
    ...sharedStyles,
    ...createTagVariantStyles('secondary')
  }
}
