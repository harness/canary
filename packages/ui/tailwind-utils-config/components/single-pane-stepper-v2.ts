export default {
  '.cn-single-pane-stepper-v2-root': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
    marginInline: 'auto',
    height: '100%',
    flex: '1',
    minHeight: '0',
    background: 'var(--cn-bg-2)',
    overflow: 'hidden'
  },

  '.cn-single-pane-stepper-v2-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-v2-close-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    color: 'var(--cn-text-2)',
    flexShrink: '0',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',

    '&:hover': {
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-single-pane-stepper-v2-body': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: '0',
    // Left padding is shorter by the stack's inset so the active indicator stays
    // put while its glow has room inside the scrollport.
    padding:
      'var(--cn-spacing-4) var(--cn-spacing-10) var(--cn-spacing-4) calc(var(--cn-spacing-10) - var(--cn-spacing-6))'
  },

  '.cn-single-pane-stepper-v2-content-header': {
    gap: 'var(--cn-spacing-3)',
    marginBottom: 'calc(var(--cn-spacing-2) + var(--cn-spacing-3))',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-v2-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    // The active circle's brand glow is a 20px blur. overflow clips it at the
    // scrollport edge, so inset the rail by more than that blur.
    paddingLeft: 'var(--cn-spacing-6)',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },

  '.cn-single-pane-stepper-v2-list': {
    minWidth: '0',
    listStyle: 'none',
    margin: '0',
    padding: '0'
  },

  // Both classes are required. `.cn-stepper-step-item` is emitted later and would otherwise
  // win (flex column, 12px head padding). That stacks the circle above the card and lets the
  // absolute connector run through the title. The compound selector keeps the rail in column 1.
  '.cn-stepper-step-item.cn-single-pane-stepper-v2-step-item': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-size-5) minmax(0, 1fr)',
    columnGap: 'var(--cn-spacing-4)',
    alignItems: 'start',
    margin: '0',
    padding: '0 0 var(--cn-spacing-6)',

    '&:last-child': {
      paddingBottom: '0'
    },

    '& > .cn-stepper-step': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: 'var(--cn-size-5)',
      height: 'auto',
      margin: '0',
      // Shared `.cn-stepper-step` pads 12px, which drops the circle below the title.
      padding: '0',
      gridColumn: '1',
      gridRow: '1'
    },

    '& > .cn-stepper-connector': {
      gridColumn: '1',
      gridRow: '1',
      // Shared connector top/bottom assume the 12px head pad. Start under this circle and
      // stop at the item edge so the trunk meets the next circle without crossing the card.
      left: 'calc((var(--cn-size-5) - var(--cn-spacing-px)) / 2)',
      top: 'calc(var(--cn-size-5) + var(--cn-spacing-half))',
      bottom: '0',
      width: 'var(--cn-spacing-px)',
      height: 'auto'
    },

    '&:last-child > .cn-stepper-connector:not(.cn-single-pane-stepper-v2-connector-fade)': {
      display: 'none'
    },

    // Shared `.cn-stepper-step-item:last-child` hides the trunk when nothing follows.
    // Keep this one, solid for most of its length, then fade out at the bottom.
    '&:last-child > .cn-stepper-connector.cn-single-pane-stepper-v2-connector-fade': {
      display: 'block',
      bottom: '0',
      background: 'linear-gradient(to bottom, var(--cn-border-brand) 0%, var(--cn-border-brand) 72%, transparent 100%)'
    },

    '& > .cn-single-pane-stepper-v2-card': {
      gridColumn: '2',
      gridRow: '1',
      margin: '0',
      minWidth: '0'
    },

    // Same mute as `.cn-stepper .cn-stepper-step-item:has(.cn-stepper-step-completed)`.
    // v2 is not inside `.cn-stepper`, so that rule never reaches these cards.
    '&:has(.cn-stepper-step-completed)': {
      opacity: '0.6',

      '&:hover': {
        opacity: '1'
      },

      '&:has(:focus-visible)': {
        opacity: '1'
      }
    }
  },

  '.cn-single-pane-stepper-v2-indicator-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',

    '&:disabled': {
      cursor: 'default'
    }
  },

  '.cn-single-pane-stepper-v2-card': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-3)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-card-copy': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-half)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-card-title-row': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 'var(--cn-spacing-2)',
    rowGap: 'var(--cn-spacing-1)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-card-title': {
    margin: '0'
  },

  // Do not grow the title. A flex-grow basis pushes the badge to the far edge of the row.
  // minWidth still keeps a few words on the first line so a nowrap badge wraps under
  // the question instead of squeezing it to one character.
  '.cn-single-pane-stepper-v2-card-title-row .cn-single-pane-stepper-v2-card-title': {
    minWidth: 'min(100%, 8rem)',
    flex: '0 1 auto'
  },

  // Same chip as `.cn-stepper-step-badge`: gray outline at rest, blue outline on the active step.
  '.cn-single-pane-stepper-v2-step-badge': {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: '0',
    whiteSpace: 'nowrap',
    padding: 'var(--cn-spacing-half) var(--cn-spacing-2)',
    borderRadius: 'var(--cn-rounded-2)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    background: 'var(--cn-bg-2)',
    color: 'var(--cn-text-3)',
    fontSize: '11px',
    fontWeight: 'var(--cn-font-weight-default-normal-600)',
    lineHeight: '1.35'
  },

  '.cn-single-pane-stepper-v2-card-active .cn-single-pane-stepper-v2-step-badge': {
    borderColor: 'var(--cn-set-blue-outline-border)',
    background: 'var(--cn-set-blue-outline-bg)',
    // Outline tags no longer have their own text token. Blue outline tags use secondary text.
    color: 'var(--cn-set-blue-secondary-text)'
  },

  '.cn-single-pane-stepper-v2-card-description': {
    margin: '0'
  },

  '.cn-single-pane-stepper-v2-card-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-3)',
    minWidth: '0'
  },

  '.cn-single-pane-stepper-v2-answer': {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    width: 'fit-content',
    maxWidth: '100%',

    '&.cn-message-bubble-user': {
      alignSelf: 'flex-end',

      '.cn-message-bubble-content': {
        alignSelf: 'flex-end',
        width: 'fit-content',
        maxWidth: '100%'
      }
    },

    '.cn-message-bubble-footer': {
      justifyContent: 'flex-end',
      flexWrap: 'nowrap',
      alignItems: 'center',
      margin: '0',

      // Edit and copy use ghost buttons (`--cn-text-2`). Match the timestamp (`--cn-text-3`).
      '& .cn-button': {
        color: 'var(--cn-text-3)',

        '&:hover:not(:disabled), &:active:not(:disabled)': {
          color: 'var(--cn-text-3)'
        }
      }
    }
  }
}
