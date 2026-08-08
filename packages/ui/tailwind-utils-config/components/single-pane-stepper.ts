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

    // The base .cn-flow-stepper-card-content-only rule (flow-stepper-card.ts) already lays the
    // restart button out as a flex sibling of the content, reserving its own space — no
    // single-pane-specific override needed. This used to absolutely-position the button over the
    // content (position: relative + position: absolute/top:0/right:0), which reserved no layout
    // space and let the button overlap content when the stepper-step header above it wrapped onto
    // multiple lines.
  },

  '.cn-single-pane-stepper-card-stack-inner': {
    padding: 'var(--cn-spacing-6)',

    '&::before': {
      content: "''",
      display: 'block',
      minHeight: '8cqh',
      flexShrink: '0'
    },

    '&::after': {
      content: "''",
      display: 'block',
      minHeight: '36vh',
      flexShrink: '0'
    }
  }
}
