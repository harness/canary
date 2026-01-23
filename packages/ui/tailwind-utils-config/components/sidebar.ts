export default {
  '.cn-sidebar': {
    '&.cn-sidebar': {
      display: 'flex',
      flexDirection: 'column',
      height: 'var(--cn-sidebar-min-height)',
      minHeight: 'var(--cn-sidebar-item-min-height)',
      backgroundColor: 'var(--cn-comp-sidebar-bg)',
      padding: 'var(--cn-sidebar-container-spacing) 0',

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

    /*'&-header': {
      padding:
        'var(--cn-sidebar-header-pt) var(--cn-sidebar-container-px) var(--cn-sidebar-header-pb) var(--cn-sidebar-container-px)',

      '& .cn-input-prefix': {
        '@apply transition-[margin-left,width] duration-150 ease-linear': ''
      }
    }, We don't have this section anymore */

    '&-content': {
      height: '100%',
      padding: '0 var(--cn-sidebar-container-spacing)',

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
        userSelect: 'none',
        font: 'var(--cn-micro-normal)',
        color: 'var(--cn-text-3)',
        '@apply duration-150 transition-[max-height,padding,opacity,transform] ease-linear': ''
      },

      '&-items': {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--cn-spacing-half)',

        '&-single-col': {
          gridTemplateColumns: '1fr'
        },

        // Popover variant: use fixed width columns (230px per item)
        // Default to 2 columns, can be overridden to 3 columns when content exceeds viewport
        '&-popover': {
          gridTemplateColumns: 'repeat(2, var(--cn-size-58))',
          // Smooth transition when switching between 2 and 3 columns
          transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },

        '&-single-col&-popover': {
          gridTemplateColumns: 'var(--cn-size-58)'
        }
      },

      '&-header': {
        display: 'flex',
        padding: '0px 0px var(--cn-spacing-0) calc(var(--cn-sidebar-item-container) + var(--cn-layout-sm))',
        alignItems: 'center',
        gap: 'var(--cn-sidebar-item-gap)',
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

        '&[data-state="open"]': {
          '@apply animate-accordion-down': ''
        },

        '&[data-state="closed"]': {
          '@apply animate-accordion-up': ''
        }
      },

      '&-item': {
        // Layout
        display: 'grid',
        alignItems: 'center',
        minWidth: 'var(--cn-sidebar-item-min-width)',
        padding: 'var(--cn-spacing-2)',
        paddingLeft: 'var(--cn-layout-sm)',
        borderRadius: 'var(--cn-sidebar-item-radius)',
        outline: 'none',

        // States
        '&:hover, &:focus-within': {
          backgroundColor: 'var(--cn-state-hover)'
        },

        // Modifiers
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

      '&:hover': {
        /**
         * This is to override the parent default styles
         */
        '.cn-sidebar-item-content-title': {
          color: 'var(--cn-comp-sidebar-item-text-hover)'
        },
        textDecoration: 'none !important'
      },

      '&-big': {
        maxWidth: '100%'
      },

      '&-active': {
        '.cn-sidebar-item-content-title': {
          color: 'var(--cn-comp-sidebar-item-text-selected)'
        }
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
        // Enable pointer events for drag functionality
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
          // Hover/focus for non-active items
          '&:hover, &:focus-within': {
            '&[data-active=false]': {
              '.cn-sidebar-item-content': {
                backgroundColor: 'var(--cn-state-hover)'
              }
            },
            '.cn-sidebar-item-content-title': {
              color: 'var(--cn-comp-sidebar-item-text-hover)'
            },
            '.cn-sidebar-item-action-menu': {
              opacity: '1'
            },
            '.cn-sidebar-item-content-action-buttons': {
              display: 'flex !important'
            },
            '.cn-sidebar-item-grip-handle': {
              opacity: '1'
            },
            // Expand icon (nav-arrow-right) color on hover - match action-button
            '.cn-sidebar-item-content-right-element': {
              color: 'var(--cn-text-1)',
              '& svg, & path': {
                color: 'var(--cn-text-1)',
                stroke: 'var(--cn-text-1)',
                fill: 'none'
              }
            }
          },

          // Active item
          '&[data-active=true][data-clickable=true]': {
            '.cn-sidebar-item-content': {
              background: 'var(--cn-comp-sidebar-item-selected)'
            },
            '.cn-sidebar-item-content-title': {
              color: 'var(--cn-comp-sidebar-item-text-selected)'
            },
            '.cn-sidebar-item-action-menu': {
              opacity: '1'
            },
            '.cn-sidebar-item-active-indicator': {
              backgroundColor: 'var(--cn-set-brand-primary-bg)',
              height: '12px',
              width: '2px'
            },
            // Expand icon (nav-arrow-right) color on active - match action-button
            '.cn-sidebar-item-content-right-element': {
              color: 'var(--cn-text-2)',
              '& svg, & path': {
                color: 'var(--cn-text-2)',
                stroke: 'var(--cn-text-2)',
                fill: 'none'
              }
            },
            '&:hover, &:focus-within': {
              '.cn-sidebar-item-grip-handle': {
                opacity: '1'
              }
            }
          }
        },

        '&[data-disabled=true]': {
          opacity: 'var(--cn-disabled-opacity)',
          cursor: 'not-allowed'
        }
      },

      '&-content': {
        minHeight: 'var(--cn-sidebar-item-min-height)',
        minWidth: 'var(--cn-sidebar-item-min-width)',
        gap: 'var(--cn-sidebar-item-gap)',
        justifyItems: 'start',
        alignItems: 'center',
        gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr',
        gridTemplateAreas: '"icon title"',
        padding: 'var(--cn-sidebar-item-container)',
        paddingLeft: 'calc(var(--cn-sidebar-item-container) + var(--cn-layout-sm))',
        borderRadius: 'var(--cn-sidebar-item-radius)',
        '@apply duration-150 transition-[padding,row-gap,column-gap] ease-linear': '',

        '&:hover, &:focus-within': {
          color: 'var(--cn-text-1)',
          backgroundColor: 'var(--cn-state-hover)'
        },

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
          paddingBlock: 'var(--cn-sidebar-item-container)',

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
          paddingBlock: 'var(--cn-sidebar-item-container)',

          '&:has(.cn-sidebar-item-content-action-buttons)': {
            gridTemplateAreas: `
            "icon title action-buttons elem"
            "icon description action-buttons elem"
          `,
            gridTemplateColumns: 'var(--cn-avatar-size-lg) 1fr auto auto'
          }
        },
        /* Deprecated class

                '&-icon': {
                  gridArea: 'icon',
        
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
              */

        '&-icon': {
          gridArea: 'icon'
        },

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

          '&-secondary': {
            opacity: '1'
          },

          '&.cn-sidebar-item-content-badge-secondary': {
            '@apply duration-150 transition-[opacity] ease-linear': ''
          }
        },

        '&-right-element': {
          gridArea: 'elem',
          display: 'grid',
          placeContent: 'center',
          width: 'var(--cn-size-7)',
          height: 'var(--cn-size-7)',
          color: 'var(--cn-text-2)',
          justifyContent: 'flex-end',
          '& svg, & path': {
            color: 'var(--cn-text-2)',
            stroke: 'var(--cn-text-2)',
            fill: 'none'
          }
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
        right: '4px',
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
        padding: 'var(--cn-sidebar-item-container)',
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
          // width: '100%',
          maxWidth: 'var(--cn-sidebar-skeleton-width)'
        }
      }
    },

    '&-drawer-content, &-drawer-overlay': {
      borderLeftWidth: '1px',
      left: 'var(--cn-size-56) !important',

      '&-collapsed': {
        left: 'var(--cn-size-16) !important'
      }
    },

    '&-modules-container': {
      display: 'flex',
      flexDirection: 'column'
    },

    '&-item-popover': {
      // Popover variant for sidebar items with bordered icons
      width: 'var(--cn-size-58)',
      minWidth: 'var(--cn-size-58)',
      maxWidth: 'var(--cn-size-58)',

      '.cn-sidebar-item-content': {
        gridTemplateColumns: 'var(--cn-size-7) 1fr',
        paddingLeft: 'var(--cn-sidebar-item-container)',

        '&-title': {
          font: 'var(--cn-body-single-line-normal)',
          color: 'var(--cn-comp-sidebar-item-text)'
        },

        '&-icon': {
          paddingLeft: '0'
        }
      },

      // Icon with border container effect
      // SVG is 16px (iconSize/sm), padding creates 28px total (size/7)
      // Total: 16px + 5px*2 padding + 1px*2 border = 28px
      '.cn-icon.cn-icon-2xs, .cn-icon.cn-icon-xs, .cn-icon.cn-icon-sm, .cn-icon.cn-icon-md, .cn-icon.cn-icon-lg, .cn-icon.cn-icon-xl':
        {
          width: 'var(--cn-icon-size-sm) !important',
          minWidth: 'var(--cn-icon-size-sm) !important',
          height: 'var(--cn-icon-size-sm) !important',
          minHeight: 'var(--cn-icon-size-sm) !important',
          padding: 'calc((var(--cn-size-7) - var(--cn-icon-size-sm) - 2px) / 2)',
          boxSizing: 'content-box',
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

    '&[data-state=collapsed]': {
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
          maxWidth:
            '38px' /* I don’t have a fixed value for the collapsed state in the design — it depends on the padding */
          /* marginLeft: '2px' / Why we need that? */
        },

        '&-content': {
          '&-title, &-description, &-badge, &-right-element, &-action-item-placeholder, &-action-buttons': {
            maxWidth: '0',
            padding: '0',
            opacity: '0',
            minWidth: '0'
          },

          '&-w-description, &-complete': {
            padding: '0'
          },

          '&-icon': {
            justifySelf: 'center'
          }
        },

        '&-action-button': {
          maxWidth: '0',
          minWidth: '0',
          opacity: '0'
        }
      }
    }
  },

  // Hidden measurement container for popover column calculation
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

  // Sidebar popover
  '.cn-popover-content.cn-sidebar-popover': {
    paddingRight: 'var(--cn-popover-px)',
    paddingBottom: 'var(--cn-layout-xs)',
    paddingLeft: 'var(--cn-popover-px)',
    backgroundColor: 'var(--cn-bg-2)',
    // First group: Remove top padding to prevent overlap with popover padding
    '& > div > div:first-child .cn-sidebar-group': {
      paddingTop: '0'
    },
    // Reset padding left for group headers in popover (only side nav should have padding left)
    '.cn-sidebar-group-header': {
      paddingLeft: 'var(--cn-sidebar-item-container)',
      paddingBottom: 'var(--cn-spacing-1-half)'
    },

    // Last group (Go to settings footer button)
    '.cn-sidebar-popover-footer': {
      marginTop: 'calc(-1 * var(--cn-spacing-2))',
      padding: 'var(--cn-layout-xs)',
      width: 'fit-content',
      justifyContent: 'flex-start'
    },

    // Separator styling for popover to match Figma
    '.cn-sidebar-separator': {
      marginTop: 'var(--cn-spacing-0)',
      marginBottom: 'calc(var(--cn-spacing-4) - var(--cn-spacing-px))',
      marginLeft: 'var(--cn-spacing-half)',
      marginRight: 'var(--cn-spacing-half)',
      height: '1px',
      width: 'calc(100% - 2 * var(--cn-layout-4xs))',
      backgroundColor: 'var(--cn-comp-sidebar-separator)'
    }
  },

  // 3-column layout when content exceeds viewport
  '.cn-sidebar-group-items-popover-3col': {
    gridTemplateColumns: 'repeat(3, var(--cn-size-48)) !important',
    // Ensure transition applies when switching to 3 columns
    transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
