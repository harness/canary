import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['sm', 'default', 'md'] as const
const states = ['processing', 'completed', 'paused', 'failed'] as const

const stateStyleMapper: Record<
  (typeof states)[number],
  {
    progressBg: string
    color: string
  }
> = {
  processing: {
    progressBg: 'progress',
    color: 'text-3'
  },
  completed: {
    progressBg: 'success',
    color: 'text-success'
  },
  paused: {
    progressBg: 'warning',
    color: 'text-warning'
  },
  failed: {
    progressBg: 'danger',
    color: 'text-danger'
  }
}

const gradientColor = 'var(--cn-comp-slider-track-progress-stripes)'

const smLinearGradient = `linear-gradient(45deg,
  ${gradientColor} 4.6875%,
  transparent 4.6875%,
  transparent 12.5%,
  ${gradientColor} 12.5%,
  ${gradientColor} 17.1875%,
  transparent 17.1875%,
  transparent 25%,
  ${gradientColor} 25%,
  ${gradientColor} 29.6875%,
  transparent 29.6875%,
  transparent 37.5%,
  ${gradientColor} 37.5%,
  ${gradientColor} 42.1875%,
  transparent 42.1875%,
  transparent 50%,
  ${gradientColor} 50%,
  ${gradientColor} 54.6875%,
  transparent 54.6875%,
  transparent 62.5%,
  ${gradientColor} 62.5%,
  ${gradientColor} 67.1875%,
  transparent 67.1875%,
  transparent 75%,
  ${gradientColor} 75%,
  ${gradientColor} 79.6875%,
  transparent 79.6875%,
  transparent 87.5%,
  ${gradientColor} 87.5%,
  ${gradientColor} 92.1875%,
  transparent 92.1875%,
  transparent)`

const mdLinearGradient = `linear-gradient(45deg,
  ${gradientColor} 18.75%,
  transparent 18.75%,
  transparent 50%,
  ${gradientColor} 50%,
  ${gradientColor} 68.75%,
  transparent 68.75%,
  transparent)`

const defaultLinearGradient = `linear-gradient(45deg,
  ${gradientColor} 9.375%,
  transparent 9.375%,
  transparent 25%,
  ${gradientColor} 25%,
  ${gradientColor} 34.375%,
  transparent 34.375%,
  transparent 50%,
  ${gradientColor} 50%,
  ${gradientColor} 59.375%,
  transparent 59.375%,
  transparent 75%,
  ${gradientColor} 75%,
  ${gradientColor} 84.375%,
  transparent 84.375%,
  transparent)`

const getLinearGradient = (size: (typeof sizes)[number]) => {
  if (size === 'sm') {
    return smLinearGradient
  }
  if (size === 'md') {
    return mdLinearGradient
  }
  return defaultLinearGradient
}

function createProgressVariantStyles() {
  const combinationStyles: CSSRuleObject = {}

  sizes.forEach(size => {
    const style: CSSRuleObject = {}
    style[` .cn-progress-root`] = {
      height: `var(--cn-progress-size-${size})`
    }

    style[` .cn-progress-processing-fake`] = {
      'background-image': getLinearGradient(size)
    }

    combinationStyles[`&:where(.cn-progress-${size})`] = style
  })

  states.forEach(state => {
    const style: CSSRuleObject = {}
    style[` .cn-progress-root::-webkit-progress-value`] = {
      'background-color': `var(--cn-comp-slider-track-${stateStyleMapper[state].progressBg})`
    }
    style[` .cn-progress-root::-moz-progress-bar`] = {
      'background-color': `var(--cn-comp-slider-track-${stateStyleMapper[state].progressBg})`
    }
    style[` .cn-progress-icon`] = {
      color: `var(--cn-${stateStyleMapper[state].color})`
    }
    style[` .cn-progress-description`] = {
      color: `var(--cn-${stateStyleMapper[state].color})`
    }
    style[` .cn-progress-subtitle`] = {
      color: `var(--cn-${stateStyleMapper[state].color})`
    }

    combinationStyles[`&:where(.cn-progress-${state})`] = style
  })

  return combinationStyles
}

export default {
  '.cn-progress': {
    '&-container': {
      padding: 'var(--cn-progress-container-py, 8px) 0px',
      position: 'relative'
    },

    '&-header': {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      gap: 'var(--cn-spacing-1-half)'
    },

    '&-header-left': {
      display: 'grid'
    },

    '&-header-right': {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 'var(--cn-spacing-1-half)'
    },

    '&-icon': {
      width: 'var(--cn-icon-size-md)',
      height: 'var(--cn-icon-size-md)',
      color: 'var(--cn-text-3)'
    },

    '&-footer': {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--cn-spacing-1-half)'
    },

    '&-description-wrap': {
      display: 'grid'
    },

    '&-root': {
      'border-radius': 'var(--cn-progress-radius, 9999px)',
      height: 'var(--cn-progress-size-default, 8px)',
      'background-color': 'var(--cn-comp-slider-track-base)',
      transform: 'translateZ(0)',
      border: 'none',
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      appearance: 'none',

      '@apply block w-full overflow-hidden': '',

      '&::-webkit-progress-bar': {
        border: 'none',
        'background-color': 'var(--cn-comp-slider-track-base)'
      },
      '&::-webkit-progress-value': {
        border: 'none',
        'background-color': 'var(--cn-comp-slider-track-progress)'
      },
      '&::-moz-progress-bar': {
        border: 'none',
        'background-color': 'var(--cn-comp-slider-track-progress)'
      },
      '&:indeterminate::-moz-progress-bar': {
        width: '0'
      }
    },

    '&-overlay-box': {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
      'pointer-events': 'none',
      padding: 'var(--cn-progress-container-py, 8px) 0px'
    },

    '&-overlay': {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      'pointer-events': 'none',
      'border-radius': 'var(--cn-progress-radius, 9999px)'
    },

    '&-indeterminate-fake': {
      'background-color': 'var(--cn-comp-slider-track-progress)',
      height: '100%',
      width: '50%',
      animation: 'cnProgressIndeterminateAnimation 1s infinite linear'
    },

    '&-processing-fake': {
      'background-color': 'var(--cn-comp-slider-track-progress)',
      'background-image': getLinearGradient('default'),
      'background-size': '32px 32px',
      height: '100%',
      width: '100%',
      animation: 'cnProgressBar 0.8s linear infinite'
    },

    ...createProgressVariantStyles(),

    '@keyframes cnProgressIndeterminateAnimation': {
      '0%': {
        transform: 'translateX(-100%)'
      },
      '100%': {
        transform: 'translateX(200%)'
      }
    },
    '@keyframes cnProgressBar': {
      '0%': {
        'background-position': '0 0'
      },
      '100%': {
        'background-position': '32px 0'
      }
    }
  }
}
