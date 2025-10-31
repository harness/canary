import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['sm', 'md', 'lg'] as const
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
    color: 'text-cn-3'
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

const defaultLinearGradient = `linear-gradient(45deg,
  ${gradientColor} 18.75%,
  transparent 18.75%,
  transparent 50%,
  ${gradientColor} 50%,
  ${gradientColor} 68.75%,
  transparent 68.75%,
  transparent)`

const getBackgroundSize = (size: (typeof sizes)[number]) => {
  if (size === 'sm') {
    return '8px 8px'
  }
  if (size === 'lg') {
    return '32px 32px'
  }
  return '16px 16px'
}

function createProgressVariantStyles() {
  const combinationStyles: CSSRuleObject = {}

  sizes.forEach(size => {
    const style: CSSRuleObject = {}
    style[` .cn-progress-root`] = {
      height: `var(--cn-progress-size-${size})`
    }

    style[` .cn-progress-processing-fake`] = {
      'background-size': getBackgroundSize(size),
      'animation-name': `cnProgressBar-${size}`
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
      gap: 'var(--cn-spacing-1-half)',
      userSelect: 'none'
    },

    '&-icon': {
      width: 'var(--cn-icon-size-lg)',
      height: 'var(--cn-icon-size-lg)',
      color: 'var(--cn-text-3)'
    },

    '&-footer': {
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gap: 'var(--cn-spacing-1-half)'
    },

    '&-description-wrap': {
      display: 'grid'
    },

    '&-subtitle': {
      userSelect: 'none'
    },

    '&-root': {
      'border-radius': 'var(--cn-progress-radius, 9999px)',
      height: 'var(--cn-progress-size-md, 8px)',
      'background-color': 'var(--cn-comp-slider-track-base)',
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
      'pointer-events': 'none'
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
      animation: 'cnProgressIndeterminateAnimation 2s infinite linear'
    },

    '&-processing-fake': {
      'background-color': 'var(--cn-comp-slider-track-progress)',
      'background-image': defaultLinearGradient,
      'background-size': '16px 16px',
      height: '100%',
      width: '100%',
      animation: 'cnProgressBar-md 0.8s linear infinite'
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
    '@keyframes cnProgressBar-sm': {
      '0%': {
        'background-position': '0 0'
      },
      '100%': {
        'background-position': '8px 0'
      }
    },
    '@keyframes cnProgressBar-md': {
      '0%': {
        'background-position': '0 0'
      },
      '100%': {
        'background-position': '16px 0'
      }
    },
    '@keyframes cnProgressBar-lg': {
      '0%': {
        'background-position': '0 0'
      },
      '100%': {
        'background-position': '32px 0'
      }
    }
  }
}
