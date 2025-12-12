export default {
  '.cn-meter': {
    '@apply flex h-[19px] items-stretch gap-cn-3xs': '',

    '&:has(.cn-meter-tooltip-bar:hover) .cn-meter-tooltip-bar:not(:hover)': {
      opacity: '0.3'
    },

    '&:has(.cn-meter-tooltip-bar:hover) .cn-meter-tooltip-bar:hover': {
      transform: 'scaleY(1.2)'
    },

    '&-bar': {
      '@apply flex h-full w-[5px] rounded-cn-px': '',
      transition: 'all 0.15s'
    }
  }
}
