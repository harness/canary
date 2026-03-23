import type { CSSRuleObject } from 'tailwindcss/types/config'

/** Outline icons: stroke tracks `color` / currentColor */
const strokeIcon = (token: string): CSSRuleObject => ({
  color: token,
  '& svg, & path': { color: token, stroke: token, fill: 'none' }
})

const itemLabelHover = {
  '.cn-sidebar-item-content-title': { color: 'var(--cn-comp-sidebar-item-text-hover)' },
  '.cn-sidebar-item-content-icon': { color: 'var(--cn-comp-sidebar-item-text-hover)' }
}

const itemLabelSelected = {
  '.cn-sidebar-item-content-title': { color: 'var(--cn-comp-sidebar-item-text-selected)' },
  '.cn-sidebar-item-content-icon': { color: 'var(--cn-comp-sidebar-item-text-selected)' }
}

/** Title row uses foreground-1; match icon to that row */
const descriptionRowIcon = {
  '& .cn-sidebar-item-content-icon': { color: 'var(--cn-text-1)' }
}

const descriptionIconStretch: CSSRuleObject = {
  '.cn-sidebar-item-content.cn-sidebar-item-content-w-description': {
    '.cn-sidebar-item-content-icon': {
      alignSelf: 'stretch',
      display: 'flex',
      alignItems: 'center'
    }
  }
}

// Collapsed sidebar: data-state="collapsed" on .cn-sidebar
const collapsedSidebarStyles: CSSRuleObject = {
  '& .cn-input-prefix': {
    '@apply ml-0': ''
  },

  '.cn-sidebar-group': {
    '--sidebar-group-label-scale': '0',
    '&-header': { display: 'none' }
  },

  '.cn-sidebar-item': {
    '&-content': {
      gridTemplateColumns: '1fr',
      gridTemplateAreas: '"icon"',
      justifyItems: 'center',
      justifyContent: 'center',
      padding: 'var(--cn-sidebar-item-container)',
      minWidth: 'calc(var(--cn-sidebar-item-min-width) - 2 * var(--cn-sidebar-container-px))',
      '&-title, &-description, &-badge, &-right-element, &-action-item-placeholder, &-action-buttons': {
        gridArea: 'icon',
        maxWidth: '0',
        padding: '0',
        opacity: '0',
        minWidth: '0'
      },
      '&-w-description, &-complete': { padding: '0' },
      '&-only-action-buttons, &-w-r-element, &-complete': {
        gridTemplateColumns: '1fr',
        gridTemplateAreas: '"icon"'
      },
      '&-icon': { justifySelf: 'center' }
    },
    '&-action-button': {
      maxWidth: '0',
      minWidth: '0',
      opacity: '0'
    }
  }
}

