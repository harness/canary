/**
 * SidebarV2 Styles
 *
 * Based on Figma Design: Harness Design System 3.0 BETA
 * Node: 2060:26364
 *
 * Design Tokens from core-design-system:
 *
 * Layout/Sizing:
 * --cn-sidebar-container-min-width, --cn-sidebar-container-full-width
 * --cn-sidebar-container-spacing, --cn-sidebar-item-container
 * --cn-sidebar-item-gap, --cn-sidebar-item-radius
 * --cn-sidebar-item-min-height, --cn-sidebar-item-min-width
 * --cn-sidebar-group-py, --cn-sidebar-group-gap
 * --cn-sidebar-fade-height
 *
 * Colors:
 * --cn-comp-sidebar-bg, --cn-comp-sidebar-item-hover
 * --cn-comp-sidebar-item-text, --cn-comp-sidebar-item-text-hover
 * --cn-comp-sidebar-item-text-selected, --cn-comp-sidebar-item-text-subtle
 * --cn-comp-sidebar-item-selected, --cn-comp-sidebar-separator
 */

export default {
  '.cn-sidebarv2': {
    // ==========================================================================
    // ROOT
    // ==========================================================================
    height: '100%',
    display: 'flex',
    width: 'var(--cn-sidebar-container-full-width, 230px)',
    padding: 'var(--cn-sidebar-container-spacing, 6px)',
    flexDirection: 'column',
    alignItems: 'flex-start',
    transition: 'width 0.3s ease-out',

    '&[data-state="collapsed"]': {
      width: 'var(--cn-sidebar-container-min-width, 58px)'
    },

    // ==========================================================================
    // GROUP
    // ==========================================================================
    '&-group': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%',
      gap: 'var(--cn-sidebar-group-gap, 2px)',
      padding: 'var(--cn-sidebar-group-py, 8px) 0',

      '&-label': {
        display: 'flex',
        userSelect: 'none',
        marginLeft: 'var(--cn-layout-sm, 12px)',
        minWidth: 'var(--cn-sidebar-item-min-width, 46px)',
        minHeight: 'var(--cn-sidebar-item-min-height, 32px)',
        gap: 'var(--cn-sidebar-item-gap, 8px)',
        padding: 'var(--cn-sidebar-item-container, 2px)',
        alignItems: 'center',
        alignSelf: 'stretch',
        color: 'var(--cn-comp-sidebar-item-text)',
        font: 'var(--cn-font-caption-single-line-normal-caps)',

        '[data-state="collapsed"] &': {
          opacity: '0',
          maxHeight: '0',
          overflow: 'hidden'
        }
      }
    },

    // ==========================================================================
    // SEPARATOR
    // ==========================================================================
    '&-separator': {
      backgroundColor: 'var(--cn-comp-sidebar-separator)'
    },

    // ==========================================================================
    // ITEM
    // ==========================================================================
    '&-item': {
      display: 'flex',
      alignItems: 'center',
      minHeight: 'var(--cn-sidebar-item-min-height)',
      padding: 'var(--cn-sidebar-item-container)',
      borderRadius: 'var(--cn-sidebar-item-radius)',
      gap: 'var(--cn-sidebar-item-gap)',
      cursor: 'pointer',
      position: 'relative',

      // Hover state
      '&:hover': {
        background: 'var(--cn-comp-sidebar-item-hover)'
      },

      // Selected state
      '&-selected, &-active': {
        background: 'var(--cn-comp-sidebar-item-selected)',

        '&::before': {
          content: '""',
          position: 'absolute',
          left: '0',
          width: '2px',
          height: '12px',
          background: 'var(--cn-set-brand-primary-bg)'
        },

        // Hide indicator on hover
        '&:hover::before': {
          display: 'none'
        }
      },

      // ----- ITEM CONTENT -----
      '&-content': {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--cn-spacing-1, 4px)',
        flex: '1 0 0',
        flexWrap: 'wrap',
        minWidth: '0'
      },

      // ----- ITEM PREFIX -----
      '&-prefix': {
        paddingLeft: 'var(--cn-spacing-3, 12px)'
      },

      // ----- ITEM TEXT -----
      '&-text': {
        flex: '1',
        minWidth: '0',
        color: 'var(--cn-comp-sidebar-item-text)',

        '@apply font-body-single-line-normal truncate text-left': '',

        '.cn-sidebarv2-item:hover &:not(.cn-sidebarv2-item-selected &)': {
          color: 'var(--cn-comp-sidebar-item-text-hover)'
        },

        '.cn-sidebarv2-item-selected &, .cn-sidebarv2-item-active &': {
          color: 'var(--cn-comp-sidebar-item-text-selected)',

          '@apply font-body-single-line-strong': ''
        }
      },

      // ----- ITEM SUBCONTENT (Expandable children) -----
      '&-subcontent': {
        overflow: 'hidden',

        // Collapsed state (default)
        '&[data-subcontent-expanded="false"]': {
          maxHeight: '0',
          '@apply animate-accordion-up': ''
        },

        // Expanded state
        '&[data-subcontent-expanded="true"]': {
          '@apply animate-accordion-down': ''
        }
      }
    }
  }
}
