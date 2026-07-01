// Branch wire: ::before = vertical stub + elbow (narrow border box); ::after = horizontal arm as a
// 1px background bar (same technique as .cn-stepper-connector). A full-width border-bottom anti-
// aliases thicker than the vertical stub after the arc. Elbow radius matches split-pane step cards.
const BRANCH_ELBOW_RADIUS = 'var(--cn-rounded-5)'

const indicatorBrandGlow = '0 0 20px color-mix(in srgb, var(--cn-border-brand) 30%, transparent)'

const substepBranchWireBase = {
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

      '&:not(:has(.cn-stepper-substep-list, .cn-stepper-substep-placeholder)) .cn-stepper-connector': {
        display: 'none'
      },

      '&:has(.cn-stepper-step-upcoming):not(:has(.cn-stepper-substep-placeholder)) .cn-stepper-connector': {
        display: 'none'
      },

      '& .cn-stepper-connector': {
        bottom: 'var(--cn-spacing-4-half)'
      },

      // Stop the trunk where the elbow's rounded corner begins (radius above the branch arm)
      // so the vertical line doesn't poke past the bend on the last step.
      '&:has(.cn-stepper-substep-placeholder) .cn-stepper-connector': {
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
    borderColor: 'var(--cn-set-success-outline-text)',
    color: 'var(--cn-set-success-outline-text)'
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
    color: 'var(--cn-set-danger-outline-text)'
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

  '.cn-stepper-step-description': {
    gridColumn: '2',
    marginTop: 'var(--cn-spacing-half)',
    minWidth: '0'
  },

  /* Connectors */
  '.cn-stepper-connector': {
    position: 'absolute',
    left: 'calc((var(--cn-size-5) - var(--cn-spacing-px)) / 2)',
    top: 'var(--cn-size-5)',
    bottom: '0',
    width: 'var(--cn-spacing-px)',
    borderRadius: 'var(--cn-rounded-1)'
  },

  '.cn-stepper-connector-completed': {
    background: 'var(--cn-border-success)'
  },

  '.cn-stepper-connector-active': {
    background: 'var(--cn-border-brand)'
  },

  // Active step with substeps: trunk is green through completed branches, blue to the active
  // branch, and gray below. --cn-stepper-trunk-*-end offsets are set on the step item.
  '.cn-stepper-connector-active-partial': {
    background: 'var(--cn-border-2)',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: 'var(--cn-stepper-trunk-green-end, 0px)',
      background: 'var(--cn-border-success)',
      borderRadius: '0',
      zIndex: '1'
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

  // Error step with substeps: trunk is green through completed branches, red to the error
  // branch, and gray below. --cn-stepper-trunk-*-end offsets are set on the step item.
  '.cn-stepper-connector-error-partial': {
    background: 'var(--cn-border-2)',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: 'var(--cn-stepper-trunk-green-end, 0px)',
      background: 'var(--cn-border-success)',
      borderRadius: '0',
      zIndex: '1'
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

  /* SubStep List */
  '.cn-stepper-substep-list': {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    marginTop: 'var(--cn-spacing-3)',
    paddingLeft: 'calc(var(--cn-size-5) / 2 - var(--cn-spacing-px))',
    counterReset: 'substep'
  },

  '.cn-stepper-substep-item': {
    display: 'block',
    listStyle: 'none',
    padding: 'var(--cn-spacing-2) 0',
    counterIncrement: 'substep'
  },

  '.cn-stepper-substep-branch': substepBranchWireBase,

  '.cn-stepper-substep-completed .cn-stepper-substep-branch::before': {
    borderColor: 'var(--cn-border-success)'
  },

  '.cn-stepper-substep-completed .cn-stepper-substep-branch::after': {
    background: 'var(--cn-border-success)'
  },

  '.cn-stepper-substep-active .cn-stepper-substep-branch::before': {
    borderColor: 'var(--cn-border-brand)'
  },

  '.cn-stepper-substep-active .cn-stepper-substep-branch::after': {
    background: 'var(--cn-border-brand)'
  },

  '.cn-stepper-substep-error .cn-stepper-substep-branch::before': {
    borderColor: 'var(--cn-border-danger)'
  },

  '.cn-stepper-substep-error .cn-stepper-substep-branch::after': {
    background: 'var(--cn-border-danger)'
  },

  '.cn-stepper-substep-upcoming .cn-stepper-substep-branch::before': {
    borderColor: 'var(--cn-border-2)'
  },

  '.cn-stepper-substep-upcoming .cn-stepper-substep-branch::after': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-substep-skipped .cn-stepper-substep-branch::before': {
    borderColor: 'var(--cn-set-gray-secondary-bg)'
  },

  '.cn-stepper-substep-skipped .cn-stepper-substep-branch::after': {
    background: 'var(--cn-set-gray-secondary-bg)'
  },

  /* SubStep Button */
  '.cn-stepper-substep': {
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

  /* SubStep Indicator */
  '.cn-stepper-substep-indicator': {
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

  '.cn-stepper-substep-completed .cn-stepper-substep-indicator': {
    background: 'var(--cn-set-success-outline-bg)',
    borderColor: 'var(--cn-set-success-outline-text)',
    color: 'var(--cn-set-success-outline-text)'
  },

  '.cn-stepper-substep-active .cn-stepper-substep-indicator': {
    borderColor: 'var(--cn-border-brand)',
    boxShadow: indicatorBrandGlow
  },

  '.cn-stepper-substep-error .cn-stepper-substep-indicator': {
    borderColor: 'var(--cn-icon-danger)',
    color: 'var(--cn-set-danger-outline-text)'
  },

  '.cn-stepper-substep-upcoming .cn-stepper-substep-indicator': {
    borderColor: 'var(--cn-border-2)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-substep-skipped .cn-stepper-substep-indicator': {
    borderColor: 'var(--cn-set-gray-outline-border)',
    color: 'var(--cn-text-2)'
  },

  '.cn-stepper-substep-dot': {
    width: 'var(--cn-spacing-1-half)',
    height: 'var(--cn-spacing-1-half)',
    borderRadius: 'var(--cn-rounded-full)',
    background: 'var(--cn-text-brand)'
  },

  '.cn-stepper-substep-ordinal': {
    fontSize: 'var(--cn-font-size-0)',
    fontWeight: 'var(--cn-font-weight-default-normal-500)',
    lineHeight: '1',
    color: 'var(--cn-text-3)',

    '&::before': {
      content: '"." counter(substep)'
    }
  },

  /* SubStep Content */
  '.cn-stepper-substep-content': {
    display: 'contents'
  },

  '.cn-stepper-substep-title': {
    minWidth: '0',
    marginLeft: 'var(--cn-spacing-4)'
  },

  '.cn-stepper-substep-description': {
    gridColumn: '3',
    marginTop: 'var(--cn-spacing-half)',
    marginLeft: 'var(--cn-spacing-4)',
    minWidth: '0'
  },

  /* SubStep Panel — container for card children rendered below substep button */
  '.cn-stepper-substep-panel': {
    marginLeft: 'calc(var(--cn-spacing-4) + var(--cn-size-5) + var(--cn-spacing-4))',
    marginTop: 'var(--cn-spacing-2)',
    paddingRight: 'var(--cn-spacing-2)',
    minWidth: '0',
    width: 'calc(100% - calc(var(--cn-spacing-4) + var(--cn-size-5) + var(--cn-spacing-4)) - var(--cn-spacing-2))'
  },

  /* Placeholder — indeterminate substeps indicator */
  '.cn-stepper-substep-placeholder': {
    display: 'grid',
    gridTemplateColumns: 'var(--cn-spacing-4) var(--cn-size-5) 1fr',
    alignItems: 'center',
    padding: 'var(--cn-spacing-1) 0',
    marginTop: 'var(--cn-spacing-3)',
    paddingLeft: 'calc(var(--cn-size-5) / 2 - var(--cn-spacing-px))'
  },

  '.cn-stepper-substep-item .cn-stepper-substep-placeholder': {
    marginTop: '0',
    paddingLeft: '0',
    padding: '0'
  },

  '.cn-stepper-substep-placeholder-branch': substepBranchWireBase,

  // Placeholder always represents unreached substeps — keep inactive regardless of parent step state.
  '.cn-stepper-substep-placeholder-branch::before': {
    borderColor: 'var(--cn-border-2)'
  },

  '.cn-stepper-substep-placeholder-branch::after': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-substep-placeholder-indicator': {
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

  '.cn-stepper-substep-placeholder-spacer': {
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
    }
  }
}
