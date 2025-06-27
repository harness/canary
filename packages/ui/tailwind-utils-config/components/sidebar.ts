export default {
  '.cn-sidebar': {
    '&.cn-sidebar': {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: 'var(--cn-sidebar-width)',
      backgroundColor: 'var(--cn-bg-0)',
      padding: 'var(--cn-spacing-2-half)',

      '&-desktop': {
        top: '0px',
        position: 'sticky',
        '@apply duration-200 transition-[width] ease-linear': ''
      }
    },

    '&-wrapper': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      height: '100vh'
    },

    '&-rail': {
      width: '16px',
      zIndex: '20',
      cursor: 'ew-resize',
      position: 'absolute',
      '@apply inset-y-0 hidden group-data-[side=left]:-right-2 group-data-[side=right]:-left-2 md:flex': ''
    },

    '&-inset': {
      width: '100%',
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: 'var(--cn-bg-0)'
    },

    '&-header': {
      padding: 'var(--cn-spacing-2-half) 0 var(--cn-spacing-1) 0'
    },

    '&-footer': {
      paddingTop: 'var(--cn-spacing-1)'
    },

    '&-separator': {
      backgroundColor: 'var(--cn-borders-2)'
    },

    '&-group': {
      display: 'grid',
      gap: 'var(--cn-sidebar-group-gap)',
      padding: 'var(--cn-sidebar-group-py) 0',

      '&-label': {
        padding: 'var(--cn-sidebar-item-py) var(--cn-sidebar-item-px)'
      }
    },

    '&-menu': {
      display: 'grid',
      gap: 'var(--cn-sidebar-group-gap)'
    },

    '&-item': {
      position: 'relative',
      width: '100%',

      ':hover, &:focus-within': {
        '& > .cn-sidebar-item-content': {
          backgroundColor: 'var(--cn-state-hover)'
        },

        '& > .cn-sidebar-item-action-menu': {
          opacity: '1'
        }
      },

      '&-content': {
        rowGap: 'var(--cn-spacing-1-half)',
        columnGap: 'var(--cn-sidebar-item-gap)',
        justifyItems: 'start',
        alignItems: 'center',
        gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr',
        gridTemplateAreas: '"icon title"',
        padding: 'var(--cn-sidebar-item-py) var(--cn-sidebar-item-px)',
        borderRadius: 'var(--sidebar-item-radius)',

        '&-w-description': {
          gridTemplateAreas: `
            "icon title"
            "icon description"
          `,
          gridTemplateColumns: 'var(--cn-icon-size-lg) 1fr'
        },

        '&-w-r-element': {
          gridTemplateAreas: '"icon title elem"',
          gridTemplateColumns: 'var(--cn-icon-size-sm) 1fr auto'
        },

        '&-complete': {
          gridTemplateAreas: `
            "icon title       elem"
            "icon description elem"
          `,
          gridTemplateColumns: 'var(--cn-icon-size-lg) 1fr'
        },

        '&-icon': {
          gridArea: 'icon'
        },

        '&-title': {
          maxWidth: '100%',
          gridArea: 'title'
        },

        '&-description': {
          maxWidth: '100%',
          gridArea: 'description'
        },

        '&-right-element': {
          gridArea: 'elem'
        }
      },

      '&-action-menu': {
        display: 'grid',
        placeContent: 'center',
        opacity: '0',
        color: 'var(--cn-text-2)',
        width: 'var(--cn-size-4)',
        height: 'var(--cn-size-4)',
        borderRadius: 'var(--cn-rounded-2)',
        '@apply transition-opacity duration-200 ease-linear': '',

        '&:hover, &:focus-within': {
          color: 'var(--cn-text-1)',
          backgroundColor: 'var(--cn-state-hover)'
        }
      }
    }
  }
}
