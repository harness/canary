const statusIndicatorColors = {
  poor: 'var(--cn-comp-slider-track-danger)',
  fair: 'var(--cn-comp-slider-track-warning)',
  good: 'var(--cn-comp-slider-track-success)',
  none: 'var(--cn-comp-slider-track-progress)'
} as const

const gaugeSizes = {
  '2xs': {
    width: 'var(--cn-size-12, 48px)'
  },
  xs: {
    width: 'var(--cn-size-14, 56px)'
  },
  sm: {
    width: 'var(--cn-size-16, 64px)'
  },
  md: {
    width: 'var(--cn-size-20, 80px)'
  },
  lg: {
    width: 'var(--cn-size-26, 104px)'
  }
} as const

function createSizeStyles() {
  return Object.fromEntries(
    Object.entries(gaugeSizes).map(([size, config]) => [
      `&:where(.cn-gauge-size-${size})`,
      {
        width: config.width,

        ' .cn-gauge-ring': {
          width: config.width,
          height: config.width
        }
      }
    ])
  )
}

function createStatusStyles() {
  return Object.fromEntries(
    (Object.keys(statusIndicatorColors) as Array<keyof typeof statusIndicatorColors>).map(level => [
      `&:where(.cn-gauge-status-${level})`,
      {
        [` .cn-gauge-indicator-${level}`]: {
          stroke: statusIndicatorColors[level]
        }
      }
    ])
  )
}

export default {
  '.cn-gauge': {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--cn-spacing-2xs)',

    '&-label': {
      userSelect: 'none'
    },

    '&-body': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--cn-spacing-2xs)'
    },

    '&-helper': {
      userSelect: 'none'
    },

    '&-descriptor': {
      userSelect: 'none'
    },

    '&-ring': {
      position: 'relative',
      display: 'grid',
      placeItems: 'center'
    },

    '&-svg': {
      width: '100%',
      height: '100%',
      display: 'block'
    },

    '&-track': {
      stroke: 'var(--cn-comp-slider-track-base)'
    },

    '&-indicator': {
      strokeLinecap: 'round',
      transition: 'stroke-dashoffset 0.2s ease'
    },

    '&-value': {
      position: 'absolute',
      inset: '0',
      display: 'grid',
      placeItems: 'center',
      userSelect: 'none',
      pointerEvents: 'none'
    },

    ...createSizeStyles(),
    ...createStatusStyles()
  }
}
