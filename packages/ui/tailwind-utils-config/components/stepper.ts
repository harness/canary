// Branch wire: ::before = vertical stub + elbow (narrow border box); ::after = horizontal arm as a
// 1px background bar (same technique as .cn-stepper-connector). A full-width border-bottom anti-
// aliases thicker than the vertical stub after the arc. Elbow radius matches split-pane step cards.
const BRANCH_ELBOW_RADIUS = 'var(--cn-rounded-5)'

const indicatorBrandGlow = '0 0 20px color-mix(in srgb, var(--cn-border-brand) 30%, transparent)'

const nestedStepBranchWireBase = {
  position: 'relative',
  width: 'var(--cn-spacing-4)',
  height: 'var(--cn-size-5)',
  alignSelf: 'center',
  flexShrink: '0',
  background: 'transparent',

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 'calc(var(--cn-spacing-px) / 2)',
    // Center the elbow's bottom border on the same line as the horizontal arm (::after), so the
    // rounded corner meets the arm flush instead of sitting ~0.5px above it.
    bottom: 'calc(50% - var(--cn-spacing-px) / 2)',
    width: BRANCH_ELBOW_RADIUS,
    height: 'calc(var(--cn-size-5) / 2 + var(--cn-spacing-2))',
    boxSizing: 'border-box',
    borderLeft: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    borderBottomLeftRadius: BRANCH_ELBOW_RADIUS,
    background: 'transparent',
    pointerEvents: 'none'
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    left: `calc(var(--cn-spacing-px) / 2 + ${BRANCH_ELBOW_RADIUS})`,
    bottom: 'calc(50% - var(--cn-spacing-px) / 2)',
    width: `calc(var(--cn-spacing-4) - var(--cn-spacing-px) - ${BRANCH_ELBOW_RADIUS})`,
    height: 'var(--cn-spacing-px)',
    background: 'var(--cn-border-2)',
    pointerEvents: 'none'
  }
}

