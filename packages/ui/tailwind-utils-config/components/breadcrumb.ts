export default {
  '.cn-breadcrumb': {
    '@apply flex flex-wrap items-center break-words select-none': '',
    gap: 'var(--cn-spacing-1)'
  },

  // Shared styles for last item highlighting
  '.cn-breadcrumb-sm, .cn-breadcrumb-xs': {
    '@apply font-caption-normal': '',
    '& .cn-breadcrumb-item:last-child, & .cn-breadcrumb-page:last-child': {
      '@apply font-caption-strong': '',
      color: 'var(--cn-text-1)'
    },
    '& .cn-breadcrumb-item:last-child .cn-breadcrumb-prefix-icon, & .cn-breadcrumb-page:last-child .cn-breadcrumb-prefix-icon': {
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-breadcrumb-sm': {
    '& .cn-breadcrumb-item': {
      height: 'var(--cn-size-8)'
    },
    '& .cn-breadcrumb-list': {
      gap: 'var(--cn-layout-3xs)'
    }
  },

  '.cn-breadcrumb-xs': {
    '& .cn-breadcrumb-item': {
      height: 'var(--cn-size-6)'
    },
    '& .cn-breadcrumb-list': {
      gap: 'var(--cn-layout-4xs)'
    },
    '& .cn-breadcrumb-separator': {
      color: 'var(--cn-text-3)'
    }
  },

  '.cn-breadcrumb-list': {
    '@apply flex flex-wrap items-center': ''
  },

  '.cn-breadcrumb-copy': {
    marginLeft: 'var(--cn-spacing-1)'
  },

  '.cn-breadcrumb-item': {
    color: 'var(--cn-text-2)',
    '@apply inline-flex items-center transition-colors': '',
    '&:hover': {
      color: 'var(--cn-text-1)'
    },
    gap: 'var(--cn-layout-3xs)'
  },

  '.cn-breadcrumb-link': {
    '@apply inline-flex items-center cursor-pointer': '',

    '&:focus-visible': {
      outline: 'var(--cn-focus)'
    }
  },

  '.cn-breadcrumb-link-with-icon': {
    gap: 'var(--cn-layout-3xs)'
  },

  '.cn-breadcrumb-page': {
    '@apply inline-flex items-center': ''
  },

  '.cn-breadcrumb-page-with-icon': {
    gap: 'var(--cn-layout-3xs)'
  },

  '.cn-breadcrumb-prefix-icon': {
    color: 'var(--cn-text-2)',
    '@apply shrink-0 transition-colors': '',
    '.cn-breadcrumb-item:hover &': {
      color: 'var(--cn-text-1)'
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
    '@apply shrink-0': ''
  },

  '.cn-breadcrumb-dropdown': {
    '@apply inline-flex items-center bg-transparent border-0 cursor-pointer p-0': '',
    gap: 'var(--cn-spacing-1)',

    '&:focus-visible': {
      outline: 'var(--cn-focus)'
    }
  },

  '.cn-breadcrumb-dropdown-text': {
    color: 'var(--cn-text-2)',
    '@apply transition-colors': '',

    '.cn-breadcrumb-dropdown:hover &': {
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-breadcrumb-dropdown-chevron': {
    color: 'var(--cn-text-2)',
    '@apply transition-colors': '',

    '.cn-breadcrumb-dropdown:hover &': {
      color: 'var(--cn-text-1)'
    }
  },

}
