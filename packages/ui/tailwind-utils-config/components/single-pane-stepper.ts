export default {
  '.cn-single-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    flex: '1',
    minHeight: '0',
    background: 'var(--cn-bg-2)',
    overflow: 'hidden'
  },

  '.cn-single-pane-stepper-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-close-btn': {
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

  '.cn-single-pane-stepper-content-header': {
    // v5 title→intro is 10px. No 10px token. `--cn-spacing-3` is 12px (closest). Do not pass
    // a Layout gap prop: those utilities are @layer utilities and would override this.
    gap: 'var(--cn-spacing-3)',
    // v5 intro-to-first-card is 8px. Do not use `--cn-spacing-6` (24px).
    marginBottom: 'var(--cn-spacing-2)'
  },

  // v5 setup head: 16px/600 title, 13px/`--cn-text-2` intro.
  // Compiled line-height vars are `--cn-line-height-{fontSize}-{tightness}`, not the
  // 4px-grid names (`--cn-line-height-20` / `-24` are not emitted). Title uses
  // `--cn-line-height-6-normal` (fontSize.6 × 1.5 = 1.5rem = 24px). Intro uses
  // `--cn-line-height-6-tight` (× 1.25 = 1.25rem = 20px), closest to v5 13px/1.55.
  // No token between `--cn-text-2` and `--cn-text-3`. `--cn-text-3` was too dark on MFE.
  // These classes own type. Do not wrap the nodes in Text — its font-* / text-cn-*
  // utilities are @layer utilities and would win without !important.
  '.cn-single-pane-stepper-content-title': {
    margin: '0',
    fontSize: 'var(--cn-font-size-6)',
    fontWeight: 'var(--cn-font-weight-default-normal-600)',
    lineHeight: 'var(--cn-line-height-6-normal)',
    letterSpacing: 'var(--cn-tracking-tight)',
    color: 'var(--cn-text-1)'
  },

  '.cn-single-pane-stepper-content-subtitle': {
    margin: '0',
    fontSize: 'var(--cn-font-size-4)',
    lineHeight: 'var(--cn-line-height-6-tight)',
    color: 'var(--cn-text-2)'
  },

  '.cn-single-pane-stepper-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',
    containerType: 'size',
    containerName: 'cardStack',

    '&::-webkit-scrollbar': {
      display: 'none'
    },

    '& .cn-flow-stepper-card': {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: '0'
    },

    '& .cn-flow-stepper-card-active, & .cn-flow-stepper-card-error, & .cn-flow-stepper-card-finished, & .cn-flow-stepper-card-completed':
      {
        background: 'transparent',
        boxShadow: 'none'
      },

    '& .cn-flow-stepper-card-content': {
      marginTop: '0',
      paddingLeft: '0'
    },

    '& .cn-flow-stepper-card-description': {
      paddingLeft: '0',
      marginTop: '0',
      marginBottom: 'var(--cn-spacing-3)'
    }

    // Single-pane Restart is slotted into the Stepper.Step header (left of the collapse caret) via
    // renderStepHeaderActions. Do not reserve a content column for it here — that shrinks tiles
    // after selection. DualPane still renders Restart in the card title row.
  },

  '.cn-single-pane-stepper-card-stack-inner': {
    // DualPane keeps 8cqh / 36vh ::before/::after spacers so auto-scroll can
    // keep the active card in focus. SinglePane is a timeline: contentTitle
    // lives in this stack and should start at the top, and the last step
    // should end the scroll content. Do not copy those spacers here.
    // UUI-3566 — v5 stack sides are 40px (`--cn-spacing-10`). Vertical 16px
    // (`--cn-spacing-4`) lines up with YAML chrome top after that header moved to 16px.
    padding: 'var(--cn-spacing-4) var(--cn-spacing-10) var(--cn-spacing-4)'
  }
}
