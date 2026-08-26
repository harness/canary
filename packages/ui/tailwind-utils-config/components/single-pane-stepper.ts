export default {
  '.cn-single-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    flex: '1',
    minHeight: '0',
    background: 'var(--cn-bg-0)',
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
    marginBottom: 'var(--cn-spacing-6)'
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
    // Vertical padding matches YamlOutput's header (--cn-spacing-3 = 12px) so
    // contentTitle lines up with the YAML pane title. Sides stay --cn-spacing-6.
    padding: 'var(--cn-spacing-3) var(--cn-spacing-6)'
  }
}
