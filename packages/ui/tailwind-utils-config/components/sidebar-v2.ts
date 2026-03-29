import type { CSSRuleObject } from 'tailwindcss/types/config'

const strokeIcon = (token: string): CSSRuleObject => ({
  color: token,
  '& svg, & path': { color: token, stroke: token, fill: 'none' }
})

const collapsedV2Styles: CSSRuleObject = {
  '.cn-sidebar-item-v2-content': {
    justifyContent: 'center',
    padding: 'var(--cn-sidebar-item-container)',
    minWidth: 'calc(var(--cn-sidebar-item-min-width) - 2 * var(--cn-sidebar-container-px))'
  },
  '.cn-sidebar-item-v2-center, .cn-sidebar-item-v2-trailing, .cn-sidebar-item-v2-badge, .cn-sidebar-item-v2-actions':
    {
      maxWidth: '0',
      padding: '0',
      opacity: '0',
      overflow: 'hidden'
    },
  '.cn-sidebar-item-v2-action-menu': {
    maxWidth: '0',
    minWidth: '0',
    opacity: '0'
  }
}

export default {
  '.cn-sidebar[data-state=collapsed]': collapsedV2Styles,

  '.cn-sidebar-item-v2': {
    maxWidth: '100%',
    overflow: 'hidden',
    '&:hover': { textDecoration: 'none !important' },
    '@apply duration-150 transition-[max-width,margin-left,padding] ease-linear': '',

    '&-route-active': {
      '.cn-sidebar-item-v2-title': { color: 'var(--cn-comp-sidebar-item-text-selected)' },
      '.cn-sidebar-item-v2-leading': { color: 'var(--cn-comp-sidebar-item-text-selected)' }
    },

    // ── Wrapper ──
    '&-wrapper': {
      position: 'relative',
      display: 'grid',
      maxWidth: '100%',
      overflow: 'hidden',

      '&::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '2px',
        height: '12px',
        borderRadius: '1px',
        backgroundColor: 'transparent',
        zIndex: '1',
        '@apply duration-150 transition-[background-color] ease-linear': ''
      },

      '&[data-active=true]::before': {
        backgroundColor: 'var(--cn-set-brand-primary-bg)'
      },

      '&:not([data-disabled=true])': {
        '&:hover, &:focus-within': {
          '.cn-sidebar-item-v2-content': { backgroundColor: 'var(--cn-state-hover)' },
          '.cn-sidebar-item-v2-title': { color: 'var(--cn-comp-sidebar-item-text-hover)' },
          '.cn-sidebar-item-v2-leading': { color: 'var(--cn-comp-sidebar-item-text-hover)' },
          '.cn-sidebar-item-v2-action-menu': { opacity: '1' },
          '.cn-sidebar-item-v2-actions': { display: 'flex' },
          '.cn-sidebar-item-v2-grip': { opacity: '1' },
          '.cn-sidebar-item-v2-trailing': strokeIcon('var(--cn-text-1)')
        },

        '&[data-active=true]': {
          '.cn-sidebar-item-v2-content': { background: 'var(--cn-comp-sidebar-item-selected)' },
          '.cn-sidebar-item-v2-title': { color: 'var(--cn-comp-sidebar-item-text-selected)' },
          '.cn-sidebar-item-v2-leading': { color: 'var(--cn-comp-sidebar-item-text-selected)' },
          '.cn-sidebar-item-v2-action-menu': { opacity: '1' },
          '.cn-sidebar-item-v2-trailing': strokeIcon('var(--cn-text-2)'),
          '&:hover, &:focus-within': {
            '.cn-sidebar-item-v2-grip': { opacity: '1' }
          }
        }
      },

      '&[data-disabled=true]': {
        opacity: 'var(--cn-disabled-opacity)',
        cursor: 'not-allowed'
      }
    },

    // ── Content row (flexbox) ──
    '&-content': {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--cn-layout-xs)',
      padding: 'var(--cn-sidebar-item-container)',
      borderRadius: 'var(--cn-sidebar-item-radius)',
      minHeight: 'var(--cn-sidebar-item-min-height)',
      color: 'var(--cn-text-2)',
      '@apply duration-150 transition-[padding,background-color] ease-linear': '',

      '&-w-desc': {
        '.cn-sidebar-item-v2-leading': {
          alignSelf: 'stretch',
          display: 'flex',
          alignItems: 'center'
        },
        '.cn-sidebar-item-v2-leading-bordered': {
          alignSelf: 'stretch',
          display: 'flex',
          alignItems: 'center'
        }
      }
    },

    // ── Leading (icon/logo/avatar) ──
    '&-leading': {
      flexShrink: '0',

      '&-bordered': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },

    // ── Center (title + description stack) ──
    '&-center': {
      flex: '1',
      minWidth: '0',
      display: 'flex',
      flexDirection: 'column',
      '@apply duration-150 transition-[max-width,opacity] ease-linear': ''
    },

    '&-title': {
      maxWidth: '100%',
      userSelect: 'none'
    },

    '&-desc': {
      maxWidth: '100%',
      userSelect: 'none'
    },

    // ── Trailing (chevrons, up-down) ──
    '&-trailing': {
      flexShrink: '0',
      display: 'grid',
      placeContent: 'center',
      width: 'var(--cn-size-6)',
      height: 'var(--cn-size-6)',
      ...strokeIcon('var(--cn-text-2)'),
      '@apply duration-150 transition-[opacity] ease-linear': ''
    },

    // ── Badge ──
    '&-badge': {
      flexShrink: '0',
      margin: '-2px 0'
    },

    // ── Inline action buttons (hidden until hover) ──
    '&-actions': {
      display: 'none',
      flexShrink: '0',
      gap: '0'
    },

    // ── 3-dot action menu (absolute, hidden until hover) ──
    '&-action-menu': {
      position: 'absolute',
      zIndex: '1',
      top: 'calc(50% - var(--cn-size-6)/2)',
      right: '4px',
      display: 'grid',
      placeContent: 'center',
      width: 'var(--cn-size-6)',
      height: 'var(--cn-size-6)',
      borderRadius: 'var(--cn-rounded-2)',
      opacity: '0',
      overflow: 'hidden',
      ...strokeIcon('var(--cn-text-2)'),
      '@apply duration-200 transition-[opacity] ease-linear': '',
      '&[data-state="open"]': { color: 'var(--cn-text-1)', opacity: '1' },
      '&:hover, &:focus-within': {
        ...strokeIcon('var(--cn-text-1)'),
        backgroundColor: 'var(--cn-state-hover)'
      }
    },

    // ── Grip handle (absolute, hidden until hover) ──
    '&-grip': {
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
      opacity: '0',
      '@apply duration-150 transition-[opacity] ease-linear': '',

      '&-icon': {
        color: 'var(--cn-comp-sidebar-item-text-subtle)',
        width: 'var(--cn-icon-size-2xs)',
        height: 'var(--cn-icon-size-2xs)',
        flexShrink: '0'
      }
    },

    // ── Submenu sub-item row ──
    '&-submenu-row': {
      display: 'flex',
      alignItems: 'center'
    },
    '&-submenu-indicator': {
      position: 'relative',
      left: 'var(--cn-layout-4xs)',
      top: '10px',
      height: '12px',
      width: '2px',
      backgroundColor: 'var(--cn-set-brand-primary-bg)',
      flexShrink: '0'
    }
  }
}
