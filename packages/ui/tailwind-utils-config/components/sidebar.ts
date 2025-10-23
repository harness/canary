export default {
  '.cn-sidebar': {
    '&.cn-sidebar': {
      display: 'flex',
      flexDirection: 'column',
      height: 'var(--cn-sidebar-min-height)',
      width: 'var(--cn-sidebar-container-full-width)',
      backgroundColor: 'var(--cn-bg-0)',
      padding: 'var(--cn-sidebar-container-py) 0',

      '&-desktop': {
        top: '0px',
        zIndex: '1',
        position: 'sticky',
        '@apply duration-200 transition-[width] ease-linear': ''
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
      width: '16px',
      zIndex: '20',
      cursor: 'ew-resize',
      position: 'absolute',
      '@apply inset-y-0 hidden group-data-[side=left]:-right-cn-xs group-data-[side=right]:-left-cn-xs md:flex': ''
    },

    '&-inset': {
      width: '100%',
      height: 'var(--cn-sidebar-min-height)',
      overflowY: 'auto',
      backgroundColor: 'var(--cn-bg-0)'
    },

    '&-header': {
      padding:
        'var(--cn-sidebar-header-pt) var(--cn-sidebar-container-px) var(--cn-sidebar-header-pb) var(--cn-sidebar-container-px)',

      '& .cn-input-prefix': {
        '@apply transition-[margin-left,width] duration-150 ease-linear': ''
      }
    },

    '&-content': {
      height: '100%',
      padding: '0 var(--cn-sidebar-container-px)',

      '&-wrapper': {
        '@apply flex-1 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:z-10 after:z-10 after:absolute after:inset-x-0 after:bottom-0':
          '',

        '&:before, &:after': {
          height: '60px',
          pointerEvents: 'none'
        },

        '&:before': {
          backgroundImage: 'var(--cn-comp-sidebar-fade-start)'
        },

        '&:after': {
          backgroundImage: 'var(--cn-comp-sidebar-fade-end)'
        },

        '&:where(.cn-sidebar-content-wrapper-top)': {
          '@apply before:hidden': ''
        },

        '&:where(.cn-sidebar-content-wrapper-bottom)': {
          '@apply after:hidden': ''
        }
      }
    },

    '&-footer': {
      display: 'grid',
      gap: 'var(--cn-sidebar-footer-gap)',
      padding: 'var(--cn-sidebar-footer-pt) var(--cn-sidebar-container-px)',
      paddingBottom: '0'
    },

    '&-separator': {
      backgroundColor: 'var(--cn-border-2)'
    },

    '&-group': {
      '--sidebar-group-label-scale': '1',
      display: 'grid',
      gap: 'var(--cn-sidebar-group-gap)',
      padding: 'var(--cn-sidebar-group-py) 0',

      '&-label': {
        opacity: 'var(--sidebar-group-label-scale)',
        maxHeight: 'calc(44px * var(--sidebar-group-label-scale))',
        transform: 'max(0.6, scale(var(--sidebar-group-label-scale)))',
        justifySelf: 'start',
        overflow: 'hidden',
        '@apply duration-150 transition-[max-height,padding,opacity,transform] ease-linear': ''
      },

      '&-header': {
        padding:
          'calc(var(--cn-sidebar-item-py) * var(--sidebar-group-label-scale)) calc(var(--cn-sidebar-item-px) * var(--sidebar-group-label-scale))',
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
        padding: 'var(--cn-sidebar-sub-group-py) var(--cn-sidebar-sub-group-px)',
        rowGap: 'var(--cn-sidebar-sub-group-gap)',
        columnGap: 'var(--cn-sidebar-sub-group-gap-container)',
        overflow: 'hidden',

        '&[data-state="open"]': {
          '@apply animate-accordion-down': ''
        },

        '&[data-state="closed"]': {
          '@apply animate-accordion-up': ''
        }
      },

      '&-item': {
        display: 'grid',
        alignItems: 'center',
        minHeight: 'var(--cn-sidebar-sub-item-min)',
        padding: 'var(--cn-sidebar-sub-item-py) var(--cn-sidebar-sub-item-px)',
        borderRadius: 'var(--cn-sidebar-item-radius)',
        outline: 'none',

        '&:hover, &:focus-within': {
          backgroundColor: 'var(--cn-state-hover)'
        },

        '&-active': {
          '.cn-sidebar-submenu-item-content': {
            color: 'var(--cn-text-1)'
          }
        }
      }
    },

    '&-item': {
      maxWidth: '100%',
      overflow: 'hidden',
      '@apply duration-150 transition-[max-width,margin-left,padding] ease-linear': '',

      '&:hover': {
        /**
         * This is to override the parent default styles
         */
        textDecoration: 'none !important'
      },

      '&-big': {
        maxWidth: '100%'
      },

      '&-active': {
        '.cn-sidebar-item-content-title': {
          color: 'var(--cn-text-1)'
        }
      },

      '&-wrapper': {
        position: 'relative',
        display: 'grid',
        maxWidth: '100%',
        overflow: 'hidden',

        '&:not([data-disabled=true])': {
          '&:hover, &:focus-within, &[data-active=true]': {
            '.cn-sidebar-item-content': {
              backgroundColor: 'var(--cn-state-hover)'
            },

            '.cn-sidebar-item-content-title': {
              color: 'var(--cn-text-1)'
            },

            '.cn-sidebar-item-action-menu': {
              opacity: '1'
            }
          },

          '&:hover, &:focus-within': {
            '.cn-sidebar-item-content-action-buttons': {
              display: 'flex !important'
            }
          }
        },

        '&[data-disabled=true]': {
          opacity: 'var(--cn-disabled-opacity)',
          cursor: 'not-allowed'
        }
      },

      '&-content': {
        rowGap: 'var(--cn-spacing-1)',
        minHeight: 'var(--cn-sidebar-item-min)',
        columnGap: 'var(--cn-sidebar-item-gap)',
        justifyItems: 'start',
        alignItems: 'center',
        gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr',
        gridTemplateAreas: '"icon title"',
        paddingInline: 'var(--cn-sidebar-item-px)',
        borderRadius: 'var(--cn-sidebar-item-radius)',
        '@apply duration-150 transition-[padding,row-gap,column-gap] ease-linear': '',

        '&-only-action-buttons': {
          gridTemplateAreas: '"icon title action-buttons"',
          gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr auto'
        },

        '&-w-description': {
          gridTemplateAreas: `
            "icon title"
            "icon description"
          `,
          gridTemplateColumns: 'var(--cn-icon-size-lg) 1fr',
          paddingBlock: 'var(--cn-sidebar-item-py)',

          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: `
            "icon title action-buttons"
            "icon description action-buttons"
          `,
            gridTemplateColumns: 'var(--cn-icon-size-lg) 1fr auto'
          }
        },

        '&-w-r-element': {
          gridTemplateAreas: '"icon title elem"',
          gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr auto',

          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: '"icon title action-buttons elem"',
            gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr auto auto'
          }
        },

        '&-complete': {
          gridTemplateAreas: `
            "icon title       elem"
            "icon description elem"
          `,
          gridTemplateColumns: 'var(--cn-avatar-size-lg) 1fr',
          paddingBlock: 'var(--cn-sidebar-item-py)',

          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: `
            "icon title action-buttons elem"
            "icon description action-buttons elem"
          `,
            gridTemplateColumns: 'var(--cn-avatar-size-lg) 1fr auto auto'
          }
        },

        '&-icon': {
          gridArea: 'icon',
          color: 'var(--cn-text-3)',

          '&-w-border': {
            width: 'var(--cn-icon-size-lg)',
            height: 'var(--cn-icon-size-lg)',
            borderRadius: 'var(--cn-rounded-2)',
            border: '1px solid var(--cn-border-2)',
            display: 'grid',
            placeContent: 'center',
            backgroundImage: 'var(--cn-comp-sidebar-icon-asset-bg)'
          }
        },

        '&-title': {
          maxWidth: '100%',
          gridArea: 'title'
        },

        '&-description': {
          maxWidth: '100%',
          gridArea: 'description'
        },

        '&-badge': {
          margin: '-2px 0',

          '&-secondary': {
            opacity: '1'
          },

          '&.cn-sidebar-item-content-badge-secondary': {
            '@apply duration-150 transition-[opacity] ease-linear': ''
          }
        },

        '&-right-element': {
          gridArea: 'elem'
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
        top: 'calc(50% - var(--cn-size-7)/2)',
        right: '3px',
        display: 'grid',
        placeContent: 'center',
        color: 'var(--cn-text-2)',
        width: 'var(--cn-size-7)',
        height: 'var(--cn-size-7)',
        borderRadius: 'var(--cn-rounded-2)',
        opacity: '1',
        overflow: 'hidden',
        '@apply duration-150 transition-[opacity] ease-linear': '',

        '&:hover, &:focus-within': {
          color: 'var(--cn-text-1)',
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
        padding: 'var(--cn-sidebar-item-py) var(--cn-sidebar-item-px)',
        columnGap: 'var(--cn-sidebar-item-gap)',

        '&-icon, &-text': {
          flexShrink: '0',
          height: 'var(--cn-icon-size-sm)',
          borderRadius: 'var(--cn-rounded-1)',
          backgroundColor: 'var(--cn-bg-1)',
          '@apply animate-pulse': ''
        },

        '&-icon': {
          width: 'var(--cn-icon-size-sm)'
        },

        '&-text': {
          width: '100%',
          maxWidth: 'var(--cn-sidebar-skeleton-width)'
        }
      }
    },

    '&-drawer-content, &-drawer-overlay': {
      borderLeftWidth: '1px',
      left: 'var(--cn-sidebar-container-full-width) !important',

      '&-collapsed': {
        left: 'var(--cn-size-14) !important'
      }
    },

    '&[data-state=collapsed]': {
      '&.cn-sidebar': {
        width: 'var(--cn-size-14)'
      },

      '& .cn-input-prefix': {
        '@apply ml-0': ''
      },

      '.cn-sidebar-group': {
        '--sidebar-group-label-scale': '0',

        '&-header': {
          display: 'none'
        }
      },

      '.cn-sidebar-item': {
        '&-big': {
          maxWidth: '32px',
          marginLeft: '2px'
        },

        '&-content': {
          '@apply pl-cn-xs': '',

          '&-title, &-description, &-badge, &-right-element, &-action-item-placeholder, &-action-buttons': {
            maxWidth: '0',
            padding: '0',
            opacity: '0',
            minWidth: '0'
          },

          '&-w-description, &-complete': {
            padding: '0'
          }
        },

        '&-action-button': {
          maxWidth: '0',
          minWidth: '0',
          opacity: '0'
        }
      }
    }
  }
}
