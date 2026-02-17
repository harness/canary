export default {
  '.cn-slider': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-layout-xs)',
    width: '100%',

    '&-value-text': {
      font: 'var(--cn-body-single-line-normal, var(--cn-body-normal))',
      color: 'var(--cn-text-3)',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      flexShrink: '0',
      width: 'var(--cn-size-11)',
      textAlign: 'right',

      '&-range': {
        width: 'var(--cn-size-15)'
      }
    },

    '&-body': {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--cn-layout-4xs)',
      width: '100%',
      height: 'var(--cn-size-4-half)'
    },

    '&-root': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      flex: '1 0 0',
      height: '100%',
      touchAction: 'none',
      userSelect: 'none'
    },

    '&:where(.cn-slider-disabled), &:where([data-disabled])': {
      '@apply opacity-cn-disabled': '',
      cursor: 'not-allowed',
    },

    '&-track': {
      position: 'relative',
      flexGrow: '1',
      height: 'var(--cn-progress-size-md)',
      borderRadius: 'var(--cn-progress-radius)',
      backgroundColor: 'var(--cn-comp-slider-track-base)'
    },

    '&-range': {
      position: 'absolute',
      height: '100%',
      borderRadius: 'var(--cn-progress-radius)',
      backgroundColor: 'var(--cn-comp-slider-track-progress)'
    },

    '&-thumb': {
      display: 'block',
      width: 'var(--cn-size-4-half)',
      height: 'var(--cn-size-4-half)',
      outline: 'none !important',
      cursor: 'grab',

      '&[data-disabled="true"]': {
        cursor: 'not-allowed',
      },

      '&:focus, &:active': {
        zIndex: '2'
      },

      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'var(--cn-size-4-half)',
        height: 'var(--cn-size-4-half)',
        borderRadius: 'var(--cn-rounded-full)',
        backgroundColor: 'var(--cn-comp-slider-handle-bg)',
        border: 'var(--cn-border-width-1-half) solid var(--cn-comp-slider-handle-border)',
        transition:
          'width 150ms ease-out, height 150ms ease-out, border-color 150ms ease-out, background-color 150ms ease-out, box-shadow 150ms ease-out'
      },

      '&:not([data-disabled="true"])': {
        '&:hover::after': {
          width: 'var(--cn-size-5)',
          height: 'var(--cn-size-5)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg-selected)',
          borderColor: 'var(--cn-comp-slider-handle-border-selected)',
          boxShadow: 'var(--cn-ring-selected)'
        },

        '&:focus-visible::after': {
          width: 'var(--cn-size-5)',
          height: 'var(--cn-size-5)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg-selected)',
          borderColor: 'var(--cn-comp-slider-handle-border-selected)',
          boxShadow: 'var(--cn-ring-selected)'
        },

        '&:focus:not(:focus-visible):not(:active)::after': {
          width: 'var(--cn-size-4-half)',
          height: 'var(--cn-size-4-half)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg)',
          borderColor: 'var(--cn-comp-slider-handle-border)',
          boxShadow: 'none'
        },
        '&:active': {
          cursor: 'grabbing'
        },

        '&:active::after': {
          width: 'var(--cn-size-5)',
          height: 'var(--cn-size-5)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg-selected)',
          borderColor: 'var(--cn-comp-slider-handle-border-selected)',
          boxShadow: 'var(--cn-ring-selected)'
        }
      },
    },

    '&-description': {
      font: 'var(--cn-body-normal)',
      color: 'var(--cn-text-3)'
    },

    '&-tooltip': {
      display: 'inline-block',
      position: 'absolute',
      bottom: 'calc(100% + 9px)',
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: 'var(--cn-rounded-3)',
      border: 'var(--cn-tooltip-border) solid var(--cn-comp-tooltip-border)',
      background: 'var(--cn-comp-tooltip-bg)',
      color: 'var(--cn-comp-tooltip-text)',
      padding: 'var(--cn-layout-4xs) var(--cn-layout-3xs)',
      minWidth: 'var(--cn-size-6)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      animation: 'cn-slider-tooltip-in 150ms ease-out',
      '@apply z-50 font-caption-normal': '',

      '@keyframes cn-slider-tooltip-in': {
        from: {
          opacity: '0',
          transform: 'translateX(-50%) translateY(2px)'
        },
        to: {
          opacity: '1',
          transform: 'translateX(-50%) translateY(0)'
        }
      }
    },

    '&-minmax': {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      font: 'var(--cn-caption-normal)',
      color: 'var(--cn-text-3)',
      userSelect: 'none'
    },

    // Severity slider
    '&-severity': {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--cn-layout-sm)',
      width: '100%',

      '&:where([data-disabled])': {
        '@apply opacity-cn-disabled': '',
        cursor: 'not-allowed',
      },

      '&-body': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: 'var(--cn-size-4-half)'
      },

      '&-root': {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flex: '1 0 0',
        height: '100%',
        touchAction: 'none',
        userSelect: 'none',

        '&:where([data-disabled])': {
          cursor: 'not-allowed'
        }
      },

      '&-track': {
        position: 'relative',
        flexGrow: '1',
        height: 'var(--cn-progress-size-md)',
        borderRadius: 'var(--cn-progress-radius)',
        background: 'var(--cn-comp-slider-range-gradient)',
        overflow: 'hidden'
      },

      '&-range': {
        position: 'absolute',
        height: '100%',

        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          bottom: '0',
          backgroundColor: 'var(--cn-comp-slider-track-base)'
        },

        '&::before': {
          right: '100%',
          width: '9999px'
        },

        '&::after': {
          left: '100%',
          width: '9999px'
        }
      },

      '&-thumb': {
        display: 'block',
        width: 'var(--cn-size-4-half)',
        height: 'var(--cn-size-4-half)',
        outline: 'none !important',
        cursor: 'grab',
        zIndex: '1',

        '&:focus, &:active': {
          zIndex: '2'
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'var(--cn-size-4-half)',
          height: 'var(--cn-size-4-half)',
          borderRadius: 'var(--cn-rounded-full)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg)',
          border: 'var(--cn-border-width-1-half) solid var(--cn-comp-slider-handle-border)',
          transition:
            'width 150ms ease-out, height 150ms ease-out, border-color 150ms ease-out, background-color 150ms ease-out, box-shadow 150ms ease-out'
        },

        '&:hover::after': {
          width: 'var(--cn-size-5)',
          height: 'var(--cn-size-5)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg-selected)',
          borderColor: 'var(--cn-comp-slider-handle-border-selected)',
          boxShadow: 'var(--cn-ring-selected)'
        },

        '&:focus-visible::after': {
          width: 'var(--cn-size-5)',
          height: 'var(--cn-size-5)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg-selected)',
          borderColor: 'var(--cn-comp-slider-handle-border-selected)',
          boxShadow: 'var(--cn-ring-selected)'
        },

        '&:focus:not(:focus-visible):not(:active)::after': {
          width: 'var(--cn-size-4-half)',
          height: 'var(--cn-size-4-half)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg)',
          borderColor: 'var(--cn-comp-slider-handle-border)',
          boxShadow: 'none'
        },

        '&:active': {
          cursor: 'grabbing'
        },

        '&:active::after': {
          width: 'var(--cn-size-5)',
          height: 'var(--cn-size-5)',
          backgroundColor: 'var(--cn-comp-slider-handle-bg-selected)',
          borderColor: 'var(--cn-comp-slider-handle-border-selected)',
          boxShadow: 'var(--cn-ring-selected)'
        }
      },

      '&-labels': {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        font: 'var(--cn-caption-normal)',
        color: 'var(--cn-text-3)',
        userSelect: 'none'
      }
    }
  }
}