export default {
  '.cn-sidebar': {
    '&.cn-sidebar': {
      display: 'flex',
      flexDirection: 'column',
      height: 'var(--cn-sidebar-min-height)',
      minHeight: 'var(--cn-sidebar-item-min-height)',
      backgroundColor: 'var(--cn-comp-sidebar-bg)',

      '&-desktop': {
        top: '0px',
        zIndex: '1',
        position: 'sticky'
      }
    },

    '&-wrapper': {
      '--cn-sidebar-min-height': '100vh',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      height: 'var(--cn-sidebar-min-height)'
    },

    '&-rail': {
      width: '32px',
      zIndex: '20',
      position: 'absolute',
      '@apply inset-y-0 hidden group-data-[side=left]:-right-cn-xs group-data-[side=right]:-left-cn-xs md:flex': ''
    },

    '&-inset': {
      width: '100%',
      height: 'var(--cn-sidebar-min-height)',
      overflowY: 'auto',
      backgroundColor: 'var(--cn-bg-1)'
    },

    '&-content': {
      height: '100%',
      '&-wrapper': {
        '@apply flex-1 overflow-hidden relative': ''
      }
    },

    '&-footer': {
      display: 'grid',
      gap: 'var(--cn-sidebar-group-gap)',
      padding: 'var(--cn-sidebar-group-py) var(--cn-sidebar-container-spacing)',
      marginTop: 'auto',
      flexShrink: '0'
    },

    '&-separator': {
      backgroundColor: 'var(--cn-comp-sidebar-separator)'
    },

    '&-group': {
      display: 'grid',
      padding: 'var(--cn-layout-md) 0',
      gap: 'var(--cn-layout-xs)',

      '&-label': {
        opacity: 'var(--sidebar-group-label-scale)',
        maxHeight: 'calc(44px * var(--sidebar-group-label-scale))',
        transform: 'max(0.6, scale(var(--sidebar-group-label-scale)))',
        justifySelf: 'start',
        overflow: 'hidden',
        userSelect: 'none',
        color: 'var(--cn-text-3)',
        '@apply font-micro-normal duration-150 transition-[max-height,padding,opacity,transform] ease-linear': ''
      },

      '&-items': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--cn-layout-sm)',

        '&-popover': {
          gridTemplateColumns: 'var(--cn-size-58)',
          gap: '0 var(--cn-layout-xs)'
        }
      },

      '&-header': {
        display: 'flex',
        padding: 'var(--cn-layout-3xs) var(--cn-sidebar-item-container)',
        alignItems: 'center',
        gap: 'var(--cn-layout-xs)',
        alignSelf: 'stretch',
        '&-action-button': {
          '@apply opacity-0 transition-opacity duration-150': ''
        },
        '&:hover, &:focus-within': {
          '.cn-sidebar-group-header-action-button': {
            '@apply opacity-100': ''
          }
        }
      }
    },

    '&-menu': {
      display: 'grid',
      gap: 'var(--cn-sidebar-group-gap)'
    },

    '&-submenu': {
      '&-group': {
        paddingLeft: 'var(--cn-layout-xl)',
        paddingTop: 'var(--cn-sidebar-group-py)',
        paddingBottom: 'var(--cn-sidebar-group-py)',
        gap: 'var(--cn-spacing-2)',
        overflow: 'hidden',
        '&[data-state="open"]': { '@apply animate-accordion-down': '' },
        '&[data-state="closed"]': { '@apply animate-accordion-up': '' }
      },

      '&-item': {
        display: 'grid',
        alignItems: 'center',
        minWidth: 'var(--cn-sidebar-item-min-width)',
        padding: 'var(--cn-spacing-2)',
        paddingLeft: 'var(--cn-layout-sm)',
        borderRadius: 'var(--cn-sidebar-item-radius)',
        outline: 'none',
        '&:hover, &:focus-within': {
          backgroundColor: 'var(--cn-state-hover)'
        },
        '&.active': {
          background: 'var(--cn-comp-sidebar-item-selected)',
          '.cn-sidebar-submenu-item-content': {
            color: 'var(--cn-comp-sidebar-item-text-hover)'
          }
        },
        '&-active-indicator': {
          backgroundColor: 'var(--cn-set-brand-primary-bg)'
        }
      }
    },

    '&-item': {
      maxWidth: '100%',
      overflow: 'hidden',
      '@apply duration-150 transition-[max-width,margin-left,padding] ease-linear': '',

      // Router-active (e.g. NavLink); label colors — hover is handled on .cn-sidebar-item-wrapper
      '&-active': itemLabelSelected,

      '&:hover': {
        textDecoration: 'none !important'
      },

      '&-trigger': {
        cursor: 'pointer',
        '&-active': {
          backgroundColor: 'var(--cn-state-hover)',
          borderRadius: 'var(--cn-sidebar-item-radius)'
        }
      },

      '&-grip-handle': {
        position: 'absolute',
        left: '2px',
        top: '0',
        bottom: '0',
        width: 'var(--cn-icon-size-2xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1',
        cursor: 'grab',
        pointerEvents: 'auto',
        opacity: '0'
      },
      '&-grip-icon': {
        color: 'var(--cn-comp-sidebar-item-text-subtle)',
        width: 'var(--cn-icon-size-2xs)',
        height: 'var(--cn-icon-size-2xs)',
        flexShrink: '0'
      },

      '&-wrapper': {
        position: 'relative',
        display: 'grid',
        maxWidth: '100%',
        overflow: 'hidden',

        '&:not([data-disabled=true])': {
          '&:hover, &:focus-within': {
            '&[data-active=false] .cn-sidebar-item-content': {
              backgroundColor: 'var(--cn-state-hover)'
            },
            ...itemLabelHover,
            '.cn-sidebar-item-action-menu': { opacity: '1' },
            '.cn-sidebar-item-content-action-buttons': { display: 'flex !important' },
            '.cn-sidebar-item-grip-handle': { opacity: '1' },
            '.cn-sidebar-item-content-right-element': strokeIcon('var(--cn-text-1)')
          },

          '&[data-active=true][data-clickable=true]': {
            '.cn-sidebar-item-content': {
              background: 'var(--cn-comp-sidebar-item-selected)'
            },
            ...itemLabelSelected,
            '.cn-sidebar-item-action-menu': { opacity: '1' },
            '.cn-sidebar-item-active-indicator': {
              backgroundColor: 'var(--cn-set-brand-primary-bg)',
              height: '12px',
              width: '2px'
            },
            '.cn-sidebar-item-content-right-element': strokeIcon('var(--cn-text-2)'),
            '&:hover, &:focus-within': {
              '.cn-sidebar-item-grip-handle': { opacity: '1' }
            }
          }
        },

        '&[data-disabled=true]': {
          opacity: 'var(--cn-disabled-opacity)',
          cursor: 'not-allowed'
        }
      },

      '&-content': {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateAreas: '"icon title"',
        gap: 'var(--cn-layout-xs)',
        minHeight: 'var(--cn-sidebar-item-min-height)',
        minWidth: 'var(--cn-sidebar-item-min-width)',
        justifyItems: 'start',
        alignItems: 'center',
        padding:
          'var(--cn-sidebar-item-container) var(--cn-sidebar-item-container) var(--cn-sidebar-item-container) var(--cn-layout-sm)',
        borderRadius: 'var(--cn-sidebar-item-radius)',
        '@apply duration-150 transition-[padding,row-gap,column-gap] ease-linear': '',
        // Icons use stroke currentColor; base row color keeps them visible on dark sidebars
        color: 'var(--cn-text-2)',

        '&:hover, &:focus-within': {
          color: 'var(--cn-text-1)',
          backgroundColor: 'var(--cn-state-hover)'
        },

        '&-only-action-buttons': {
          gridTemplateAreas: '"icon title action-buttons"',
          gridTemplateColumns: 'auto 1fr auto'
        },

        '&-w-description': {
          gridTemplateAreas: `
            "icon title"
            "icon description"
          `,
          gridTemplateColumns: 'auto 1fr',
          paddingBlock: 'var(--cn-sidebar-item-container)',
          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: `
            "icon title action-buttons"
            "icon description action-buttons"
          `,
            gridTemplateColumns: 'auto 1fr auto'
          },
          ...descriptionRowIcon
        },

        '&-w-r-element': {
          gridTemplateAreas: '"icon title elem"',
          gridTemplateColumns: 'auto 1fr auto',
          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: '"icon title action-buttons elem"',
            gridTemplateColumns: 'auto 1fr auto auto'
          }
        },

        '&-complete': {
          gridTemplateAreas: `
            "icon title       elem"
            "icon description elem"
          `,
          gridTemplateColumns: 'auto 1fr auto',
          paddingBlock: 'var(--cn-sidebar-item-container)',
          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: `
            "icon title action-buttons elem"
            "icon description action-buttons elem"
          `,
            gridTemplateColumns: 'auto 1fr auto auto'
          },
          ...descriptionRowIcon
        },

        '&-icon': { gridArea: 'icon' },

        '&-title': {
          maxWidth: '100%',
          gridArea: 'title',
          userSelect: 'none'
        },

        '&-description': {
          maxWidth: '100%',
          gridArea: 'description',
          userSelect: 'none'
        },

        '&-badge': {
          margin: '-2px 0',
          '&-secondary': { opacity: '1' },
          '&.cn-sidebar-item-content-badge-secondary': {
            '@apply duration-150 transition-[opacity] ease-linear': ''
          }
        },

        '&-right-element': {
          gridArea: 'elem',
          display: 'grid',
          placeContent: 'center',
          width: 'var(--cn-size-6)',
          height: 'var(--cn-size-6)',
          justifyContent: 'flex-end',
          ...strokeIcon('var(--cn-text-2)')
        },

        '&-action-buttons': {
          display: 'none !important',
          gridArea: 'action-buttons'
        },

        '&-action-item-placeholder': {
          gridArea: 'elem',
          width: '20px',
          height: '16px'
        },

        '&-title, &-description, &-badge, &-right-element, &-action-item-placeholder': {
          opacity: '1',
          overflow: 'hidden',
          '@apply duration-150 transition-[max-width,opacity,padding] ease-linear': ''
        }
      },

      '&-action-button': {
        position: 'absolute',
        zIndex: '1',
        top: 'calc(50% - var(--cn-size-6)/2)',
        right: '4px',
        display: 'grid',
        placeContent: 'center',
        width: 'var(--cn-size-6)',
        height: 'var(--cn-size-6)',
        borderRadius: 'var(--cn-rounded-2)',
        opacity: '1',
        overflow: 'hidden',
        '@apply duration-150 transition-[opacity] ease-linear': '',
        ...strokeIcon('var(--cn-text-2)'),
        '&:hover, &:focus-within': {
          ...strokeIcon('var(--cn-text-1)'),
          backgroundColor: 'var(--cn-state-hover)'
        }
      },

      '&-action-menu': {
        opacity: '0',
        '@apply transition-opacity duration-200 ease-linear': '',
        '&[data-state="open"]': {
          color: 'var(--cn-text-1)',
          opacity: '1'
        }
      },

      '&-skeleton': {
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--cn-sidebar-item-container)',
        columnGap: 'var(--cn-sidebar-item-gap)',
        '&-icon, &-text': {
          flexShrink: '0',
          height: 'var(--cn-icon-size-sm)',
          borderRadius: 'var(--cn-rounded-1)',
          backgroundColor: 'var(--cn-bg-1)',
          '@apply animate-pulse': ''
        },
        '&-icon': { width: 'var(--cn-icon-size-sm)' },
        '&-text': {
          maxWidth: 'var(--cn-sidebar-skeleton-width)'
        }
      }
    },

    '&-drawer-content, &-drawer-overlay': {
      borderLeftWidth: '1px',
      left: 'var(--cn-size-64) !important',
      '&-collapsed': {
        left: 'var(--cn-size-16) !important'
      }
    },

    '&-modules-container': {
      display: 'flex',
      flexDirection: 'column'
    },

    '&-item-popover': {
      width: 'auto',

      '.cn-sidebar-item-content': {
        gap: 'var(--cn-layout-3xs) var(--cn-layout-xs)',
        gridTemplateColumns: 'var(--cn-size-6) 1fr',
        paddingLeft: 'var(--cn-sidebar-item-container)',
        '&-title': {
          font: 'var(--cn-body-single-line-normal)',
          color: 'var(--cn-comp-sidebar-item-text)'
        },
        '&-icon': { paddingLeft: '0' }
      },

      '.cn-icon.cn-icon-2xs:not(.cn-sidebar-item-expand-icon), .cn-icon.cn-icon-xs:not(.cn-sidebar-item-expand-icon), .cn-icon.cn-icon-sm:not(.cn-sidebar-item-expand-icon), .cn-icon.cn-icon-md:not(.cn-sidebar-item-expand-icon), .cn-icon.cn-icon-lg:not(.cn-sidebar-item-expand-icon), .cn-icon.cn-icon-xl:not(.cn-sidebar-item-expand-icon)':
        {
          width: 'var(--cn-size-6) !important',
          minWidth: 'var(--cn-size-6) !important',
          height: 'var(--cn-size-6) !important',
          minHeight: 'var(--cn-size-6) !important',
          padding: 'var(--cn-layout-3xs)',
          boxSizing: 'border-box',
          borderRadius: 'var(--cn-rounded-2)',
          border: '1px solid var(--cn-border-2)',
          backgroundColor: 'var(--cn-bg-1)',
          flexShrink: '0',
          color: 'var(--cn-comp-sidebar-item-text)'
        },

      '&:hover, &:focus-within': {
        '.cn-sidebar-item-content-title': {
          color: 'var(--cn-comp-sidebar-item-text-hover)'
        }
      }
    },

    '&[data-state=collapsed]': collapsedSidebarStyles
  },

  '.cn-sidebar-popover-measurement': {
    position: 'fixed',
    visibility: 'hidden',
    top: '-9999px',
    left: '-9999px',
    width: 'calc(2 * var(--cn-size-58) + var(--cn-sidebar-group-gap))',
    pointerEvents: 'none',
    paddingTop: 'var(--cn-layout-xs)',
    paddingBottom: 'var(--cn-layout-xs)',
    paddingLeft: 'var(--cn-popover-px)',
    paddingRight: 'var(--cn-popover-px)',
    zIndex: '-1',
    margin: '0',
    border: 'none',
    outline: 'none'
  },

  '.cn-sidebar-nested-popover': {
    width: 'var(--cn-size-64)',
    height: '100vh',
    borderRadius: '0 var(--cn-popover-radius) var(--cn-popover-radius) 0',
    ...descriptionIconStretch
  },

  '.cn-popover-content.cn-sidebar-popover': {
    backgroundColor: 'var(--cn-bg-2)',
    ...descriptionIconStretch,

    '.cn-sidebar-group-header': {
      padding: 'var(--cn-layout-3xs) var(--cn-sidebar-item-container)'
    },

    '.cn-sidebar-popover-footer': {
      marginTop: 'calc(-1 * var(--cn-spacing-2))',
      padding: 'var(--cn-layout-xs)',
      width: 'fit-content',
      justifyContent: 'flex-start'
    },

    '.cn-sidebar-separator': {
      marginTop: 'var(--cn-spacing-0)',
      marginBottom: 'calc(var(--cn-spacing-4) - var(--cn-spacing-px))',
      marginLeft: 'var(--cn-spacing-half)',
      marginRight: 'var(--cn-spacing-half)',
      height: '1px',
      width: 'calc(100% - 2 * var(--cn-layout-4xs))',
      backgroundColor: 'var(--cn-comp-sidebar-separator)'
    }
  }
}
