export default {
  '.cn-flow-stepper-card': {
    position: 'relative',
    background: 'var(--cn-bg-1)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-2)',
    borderRadius: 'var(--cn-rounded-5)',
    padding: 'var(--cn-spacing-6) var(--cn-spacing-6) var(--cn-spacing-8)',
    transition: 'box-shadow 200ms ease'
  },

  '.cn-flow-stepper-card-active': {
    boxShadow: '0 0 6px 3px var(--cn-set-ai-outline-inner)'
  },

  '.cn-flow-stepper-card-error': {
    boxShadow: '0 0 6px 3px var(--cn-set-danger-outline-inner, rgba(239, 68, 68, 0.35))'
  },

  '.cn-flow-stepper-card-completed': {
    boxShadow: 'none'
  },

  '.cn-flow-stepper-card-finished': {
    boxShadow: '0 0 6px 3px var(--cn-set-success-outline-inner, rgba(0, 203, 108, 0.35))'
  },

  '.cn-flow-stepper-card-header': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--cn-spacing-3)'
  },

  '.cn-flow-stepper-card-status': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    flexShrink: '0',
    marginTop: 'var(--cn-spacing-1)'
  },

  '.cn-flow-stepper-card-status-dot': {
    width: 'var(--cn-spacing-2)',
    height: 'var(--cn-spacing-2)',
    borderRadius: 'var(--cn-rounded-full)',
    background: 'var(--cn-set-brand-primary-bg)'
  },

  '.cn-flow-stepper-card-title-row': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--cn-spacing-2)',
    flex: '1',
    minWidth: '0'
  },

  '.cn-flow-stepper-card-edit': {
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

  '.cn-flow-stepper-card:hover .cn-flow-stepper-card-edit': {
    opacity: '1'
  },

  '.cn-flow-stepper-card-content': {
    marginTop: 'var(--cn-spacing-6)',
    paddingLeft: 'calc(var(--cn-size-4) + var(--cn-spacing-3))',

    '&[inert]': {
      opacity: '0.6',
      cursor: 'default'
    }
  },

  '.cn-flow-stepper-card-description': {
    paddingLeft: 'calc(var(--cn-size-4) + var(--cn-spacing-3))',
    marginTop: 'var(--cn-spacing-1)'
  },

  '.cn-flow-stepper-card-action': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--cn-spacing-3)',
    padding: 'var(--cn-spacing-3)',
    borderRadius: 'var(--cn-rounded-3)',
    marginTop: 'var(--cn-spacing-4)'
  },

  '.cn-flow-stepper-card-action-warning': {
    background: 'var(--cn-set-warning-soft-bg)',
    color: 'var(--cn-set-warning-soft-text)'
  },

  '.cn-flow-stepper-card-action-danger': {
    background: 'var(--cn-set-danger-soft-bg)',
    color: 'var(--cn-set-danger-soft-text)'
  },

  '.cn-flow-stepper-card-action-info': {
    background: 'var(--cn-set-brand-soft-bg)',
    color: 'var(--cn-set-brand-soft-text)'
  },

  '.cn-flow-stepper-card-action-success': {
    background: 'var(--cn-set-success-soft-bg)',
    color: 'var(--cn-set-success-soft-text)'
  },

  '.cn-flow-stepper-card-action-message': {
    flex: '1',
    minWidth: '0'
  },

  '.cn-flow-stepper-card-action-buttons': {
    display: 'flex',
    gap: 'var(--cn-spacing-2)',
    flexShrink: '0'
  }
}