export const padding = {
  /**
   * "paddingLeft" is not a valid property to add in
   * tailwindcss config. Hence is added as a custom
   * utility class.
   */
  '.pl-cn-input-md': {
    paddingLeft: 'var(--cn-input-md-pl)'
  },

  '.p-cn-header': {
    padding: 'var(--cn-header-py) var(--cn-header-pr) var(--cn-header-py) var(--cn-header-pl)'
  },

  '.p-cn-container': {
    padding: 'var(--cn-size-4-half) var(--cn-size-6)'
  }
}