export default {
  '.cn-stepper': {
    minWidth: '200px',
    width: '100%',

    '&-header': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--cn-spacing-3)'
    },

    '&-list': {
      listStyle: 'none',
      padding: '0',
      margin: '0',

      '&-locked': {
        pointerEvents: 'none'
      }
    }
  },

  /* Step Item */
  '.cn-stepper-step-item': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 'var(--cn-spacing-3)',

    '&:last-child': {
      paddingBottom: '0',

      '&:not(:has(.cn-stepper-nested-step-list, .cn-stepper-nested-step-placeholder)) .cn-stepper-connector': {
        display: 'none'
      },

      '&:has(.cn-stepper-step-upcoming):not(:has(.cn-stepper-nested-step-placeholder)) .cn-stepper-connector': {
        display: 'none'
      },

      '& .cn-stepper-connector': {
        bottom: 'var(--cn-spacing-4-half)'
      },

      // Stop the trunk where the elbow's rounded corner begins (radius above the branch arm)
      // so the vertical line doesn't poke past the bend on the last step.
      '&:has(.cn-stepper-nested-step-placeholder) .cn-stepper-connector': {
        bottom: 'calc(var(--cn-size-8) + var(--cn-rounded-5))'
      }
    }
  },

  /* Step Button */
  '.cn-stepper-step': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-size-5) 1fr',
    alignItems: 'center',
    columnGap: 'var(--cn-spacing-4)',
    width: '100%',
    border: 'none',
    background: 'none',
    padding: '0',
    cursor: 'pointer',
    textAlign: 'left',

    '&:disabled': {
      cursor: 'not-allowed'
    },

    '&-upcoming:disabled': {
      opacity: '1'
    }
  },

  /* Indicator — outlined circles per Figma Connector spec (node 575:64579) */
  '.cn-stepper-indicator': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    minWidth: 'var(--cn-size-5)',
    borderRadius: 'var(--cn-rounded-full)',
    flexShrink: '0',
    boxSizing: 'border-box',
    background: 'var(--cn-bg-1)',
    border: 'var(--cn-spacing-px) solid transparent',
    fontSize: 'var(--cn-font-size-2)',
    fontWeight: 'var(--cn-font-weight-default-normal-700)',
    lineHeight: '1',
    letterSpacing: 'var(--cn-tracking-wide)'
  },

  // Trim the line box down to the cap height / alphabetic baseline so the digit's ink box centers
  // on the circle's true center via the indicator's flex centering — independent of font metrics,
  // so no magic-number transform is needed. Ignored gracefully by browsers without text-box-trim.
  '.cn-stepper-indicator-number': {
    textBoxTrim: 'trim-both',
    textBoxEdge: 'cap alphabetic'
  },

  // Shrink the status glyphs (check / xmark / skipped check) by 1px per side so they sit a little
  // further from the circle's border instead of crowding it. Min-size is overridden too because the
  // base icon size class also pins min-width/height.
  '.cn-stepper-step-completed .cn-stepper-indicator > .cn-icon, .cn-stepper-step-skipped .cn-stepper-indicator > .cn-icon, .cn-stepper-step-error .cn-stepper-indicator > .cn-icon':
    {
      width: 'calc(var(--cn-icon-size-xs) - var(--cn-spacing-px) * 2)',
      height: 'calc(var(--cn-icon-size-xs) - var(--cn-spacing-px) * 2)',
      minWidth: 'calc(var(--cn-icon-size-xs) - var(--cn-spacing-px) * 2)',
      minHeight: 'calc(var(--cn-icon-size-xs) - var(--cn-spacing-px) * 2)'
    },

  '.cn-stepper-step-completed .cn-stepper-indicator': {
    background: 'var(--cn-set-success-outline-bg)',
    borderColor: 'var(--cn-set-success-secondary-text)',
    color: 'var(--cn-set-success-secondary-text)'
  },

  '.cn-stepper-step-active .cn-stepper-indicator': {
    borderColor: 'var(--cn-border-brand)',
    color: 'var(--cn-text-brand)',
    boxShadow: indicatorBrandGlow
  },

  '.cn-stepper-step-upcoming .cn-stepper-indicator': {
    borderColor: 'var(--cn-border-2)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-step-skipped .cn-stepper-indicator': {
    borderColor: 'var(--cn-set-gray-outline-border)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-step-error .cn-stepper-indicator': {
    borderColor: 'var(--cn-icon-danger)',
    color: 'var(--cn-set-danger-secondary-text)'
  },

  '.cn-stepper-step-loading.cn-stepper-step-active .cn-stepper-indicator': {
    borderColor: 'var(--cn-border-brand)',
    color: 'var(--cn-text-brand)',
    boxShadow: indicatorBrandGlow
  },

  /* Step Content */
  '.cn-stepper-step-content': {
    display: 'contents'
  },

  '.cn-stepper-step-title': {
    minWidth: '0'
  },

  // Wraps title + badge as ONE grid item (see StepperStep's showStepBadge branch). `.cn-stepper-step`
  // is a 2-column grid and `.cn-stepper-step-content` is display:contents, so title/description are
  // auto-placed directly into that grid — a plain badge sibling would auto-flow onto its own row
  // instead of sitting beside the title. This flex row keeps title+badge in the title's single cell.
  '.cn-stepper-step-title-row': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--cn-spacing-2)',
    minWidth: '0'
  },

  '.cn-stepper-step-description': {
    gridColumn: '2',
    marginTop: 'var(--cn-spacing-half)',
    minWidth: '0'
  },

  // Step badge — opt-in "Step n/m" pill shown next to the step title (StepperStep `showStepBadge`).
  // Values match the CDv2 prototype (pq-step-badge): neutral surface-2 background, subtle border,
  // muted text — a de-emphasized progress indicator, not a status/theme tag.
  '.cn-stepper-step-badge': {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: '0',
    // Vertical padding matches --cn-spacing-half (2px) exactly.
    padding: 'var(--cn-spacing-half) var(--cn-spacing-2)',
    borderRadius: 'var(--cn-rounded-full)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    background: 'var(--cn-bg-2)',
    color: 'var(--cn-text-3)',
    // No --cn-font-size-* token matches 11px exactly (closest are --cn-font-size-1 at ~10.26px and
    // --cn-font-size-2 at ~11.5px) and no --cn-line-height-* token matches 1.35, so these two stay
    // hardcoded rather than snapping to a visually-different token.
    fontSize: '11px',
    fontWeight: 'var(--cn-font-weight-default-normal-500)',
    lineHeight: '1.35'
  },

  // Active row's badge gets a brand-tinted recolor to match the prototype's active-state badge (base/default case above already matches the prototype's neutral state)
  '.cn-stepper-step-active .cn-stepper-step-badge': {
    borderColor: 'var(--cn-border-brand)',
    background: 'var(--cn-set-brand-outline-bg)',
    color: 'var(--cn-text-brand)'
  },

  // Step Panel — container for arbitrary content rendered below a top-level Step (no StepGroup
  // ancestor). Mirrors `.cn-stepper-nested-step-panel`'s indent-under-the-title pattern, but without
  // a branch segment to account for (top-level Steps have no elbow wire) — just the indicator
  // column (--cn-size-5) plus its gap (--cn-spacing-4) so panel content lines up under the title text.
  '.cn-stepper-step-panel': {
    marginLeft: 'calc(var(--cn-size-5) + var(--cn-spacing-4))',
    marginTop: 'var(--cn-spacing-2)',
    minWidth: '0'
  },

  // Step-level collapse wrapper/trigger/icon/panel — parallel to the .cn-stepper-nested-step-collapse-*
  // classes below, kept independent (not shared) since TopLevelStep's layout differs structurally
  // from NestedStep's nested-step grid layout, matching this file's existing step/nested-step CSS split.
  '.cn-stepper-step-header': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: '0'
  },

  '.cn-stepper-step-collapse-trigger': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    border: 'none',
    background: 'none',
    padding: 'var(--cn-spacing-1)',
    marginRight: 'var(--cn-spacing-1)',
    cursor: 'pointer',
    color: 'var(--cn-text-3)',

    '&:hover': {
      color: 'var(--cn-text-1)'
    },

    '&:focus-visible': {
      outline: 'var(--cn-focus)',
      outlineOffset: 'var(--cn-outline-offset-tight)',
      borderRadius: 'var(--cn-rounded-1)'
    }
  },

  '.cn-stepper-step-collapse-icon': {
    transition: 'transform 150ms ease'
  },

  '.cn-stepper-step-collapse-icon-open': {
    transform: 'rotate(180deg)'
  },

  '.cn-stepper-step-panel-collapsible': {
    overflow: 'hidden',

    '&[data-state="open"]': {
      animation: 'cnStepperCollapsibleDown 150ms ease-out'
    },

    '&[data-state="closed"]': {
      animation: 'cnStepperCollapsibleUp 150ms ease-out forwards',
      height: '0',
      opacity: '0'
    }
  },

  /* Connectors */
  '.cn-stepper-connector': {
    position: 'absolute',
    left: 'calc((var(--cn-size-5) - var(--cn-spacing-px)) / 2)',
    top: 'var(--cn-size-5)',
    bottom: '0',
    width: 'var(--cn-spacing-px)',
    borderRadius: 'var(--cn-rounded-1)',
    // The vertical trunk must sit ABOVE the nested-step branch elbows. The branch wires live in the
    // nested-step-list, which is later in DOM than the connector, so without this they'd paint over
    // the trunk — leaving a nested step's colored elbow (e.g. a red error arc) smudged across the
    // continuous trunk color at the junction. Lifting the trunk keeps its color unbroken where
    // branches meet it.
    zIndex: '1'
  },

  '.cn-stepper-connector-completed': {
    background: 'var(--cn-border-success)',
    // Completed trunk must win over a later active-partial connector (same column, adjacent steps).
    zIndex: '2'
  },

  '.cn-stepper-connector-active': {
    background: 'var(--cn-border-brand)'
  },

  // Active step with nested steps: trunk is green through completed branches, blue to the active
  // branch, and gray below. --cn-stepper-trunk-*-end offsets are set on the step item.
  '.cn-stepper-connector-active-partial': {
    background: 'var(--cn-border-2)',
    // Sit below completed trunks/branches so green completed segments win at junction overlaps.
    zIndex: '0',
    isolation: 'isolate',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: 'var(--cn-stepper-trunk-green-end, 0px)',
      background: 'var(--cn-border-success)',
      borderRadius: '0',
      zIndex: '2'
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 'var(--cn-stepper-trunk-green-end, 0px)',
      left: '0',
      width: '100%',
      height: 'calc(var(--cn-stepper-trunk-blue-end) - var(--cn-stepper-trunk-green-end, 0px))',
      background: 'var(--cn-border-brand)',
      borderRadius: '0',
      zIndex: '0'
    }
  },

  // SinglePaneStepper: cap the active partial trunk at the active branch — no gray line into card panels.
  '.cn-stepper-collapsible-nested-steps .cn-stepper-step-item:has(.cn-stepper-step-active) .cn-stepper-connector-active-partial':
    {
      height: 'var(--cn-stepper-trunk-blue-end)',
      bottom: 'auto'
    },

  // Error step with nested steps: trunk is green through completed branches, red to the error
  // branch, and gray below. --cn-stepper-trunk-*-end offsets are set on the step item.
  '.cn-stepper-connector-error-partial': {
    background: 'var(--cn-border-2)',
    zIndex: '0',
    isolation: 'isolate',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: 'var(--cn-stepper-trunk-green-end, 0px)',
      background: 'var(--cn-border-success)',
      borderRadius: '0',
      zIndex: '2'
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 'var(--cn-stepper-trunk-green-end, 0px)',
      left: '0',
      width: '100%',
      height: 'calc(var(--cn-stepper-trunk-blue-end) - var(--cn-stepper-trunk-green-end, 0px))',
      background: 'var(--cn-border-danger)',
      borderRadius: '0',
      zIndex: '0'
    }
  },

  '.cn-stepper-connector-upcoming, .cn-stepper-connector-skipped': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-connector-error': {
    background: 'var(--cn-border-danger)'
  },

  /* Nested Step List */
  '.cn-stepper-nested-step-list': {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    marginTop: 'var(--cn-spacing-3)',
    paddingLeft: 'calc(var(--cn-size-5) / 2 - var(--cn-spacing-px))',
    counterReset: 'nestedstep'
  },

  '.cn-stepper-nested-step-item': {
    display: 'block',
    listStyle: 'none',
    padding: 'var(--cn-spacing-2) 0',
    counterIncrement: 'nestedstep'
  },

  '.cn-stepper-nested-step-branch': nestedStepBranchWireBase,

  '.cn-stepper-nested-step-completed .cn-stepper-nested-step-branch': {
    zIndex: '2'
  },

  '.cn-stepper-nested-step-completed .cn-stepper-nested-step-branch::before': {
    borderColor: 'var(--cn-border-success)'
  },

  '.cn-stepper-nested-step-completed .cn-stepper-nested-step-branch::after': {
    background: 'var(--cn-border-success)'
  },

  '.cn-stepper-nested-step-active .cn-stepper-nested-step-branch::before': {
    borderColor: 'var(--cn-border-brand)'
  },

  '.cn-stepper-nested-step-active .cn-stepper-nested-step-branch::after': {
    background: 'var(--cn-border-brand)'
  },

  '.cn-stepper-nested-step-error .cn-stepper-nested-step-branch::before': {
    borderColor: 'var(--cn-border-danger)'
  },

  '.cn-stepper-nested-step-error .cn-stepper-nested-step-branch::after': {
    background: 'var(--cn-border-danger)'
  },

  '.cn-stepper-nested-step-upcoming .cn-stepper-nested-step-branch::before': {
    borderColor: 'var(--cn-border-2)'
  },

  '.cn-stepper-nested-step-upcoming .cn-stepper-nested-step-branch::after': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-nested-step-skipped .cn-stepper-nested-step-branch': {
    zIndex: '2'
  },

  '.cn-stepper-nested-step-skipped .cn-stepper-nested-step-branch::before': {
    borderColor: 'var(--cn-set-gray-secondary-bg)'
  },

  '.cn-stepper-nested-step-skipped .cn-stepper-nested-step-branch::after': {
    background: 'var(--cn-set-gray-secondary-bg)'
  },

  /* Nested Step Button */
  '.cn-stepper-nested-step': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-spacing-4) var(--cn-size-5) 1fr',
    alignItems: 'center',
    width: '100%',
    border: 'none',
    background: 'none',
    padding: '0',
    cursor: 'pointer',
    textAlign: 'left'
  },

  '.cn-stepper-nested-step-with-collapse': {
    width: 'auto',
    flex: '1',
    minWidth: '0'
  },

  '.cn-stepper-nested-step-header': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: '0'
  },

  '.cn-stepper-nested-step-collapse-trigger': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    border: 'none',
    background: 'none',
    padding: 'var(--cn-spacing-1)',
    marginRight: 'var(--cn-spacing-1)',
    cursor: 'pointer',
    color: 'var(--cn-text-3)',

    '&:hover': {
      color: 'var(--cn-text-1)'
    },

    '&:focus-visible': {
      outline: 'var(--cn-focus)',
      outlineOffset: 'var(--cn-outline-offset-tight)',
      borderRadius: 'var(--cn-rounded-1)'
    }
  },

  '.cn-stepper-nested-step-collapse-icon': {
    transition: 'transform 150ms ease'
  },

  '.cn-stepper-nested-step-collapse-icon-open': {
    transform: 'rotate(180deg)'
  },

  '.cn-stepper-nested-step-panel-collapsible': {
    overflow: 'hidden',

    '&[data-state="open"]': {
      animation: 'cnStepperCollapsibleDown 150ms ease-out'
    },

    '&[data-state="closed"]': {
      animation: 'cnStepperCollapsibleUp 150ms ease-out forwards',
      height: '0',
      opacity: '0'
    }
  },

  '@keyframes cnStepperCollapsibleDown': {
    from: {
      height: '0',
      opacity: '0'
    },
    to: {
      height: 'var(--radix-collapsible-content-height)',
      opacity: '1'
    }
  },

  '@keyframes cnStepperCollapsibleUp': {
    from: {
      height: 'var(--radix-collapsible-content-height)',
      opacity: '1'
    },
    to: {
      height: '0',
      opacity: '0'
    }
  },

  /* Nested Step Indicator */
  '.cn-stepper-nested-step-indicator': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    minWidth: 'var(--cn-size-5)',
    borderRadius: 'var(--cn-rounded-full)',
    flexShrink: '0',
    boxSizing: 'border-box',
    background: 'var(--cn-bg-1)',
    border: 'var(--cn-spacing-px) solid transparent'
  },

  '.cn-stepper-nested-step-completed .cn-stepper-nested-step-indicator': {
    background: 'var(--cn-set-success-outline-bg)',
    borderColor: 'var(--cn-set-success-secondary-text)',
    color: 'var(--cn-set-success-secondary-text)'
  },

  '.cn-stepper-nested-step-active .cn-stepper-nested-step-indicator': {
    borderColor: 'var(--cn-border-brand)',
    boxShadow: indicatorBrandGlow
  },

  '.cn-stepper-nested-step-error .cn-stepper-nested-step-indicator': {
    borderColor: 'var(--cn-icon-danger)',
    color: 'var(--cn-set-danger-secondary-text)'
  },

  '.cn-stepper-nested-step-upcoming .cn-stepper-nested-step-indicator': {
    borderColor: 'var(--cn-border-2)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-nested-step-skipped .cn-stepper-nested-step-indicator': {
    borderColor: 'var(--cn-set-gray-outline-border)',
    color: 'var(--cn-text-2)'
  },

  '.cn-stepper-nested-step-dot': {
    width: 'var(--cn-spacing-1-half)',
    height: 'var(--cn-spacing-1-half)',
    borderRadius: 'var(--cn-rounded-full)',
    background: 'var(--cn-text-brand)'
  },

  '.cn-stepper-nested-step-ordinal': {
    fontSize: 'var(--cn-font-size-0)',
    fontWeight: 'var(--cn-font-weight-default-normal-500)',
    lineHeight: '1',
    color: 'var(--cn-text-3)',

    '&::before': {
      content: '"." counter(nestedstep)'
    }
  },

  /* Nested Step Content */
  '.cn-stepper-nested-step-content': {
    display: 'contents'
  },

  '.cn-stepper-nested-step-title': {
    minWidth: '0',
    marginLeft: 'var(--cn-spacing-4)'
  },

  '.cn-stepper-nested-step-description': {
    gridColumn: '3',
    marginTop: 'var(--cn-spacing-half)',
    marginLeft: 'var(--cn-spacing-4)',
    minWidth: '0'
  },

  /* Nested Step Panel — container for card children rendered below nested-step button */
  '.cn-stepper-nested-step-panel': {
    marginLeft: 'calc(var(--cn-spacing-4) + var(--cn-size-5) + var(--cn-spacing-4))',
    marginTop: 'var(--cn-spacing-2)',
    paddingRight: 'var(--cn-spacing-2)',
    minWidth: '0',
    width: 'calc(100% - calc(var(--cn-spacing-4) + var(--cn-size-5) + var(--cn-spacing-4)) - var(--cn-spacing-2))'
  },

  /* Single-pane accordion cards: branch wire only, card header owns the indicator */
  '.cn-stepper-nested-step-content-only': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-spacing-4) 1fr',
    alignItems: 'start',
    padding: 'var(--cn-spacing-1) 0',
    paddingLeft: 'calc(var(--cn-size-5) / 2 - var(--cn-spacing-px))'
  },

  '.cn-stepper-nested-step-content-only .cn-stepper-nested-step-branch': {
    gridColumn: '1',
    gridRow: '1'
  },

  '.cn-stepper-nested-step-content-only .cn-stepper-nested-step-panel': {
    gridColumn: '2',
    marginLeft: '0',
    marginTop: '0',
    width: '100%',
    paddingRight: '0'
  },

  /* Placeholder — indeterminate nested-steps indicator */
  '.cn-stepper-nested-step-placeholder': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-spacing-4) var(--cn-size-5) 1fr',
    alignItems: 'center',
    padding: 'var(--cn-spacing-1) 0',
    marginTop: 'var(--cn-spacing-3)',
    paddingLeft: 'calc(var(--cn-size-5) / 2 - var(--cn-spacing-px))'
  },

  '.cn-stepper-nested-step-item .cn-stepper-nested-step-placeholder': {
    marginTop: '0',
    paddingLeft: '0',
    padding: '0'
  },

  '.cn-stepper-nested-step-placeholder-branch': nestedStepBranchWireBase,

  // Placeholder always represents unreached nested steps — keep inactive regardless of parent step state.
  '.cn-stepper-nested-step-placeholder-branch::before': {
    borderColor: 'var(--cn-border-2)'
  },

  '.cn-stepper-nested-step-placeholder-branch::after': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-nested-step-placeholder-indicator': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    borderRadius: 'var(--cn-rounded-full)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    background: 'var(--cn-bg-1)',
    color: 'var(--cn-text-3)',
    boxSizing: 'border-box'
  },

  '.cn-stepper-nested-step-placeholder-spacer': {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'var(--cn-spacing-2)'
  },

  /* Loading Shimmer */
  '@keyframes cnStepperShimmer': {
    '0%': {
      backgroundPosition: '-250px 0'
    },
    '100%': {
      backgroundPosition: '250px 0'
    }
  },

  '.cn-stepper-step-loading .cn-stepper-step-title, .cn-stepper-step-loading .cn-stepper-step-description': {
    background:
      'linear-gradient(90deg, currentColor 0px, color-mix(in srgb, var(--cn-border-brand) 20%, currentColor) 15px, currentColor 30px)',
    backgroundSize: '500px 100%',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    animation: 'cnStepperShimmer 2s linear infinite'
  },

  /* Transition Animations */
  '.cn-stepper-step-transitioning .cn-stepper-indicator': {
    transition:
      'background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out, box-shadow 150ms ease-in-out'
  },

  '.cn-stepper-indicator-leaving .cn-stepper-indicator': {
    transitionDelay: '0ms'
  },

  '.cn-stepper-connector-animating': {
    position: 'relative',
    overflow: 'hidden',

    '&::after': {
      content: "''",
      position: 'absolute',
      inset: '0',
      background: 'var(--cn-border-success)',
      transformOrigin: 'top',
      transform: 'scaleY(1)',
      transition: 'transform 300ms ease-out',
      transitionDelay: '150ms'
    }
  },

  '.cn-stepper-indicator-entering .cn-stepper-indicator': {
    transition:
      'background-color 150ms ease-in-out, color 150ms ease-in-out, border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
    transitionDelay: '450ms'
  },

  /* Skeleton */
  '.cn-stepper-skeleton-item': {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 'var(--cn-spacing-2) 0'
  },

  '.cn-stepper-skeleton-indicator': {
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    minWidth: 'var(--cn-size-5)',
    borderRadius: 'var(--cn-rounded-full)'
  },

  '.cn-stepper-skeleton-content': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-1)',
    paddingLeft: 'var(--cn-spacing-4)',
    flex: '1'
  },

  '.cn-stepper-skeleton-title': {
    width: '60%',
    height: 'var(--cn-size-3-half)',
    borderRadius: 'var(--cn-rounded-2)'
  },

  '.cn-stepper-skeleton-description': {
    width: '40%',
    height: 'var(--cn-size-3)',
    borderRadius: 'var(--cn-rounded-2)'
  },

  /* Reduced Motion */
  '@media (prefers-reduced-motion: reduce)': {
    '.cn-stepper-step-transitioning .cn-stepper-indicator, .cn-stepper-indicator-entering .cn-stepper-indicator, .cn-stepper-connector-animating::after':
      {
        transition: 'none'
      },

    '.cn-stepper-step-loading .cn-stepper-step-title, .cn-stepper-step-loading .cn-stepper-step-description': {
      animation: 'none',
      background: 'none',
      '-webkit-background-clip': 'unset',
      '-webkit-text-fill-color': 'unset',
      backgroundClip: 'unset'
    },

    '.cn-stepper-step-panel-collapsible, .cn-stepper-nested-step-panel-collapsible': {
      animation: 'none',

      '&[data-state="closed"]': {
        height: '0',
        opacity: '0'
      },

      '&[data-state="open"]': {
        height: 'auto',
        opacity: '1'
      }
    }
  }
}
