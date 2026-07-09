export default {
  '.cn-checkbox-tree': {
    '@apply w-full': ''
  },

  '.cn-checkbox-tree-item': {
    '@apply w-full': ''
  },

  '.cn-checkbox-tree-row': {
    '@apply relative w-full transition-colors': '',
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-border-width-1) solid var(--cn-border-3)',

    '&:hover': {
      '@apply bg-cn-hover': ''
    }
  },

  '.cn-checkbox-tree-trigger': {
    '@apply flex-1 cursor-pointer': '',

    '&:where([disabled])': {
      '@apply cursor-not-allowed opacity-cn-disabled': ''
    }
  },

  '.cn-checkbox-tree-label': {
    '@apply font-body-normal': ''
  },

  '.cn-checkbox-tree-select-all': {
    '@apply font-body-strong': ''
  },

  '.cn-checkbox-tree-content': {
    '@apply overflow-hidden': '',

    /**
     * Content is kept mounted (forceMount) so descendants stay registered for
     * selection state; hide it visually when the group is collapsed.
     */
    '&:where([data-state=closed])': {
      '@apply hidden': ''
    }
  }
}
