export default {
  '.cn-time-input': {
    // Hide the native time picker indicator across browsers so the
    // configurable IconV2 icon is the only affordance shown.
    '&::-webkit-calendar-picker-indicator': {
      display: 'none',
      '-webkit-appearance': 'none'
    },
    '&::-webkit-time-picker-indicator': {
      '-webkit-appearance': 'none'
    }
  }
}
