export const padding = {
  /**
   * "paddingInline" is not a valid property to add in
   * tailwindcss config. Hence is added as a custom
   * utility class.
   */
  '.pi-cn-input-md': {
    paddingInline: 'var(--cn-input-md-pl) var(--cn-input-md-pr)'
  },

  /**
   * Added these paddings as custom utility classes
   * as these padding styles are not needed as `pl-cn-*`. It needs to be used only as `p-cn-header`.
   *
   * Example:
   * ✅ .p-cn-header
   * ❌ .pl-cn-header
   */
  '.p-cn-header': {
    padding: 'var(--cn-header-py) var(--cn-header-pr) var(--cn-header-py) var(--cn-header-pl)'
  },
  '.p-cn-container': {
    padding: 'var(--cn-size-4-half) var(--cn-size-6)'
  }
}
