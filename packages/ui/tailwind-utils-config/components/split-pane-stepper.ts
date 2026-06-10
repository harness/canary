export default {
  '.cn-split-pane-stepper-shell, .cn-split-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-0)',
    overflow: 'hidden'
  },

  '.cn-split-pane-stepper-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-split-pane-stepper-close-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
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

  '.cn-split-pane-stepper-title': {
    fontSize: '24px',
    fontWeight: 'var(--cn-font-weight-default-normal-600)',
    lineHeight: '32px',
    color: 'var(--cn-text-1)',
    margin: '0',
    padding: '0'
  },

  '.cn-split-pane-stepper-body, .cn-split-pane-stepper-panels': {
    display: 'flex',
    flex: '1',
    minHeight: '0',
    overflow: 'hidden'
  },

  '.cn-split-pane-stepper-left-pane': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '0',
    padding: 'var(--cn-spacing-4)',
    background: 'var(--cn-bg-1)',
    borderRight: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  '.cn-split-pane-stepper-right-pane': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-1)',
    overflow: 'hidden'
  },

  '.cn-split-pane-stepper-content-header': {
    padding: 'var(--cn-spacing-6) var(--cn-spacing-6) 0',
    flexShrink: '0'
  },

  '.cn-split-pane-stepper-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },

  '.cn-split-pane-stepper-card-stack-inner': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-6)',
    paddingLeft: 'var(--cn-spacing-6)',
    paddingRight: 'var(--cn-spacing-6)',

    '&::before, &::after': {
      content: "''",
      display: 'block',
      minHeight: '35vh',
      flexShrink: '0'
    }
  },

  '.cn-split-pane-stepper-card': {
    position: 'relative',
    background: 'var(--cn-bg-1)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    borderRadius: 'var(--cn-rounded-5)',
    padding: 'var(--cn-spacing-6) var(--cn-spacing-6) var(--cn-spacing-8)',
    transition: 'box-shadow 200ms ease'
  },

  '.cn-split-pane-stepper-card-active': {
    boxShadow: '0 0 6px 3px var(--cn-set-ai-outline-inner)'
  },

  '.cn-split-pane-stepper-card-error': {
    boxShadow: '0 0 6px 3px var(--cn-set-danger-outline-inner, rgba(239, 68, 68, 0.35))'
  },

  '.cn-split-pane-stepper-card-completed': {
    boxShadow: 'none'
  },

  '.cn-split-pane-stepper-card-finished': {
    boxShadow: '0 0 6px 3px var(--cn-set-success-outline-inner, rgba(0, 203, 108, 0.35))'
  },

  '.cn-split-pane-stepper-card-header': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--cn-spacing-3)'
  },

  '.cn-split-pane-stepper-card-status': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    flexShrink: '0',
    marginTop: 'var(--cn-spacing-1)'
  },

  '.cn-split-pane-stepper-card-status-dot': {
    width: 'var(--cn-spacing-2)',
    height: 'var(--cn-spacing-2)',
    borderRadius: 'var(--cn-rounded-full)',
    background: 'var(--cn-set-brand-primary-bg)'
  },

  '.cn-split-pane-stepper-card-title-row': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--cn-spacing-2)',
    flex: '1',
    minWidth: '0'
  },

  '.cn-split-pane-stepper-card-edit': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    borderRadius: 'var(--cn-rounded-2)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: '0',
    flexShrink: '0',
    opacity: '0',
    transition: 'opacity 150ms ease',

    '&:hover': {
      background: 'var(--cn-bg-3)'
    }
  },

  '.cn-split-pane-stepper-card:hover .cn-split-pane-stepper-card-edit': {
    opacity: '1'
  },

  '.cn-split-pane-stepper-card-content': {
    marginTop: 'var(--cn-spacing-6)',
    paddingLeft: 'calc(var(--cn-size-4) + var(--cn-spacing-3))'
  },

  '.cn-split-pane-stepper-card-description': {
    paddingLeft: 'calc(var(--cn-size-4) + var(--cn-spacing-3))',
    marginTop: 'var(--cn-spacing-1)'
  },

  '.cn-split-pane-stepper-card-action': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--cn-spacing-3)',
    padding: 'var(--cn-spacing-3)',
    borderRadius: 'var(--cn-rounded-3)',
    marginTop: 'var(--cn-spacing-4)'
  },

  '.cn-split-pane-stepper-card-action-warning': {
    background: 'var(--cn-set-warning-soft-bg)',
    color: 'var(--cn-set-warning-soft-text)'
  },

  '.cn-split-pane-stepper-card-action-danger': {
    background: 'var(--cn-set-danger-soft-bg)',
    color: 'var(--cn-set-danger-soft-text)'
  },

  '.cn-split-pane-stepper-card-action-info': {
    background: 'var(--cn-set-brand-soft-bg)',
    color: 'var(--cn-set-brand-soft-text)'
  },

  '.cn-split-pane-stepper-card-action-success': {
    background: 'var(--cn-set-success-soft-bg)',
    color: 'var(--cn-set-success-soft-text)'
  },

  '.cn-split-pane-stepper-card-action-message': {
    flex: '1',
    minWidth: '0'
  },

  '.cn-split-pane-stepper-card-action-buttons': {
    display: 'flex',
    gap: 'var(--cn-spacing-2)',
    flexShrink: '0'
  }
}
