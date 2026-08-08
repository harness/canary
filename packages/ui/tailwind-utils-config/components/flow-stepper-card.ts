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

  // Content-only cards (single-pane stepper: the stepper step itself renders the title/status, this
  // card renders only its body) lay the restart button out as a real flex sibling of the content
  // instead of overlaying it — so the button reserves its own space and content never needs to
  // "clear" a disconnected fixed offset. Replaces a prior absolute-positioned overlay (see
  // single-pane-stepper.ts history) that had no reserved space and could overlap the content.
  '.cn-flow-stepper-card-content-only': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--cn-spacing-3)'
  },

  // Content-only mode nests this card directly under a Stepper.Step whose collapse chevron
  // (.cn-stepper-step-collapse-trigger in stepper.ts) sits above it, right-aligned in the same
  // width-bounded row. That trigger's icon center sits var(--cn-spacing-1) marginRight +
  // var(--cn-spacing-1) padding + half its (xs) icon width in from the row's right edge. This
  // button has no internal padding (its icon fills the box exactly) and used to sit flush against
  // that same right edge, so its icon center was ~2x closer to the edge than the chevron's —
  // visibly offset. var(--cn-spacing-2) marginRight is the closest existing token that brings the
  // two icons' horizontal centers into (near-exact, sub-pixel-token) alignment without introducing
  // a raw pixel value; it does not affect the default (non-content-only) header restart button used
  // by DualPaneStepper, which has no adjacent chevron to align to.
  '.cn-flow-stepper-card-content-only .cn-flow-stepper-card-edit': {
    marginRight: 'var(--cn-spacing-2)'
  },

  '.cn-flow-stepper-card-content': {
    marginTop: 'var(--cn-spacing-6)',
    paddingLeft: 'calc(var(--cn-size-4) + var(--cn-spacing-3))',
    // Only takes effect inside the flex-row layout above (.cn-flow-stepper-card-content-only); a
    // no-op in the default vertical (non-content-only) layout, which isn't a flex container.
    flex: '1',
    minWidth: '0',

    '&[inert]': {
      opacity: '0.6',
      cursor: 'default'
    }
  },

  '.cn-flow-stepper-card-description': {
    paddingLeft: 'calc(var(--cn-size-4) + var(--cn-spacing-3))',
    marginTop: 'var(--cn-spacing-1)'
  },

  '.cn-flow-stepper-card-blocked-message': {
    marginBottom: 'var(--cn-spacing-4)'
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
