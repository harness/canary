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

      '&:has(.cn-stepper-substep-placeholder) .cn-stepper-connector': {
        bottom: 'var(--cn-size-8)'
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

  /* Indicator */
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
    fontSize: 'var(--cn-font-size-1)',
    fontWeight: 'var(--cn-font-weight-default-normal-500)',
    lineHeight: '1',
    letterSpacing: 'var(--cn-tracking-wider)'
  },

  '.cn-stepper-step-completed .cn-stepper-indicator': {
    background: 'var(--cn-set-success-primary-bg)',
    color: 'var(--cn-set-success-primary-text)'
  },

  '.cn-stepper-step-active .cn-stepper-indicator': {
    background: 'var(--cn-set-brand-primary-bg)',
    color: 'var(--cn-set-brand-primary-text)'
  },

  '.cn-stepper-step-upcoming .cn-stepper-indicator': {
    background: 'var(--cn-bg-3)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-step-skipped .cn-stepper-indicator': {
    background: 'var(--cn-set-gray-primary-bg)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-step-error .cn-stepper-indicator': {
    background: 'var(--cn-set-danger-primary-bg)',
    color: 'var(--cn-set-danger-primary-text)'
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
    left: 'calc(var(--cn-size-5) / 2 - var(--cn-spacing-px))',
    top: 'var(--cn-size-5)',
    bottom: '0',
    width: 'var(--cn-spacing-half)',
    borderRadius: 'var(--cn-rounded-1)'
  },

  '.cn-stepper-connector-completed': {
    background: 'var(--cn-set-success-primary-bg)'
  },

  '.cn-stepper-connector-active': {
    background: 'var(--cn-set-brand-primary-bg)'
  },

  '.cn-stepper-connector-upcoming, .cn-stepper-connector-skipped': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-connector-error': {
    background: 'var(--cn-set-danger-primary-bg)'
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
    padding: 'var(--cn-spacing-2) 0',
    counterIncrement: 'substep'
  },

  '.cn-stepper-substep-branch': {
    width: 'var(--cn-spacing-4)',
    height: 'var(--cn-spacing-half)'
  },

  '.cn-stepper-substep-completed .cn-stepper-substep-branch': {
    background: 'var(--cn-set-success-primary-bg)'
  },

  '.cn-stepper-substep-active .cn-stepper-substep-branch': {
    background: 'var(--cn-set-brand-primary-bg)'
  },

  '.cn-stepper-substep-error .cn-stepper-substep-branch': {
    background: 'var(--cn-set-danger-primary-bg)'
  },

  '.cn-stepper-substep-upcoming .cn-stepper-substep-branch': {
    background: 'var(--cn-border-2)'
  },

  '.cn-stepper-substep-skipped .cn-stepper-substep-branch': {
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
    boxSizing: 'border-box'
  },

  '.cn-stepper-substep-completed .cn-stepper-substep-indicator': {
    background: 'var(--cn-set-success-primary-bg)',
    color: 'var(--cn-set-success-primary-text)'
  },

  '.cn-stepper-substep-active .cn-stepper-substep-indicator': {
    background: 'var(--cn-set-brand-primary-bg)'
  },

  '.cn-stepper-substep-error .cn-stepper-substep-indicator': {
    background: 'var(--cn-set-danger-primary-bg)',
    color: 'var(--cn-set-danger-primary-text)'
  },

  '.cn-stepper-substep-upcoming .cn-stepper-substep-indicator': {
    background: 'var(--cn-bg-3)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    color: 'var(--cn-text-3)'
  },

  '.cn-stepper-substep-skipped .cn-stepper-substep-indicator': {
    background: 'var(--cn-set-gray-secondary-bg)',
    color: 'var(--cn-text-2)'
  },

  '.cn-stepper-substep-dot': {
    width: 'var(--cn-spacing-1-half)',
    height: 'var(--cn-spacing-1-half)',
    borderRadius: 'var(--cn-rounded-full)',
    background: 'var(--cn-set-brand-primary-text)'
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
    marginLeft: 'var(--cn-spacing-2)'
  },

  '.cn-stepper-substep-description': {
    gridColumn: '3',
    marginTop: 'var(--cn-spacing-half)',
    marginLeft: 'var(--cn-spacing-2)',
    minWidth: '0'
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
    paddingLeft: '0'
  },

  '.cn-stepper-substep-placeholder-branch': {
    width: 'var(--cn-spacing-4)',
    height: 'var(--cn-spacing-half)',
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
    background: 'var(--cn-bg-3)',
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
      'linear-gradient(90deg, currentColor 0px, color-mix(in srgb, var(--cn-set-brand-primary-bg) 20%, currentColor) 15px, currentColor 30px)',
    backgroundSize: '500px 100%',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    animation: 'cnStepperShimmer 2s linear infinite'
  },

  /* Transition Animations */
  '.cn-stepper-step-transitioning .cn-stepper-indicator': {
    transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out'
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
      background: 'var(--cn-set-success-primary-bg)',
      transformOrigin: 'top',
      transform: 'scaleY(1)',
      transition: 'transform 300ms ease-out',
      transitionDelay: '150ms'
    }
  },

  '.cn-stepper-indicator-entering .cn-stepper-indicator': {
    transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out',
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
