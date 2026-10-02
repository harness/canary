export default {
  '.cn-drawer': {
    '&-content': {
      userSelect: 'auto !important',
      backgroundColor: 'var(--cn-bg-1)',
      borderColor: 'var(--cn-border-3)',
      borderRadius: 'var(--cn-drawer-radius)',
      boxShadow: 'var(--cn-shadow-5)',
      overflow: 'hidden',
      outline: 'none',
      // Cap content at the viewport so a drawer never overflows the screen, regardless
      // of `size` or layout. Originally added to keep dual-pane drawers usable on small
      // viewports (the dual pane behaves like `size="full"` once the chosen size exceeds
      // 100vw / 100vh), but applies to all drawers because a drawer larger than the
      // viewport is broken UX in any context.
      maxWidth: '100vw',
      maxHeight: '100vh',
      '@apply fixed flex flex-col z-50 border': '',

      '&:where(.cn-drawer-content-right), &:where(.cn-drawer-content-left)': {
        '@apply inset-y-0 !h-auto': '',

        '&:where(.cn-drawer-content-2xs)': {
          width: 'var(--cn-drawer-2xs)'
        },
        '&:where(.cn-drawer-content-xs)': {
          width: 'var(--cn-drawer-xs)'
        },
        '&:where(.cn-drawer-content-sm)': {
          width: 'var(--cn-drawer-sm)'
        },
        '&:where(.cn-drawer-content-md)': {
          width: 'var(--cn-drawer-md)'
        },
        '&:where(.cn-drawer-content-lg)': {
          width: 'var(--cn-drawer-lg)'
        },
        '&:where(.cn-drawer-content-xl)': {
          width: 'var(--cn-drawer-xl)'
        },
        '&:where(.cn-drawer-content-full)': {
          width: 'var(--cn-drawer-full)'
        }
      },

      '&:where(.cn-drawer-content-top), &:where(.cn-drawer-content-bottom)': {
        '@apply inset-x-0 !w-auto': '',

        '&:where(.cn-drawer-content-2xs)': {
          height: 'var(--cn-drawer-2xs)'
        },
        '&:where(.cn-drawer-content-xs)': {
          height: 'var(--cn-drawer-xs)'
        },
        '&:where(.cn-drawer-content-sm)': {
          height: 'var(--cn-drawer-sm)'
        },
        '&:where(.cn-drawer-content-md)': {
          height: 'var(--cn-drawer-md)'
        },
        '&:where(.cn-drawer-content-lg)': {
          height: 'var(--cn-drawer-lg)'
        },
        '&:where(.cn-drawer-content-xl)': {
          height: 'var(--cn-drawer-xl)'
        },
        '&:where(.cn-drawer-content-full)': {
          height: 'var(--cn-drawer-full)'
        }
      },

      '&:where(.cn-drawer-content-right)': {
        '@apply border-r-0 rounded-r-cn-none right-0': ''
      },

      '&:where(.cn-drawer-content-left)': {
        '@apply border-l-0 rounded-l-cn-none left-0': ''
      },

      '&:where(.cn-drawer-content-top)': {
        '@apply border-t-0 rounded-t-cn-none top-0': ''
      },

      '&:where(.cn-drawer-content-bottom)': {
        '@apply border-b-0 rounded-b-cn-none bottom-0': ''
      },

      '&[data-vaul-drawer]:not([data-vaul-custom-container=true])::after': {
        display: 'none'
      }
    },

    '&-close-button': {
      '&-icon': {
        flexShrink: '0',
        width: `var(--cn-icon-size-sm)`,
        height: `var(--cn-icon-size-sm)`
      }
    },

    '&-backdrop': {
      backgroundColor: 'var(--cn-comp-dialog-backdrop)',
      '@apply fixed inset-0 z-50': '',

      '&-nested': {
        backgroundColor: 'var(--cn-comp-dialog-backdrop-nested)'
      }
    },

    '&-header': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      // 8px between stacked blocks (used by the description-only fallback with no title group).
      gap: 'var(--cn-spacing-2)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-b': '',

      '&-icon': {
        flexShrink: '0'
      },

      '&-icon-color': {
        // Icons inherit the title color (text-1); logos keep their own brand colors.
        color: 'var(--cn-text-1)'
      },

      // Description and any other composed children: full-width row below the title group,
      // offset 8px from it. Own gap handles spacing between multiple children.
      '&-content': {
        gridColumn: '1 / -1',
        gridRow: '2',
        marginTop: 'var(--cn-spacing-2)',
        gap: 'var(--cn-spacing-2)',
        '@apply flex flex-col': ''
      },

      // Grid so the close button (column 2, spanning both rows) anchors to the top-right
      // without dictating the row height — keeps the description 8px below the title, not
      // below the taller close button.
      '&-top': {
        '@apply grid items-start': '',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: '0px var(--cn-spacing-half)',
        rowGap: '0px',

        '& .cn-drawer-close-button': {
          gridColumn: '2',
          gridRow: '1 / span 2',
          '@apply self-start': ''
        }
      },

      // Tagline stacks above; the title line holds the icon/logo inline with the title.
      '&-strings': {
        gridColumn: '1',
        gridRow: '1',
        gap: 'var(--cn-spacing-half)',
        '@apply flex flex-col min-w-0': ''
      },

      '&-title-line': {
        gap: 'var(--cn-spacing-1-half)',
        '@apply flex items-center': ''
      },

      // Match the V2 header typography for the legacy composition API. Scoped to the
      // legacy header so Drawer.Title / Drawer.Tagline used elsewhere are unaffected.
      '& .cn-drawer-title': {
        font: 'var(--cn-heading-default)'
      },
      '& .cn-drawer-tagline': {
        font: 'var(--cn-caption-normal)'
      }
    },

    '&-title': {
      font: 'var(--cn-comp-dialog-title)',
      color: 'var(--cn-text-1)',
      wordBreak: 'break-word'
    },

    '&-tagline': {
      font: 'var(--cn-caption-light)',
      color: 'var(--cn-text-2)'
    },

    '&-description': {
      font: 'var(--cn-body-normal)',
      color: 'var(--cn-text-2)'
    },

    '&-body': {
      '@apply size-full': '',

      '&-content': {
        padding: 'var(--cn-drawer-container)',
        overflowX: 'clip'
      }
    },

    '&-body-wrap': {
      '@apply flex-1 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:z-10 after:z-10 after:absolute after:inset-x-0 after:bottom-0':
        '',

      '&:before': {
        height: 'var(--cn-drawer-fade-height)',
        background: 'var(--cn-comp-dialog-fade-start)',
        pointerEvents: 'none'
      },

      '&:after': {
        height: 'var(--cn-drawer-fade-height)',
        background: 'var(--cn-comp-dialog-fade-end)',
        pointerEvents: 'none'
      },

      '&:where(.cn-drawer-body-wrap-top)': {
        '@apply before:hidden': ''
      },

      '&:where(.cn-drawer-body-wrap-bottom)': {
        '@apply after:hidden': ''
      }
    },

    '&-footer': {
      borderTopWidth: 'var(--cn-border-width-1)',
      borderTopColor: 'var(--cn-border-3)',
      gap: 'var(--cn-drawer-gap)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-t': '',

      // Structured footer: one action bar row — an optional tertiary button pinned to the far
      // left (2px from the actions), with secondary + primary actions right-aligned. The
      // layout and spacing stay fixed; only which buttons appear varies (Figma footer spec).
      '&-action-bar': {
        gap: 'var(--cn-spacing-half)',
        '@apply flex w-full items-start': ''
      },

      // Secondary + primary cluster: fills the row and right-aligns, 12px between buttons.
      '&-actions': {
        gap: 'var(--cn-spacing-3)',
        '@apply flex min-w-0 flex-1 items-center justify-end': ''
      }
    },

    '&-dual-pane': {
      '--cn-drawer-dual-pane-rail-width': '19.125rem',
      '--cn-drawer-dual-pane-main-min-width': 'var(--cn-drawer-xs)',
      width: '100%',
      minWidth: '0',
      '@apply flex min-h-0 w-full min-w-0 flex-1 flex-row overflow-x-auto overflow-y-hidden': ''
    },

    '&-dual-pane-rail': {
      width: 'var(--cn-drawer-dual-pane-rail-width)',
      minWidth: 'var(--cn-drawer-dual-pane-rail-width)',
      maxWidth: 'var(--cn-drawer-dual-pane-rail-width)',
      flexShrink: '0',
      backgroundColor: 'var(--cn-bg-2)',
      borderRightWidth: 'var(--cn-border-width-1)',
      borderRightColor: 'var(--cn-border-3)',
      '@apply flex min-h-0 flex-col overflow-hidden border-r': ''
    },

    '&-dual-pane-rail-header': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      padding: 'var(--cn-drawer-container) var(--cn-drawer-container) var(--cn-drawer-container) var(--cn-spacing-8)',
      flexShrink: '0',
      '@apply flex flex-col border-b': '',

      '&:where(.cn-drawer-dual-pane-rail-header-at-top)': {
        borderBottomColor: 'transparent'
      }
    },

    '&-dual-pane-rail-header-title': {
      // Match the drawer header title (heading-default) so the rail and main
      // pane headers read as one consistent header row.
      font: 'var(--cn-heading-default)',
      letterSpacing: 'var(--cn-tracking-tight)',
      color: 'var(--cn-text-1)',
      margin: '0',
      wordBreak: 'break-word'
    },

    '&-dual-pane-rail-body': {
      '@apply flex-1 min-h-0': ''
    },

    '&-dual-pane-rail-content': {
      padding: '0 var(--cn-drawer-container) var(--cn-drawer-container)'
    },

    '&-dual-pane-main': {
      minWidth: 'var(--cn-drawer-dual-pane-main-min-width)',
      '@apply flex min-h-0 flex-1 flex-col overflow-hidden': ''
    },

    '&-header-v2': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-b': '',
      gap: 'var(--cn-spacing-3)',

      // Grid so the actions/close cluster (column 2, spanning both rows) can anchor to the
      // top-right WITHOUT dictating the row height. That keeps the description exactly 8px
      // below the title even when the cluster is taller than a single-line title.
      '&-main': {
        '@apply grid w-full items-start': '',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        columnGap: 'var(--cn-spacing-half)',

        // Figma spec uses caption/normal (400) for the V2 tagline.
        // Scoped to V2 so the legacy Drawer.Tagline (caption-light) is unaffected.
        '& .cn-drawer-tagline': {
          font: 'var(--cn-caption-normal)'
        },

        // No tagline and no description: the header is a single row, so vertically center
        // the title/icon with the actions + close cluster rather than top-aligning them.
        // Compound class (not :where) so it outweighs the base `items-start` above —
        // :where contributes 0 specificity, leaving both rules equal and the base winning.
        '&.cn-drawer-header-v2-main-centered': {
          '@apply items-center': '',

          '& .cn-drawer-header-v2-actions': {
            // Collapse the actions back into row 1 so the title group and the actions
            // share ONE row and center against the same track. Left at its default
            // `1 / span 2`, the taller actions grow row 2 as well, so the two items sit
            // in differently-sized areas and their centers never line up. No description
            // exists in the centered case, so row 2 is unused anyway.
            gridRow: '1',
            '@apply self-center': ''
          }
        },

        // When a tagline stacks above the title, the title group is two lines tall. Pin the
        // actions + close cluster to the TOP of that block, flush with the top of the header,
        // rather than letting it span down into the description row. Confining it to row 1
        // (the title group) keeps it top-aligned there: the title group is always taller than
        // the single-row cluster, so it still sets the row height and the description stays
        // 8px below it in row 2.
        '&.cn-drawer-header-v2-main-with-tagline': {
          '& .cn-drawer-header-v2-actions': {
            gridRow: '1',
            '@apply self-start': ''
          }
        }
      },

      // Tagline + icon + title, grouped in the first column of the first row.
      '&-title-group': {
        gridColumn: '1',
        gridRow: '1'
      },

      // Actions + close cluster: second column, spanning both rows and top-anchored so its
      // height never pushes the description down.
      '&-actions': {
        gridColumn: '2',
        gridRow: '1 / span 2',
        '@apply self-start': ''
      },

      // The icon/logo sits inline with the title (centered with it), with the
      // tagline spanning above — spacing handled by the ContainerHeader layout.
      '&-icon': {
        '@apply shrink-0': ''
      },

      '&-icon-color': {
        // Icons inherit the title color (text-1); logos keep their own brand colors.
        color: 'var(--cn-text-1)'
      },

      // Full-width row directly below the title group, offset 8px from it.
      '&-description': {
        gridColumn: '1 / -1',
        gridRow: '2',
        marginTop: 'var(--cn-spacing-2)',
        '@apply line-clamp-2': ''
      },

      '&-metadata': {
        paddingTop: 'var(--cn-spacing-1)'
      },

      '&-tabs': {
        // A touch of breathing room above the tab strip: the header's 12px flex gap is
        // cancelled by the negative top margin (tabs would otherwise sit flush), so this
        // padding is the only space between the content above and the strip. It pads the
        // wrapper around <Tabs.List>, never the tab component itself.
        paddingTop: 'var(--cn-spacing-2)',
        marginTop: 'calc(-1 * var(--cn-spacing-3))',
        marginBottom: 'calc(-1 * var(--cn-drawer-container))'
      }
    }
  }
}
