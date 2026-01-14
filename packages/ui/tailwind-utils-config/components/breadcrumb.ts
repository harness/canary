export default {
  '.cn-breadcrumb': {
    '@apply flex flex-wrap items-center break-words select-none': '',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-default': {
    gap: 'var(--cn-spacing-1)',
    '@apply font-body-strong': '',
    '& .cn-breadcrumb-item': {
      height: 'var(--cn-size-5)'
    },
    '& .cn-breadcrumb-item:last-child, & .cn-breadcrumb-page:last-child': {
      '@apply font-body-strong': '',
      borderRadius: '0',
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-breadcrumb-sm': {
    gap: 'var(--cn-spacing-0)',
    '@apply font-caption-light': '',
    '& .cn-breadcrumb-item': {
      height: 'var(--cn-size-4-half)'
    },
    '& .cn-breadcrumb-item:last-child, & .cn-breadcrumb-page:last-child': {
      '@apply font-caption-light': '',
      borderRadius: 'var(--cn-size-5)',
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-breadcrumb-list': {
    '@apply flex flex-wrap items-center': '',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-copy': {
    marginLeft: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-item': {
    color: 'var(--cn-text-3)',
    '@apply inline-flex items-center': '',
    '&:hover': {
      color: 'var(--cn-set-brand-primary-bg)'
    },
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-link': {
    '@apply transition-colors': '',

    '&:focus-visible': {
      outline: 'var(--cn-focus)'
    }
  },

  '.cn-breadcrumb-separator': {
    color: 'var(--cn-text-4)',
    '& > svg': {
      width: 'var(--cn-icon-size-sm)',
      height: 'var(--cn-icon-size-sm)'
    },
    '@apply flex items-center justify-center shrink-0': ''
  },

  '.cn-breadcrumb-ellipsis': {
    color: `var(--cn-set-brand-primary-bg)`,
    '& > svg': {
      width: 'var(--cn-icon-size-sm)',
      height: 'var(--cn-icon-size-sm)'
    },
    '@apply flex items-center justify-center shrink-0': ''
  }
}
