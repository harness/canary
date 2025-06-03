export default {
  '.cn-breadcrumb': {
    '@apply flex flex-wrap items-center break-words': '',
    gap: 'var(--cn-spacing-1)',
    color: 'var(--cn-text-2)'
  },

  '.cn-breadcrumb-default': {
    gap: 'var(--cn-spacing-1)',
    '@apply font-body-strong': '',
    '& .cn-breadcrumb-item': {
      height: 'var(--cn-size-5)'
    },
    '& .cn-breadcrumb-item:last-child': {
      '@apply font-body-strong': '',
      borderRadius: '0',
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-breadcrumb-sm': {
    gap: 'var(--cn-spacing-0)',
    '@apply font-caption-soft': '',
    '& .cn-breadcrumb-item': {
      height: 'var(--cn-size-4-half)'
    },
    '& .cn-breadcrumb-item:last-child': {
      '@apply font-caption-soft': '',
      borderRadius: 'var(--cn-size-5)',
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-breadcrumb-list': {
    '@apply flex flex-wrap items-center': '',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-item': {
    '@apply inline-flex items-center': '',
    '&:hover': {
      color: 'var(--cn-text-1)'
    },
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-link': {
    '@apply transition-colors': ''
  },

  '.cn-breadcrumb-separator': {
    '& > svg': {
      width: 'var(--cn-size-3-half)',
      height: 'var(--cn-size-3-half)'
    }
  },

  '.cn-breadcrumb-ellipsis': {
    '@apply flex items-center justify-center': '',
    width: 'var(--cn-size-9)',
    height: 'var(--cn-size-9)'
  }
}
