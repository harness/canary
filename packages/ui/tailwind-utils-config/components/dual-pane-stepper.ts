export default {
  '.cn-dual-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-0)',
    overflow: 'hidden'
  },

  '.cn-dual-pane-stepper-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-dual-pane-stepper-close-btn': {
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

  '.cn-dual-pane-stepper-panels': {
    display: 'flex',
    flex: '1',
    minHeight: '0',
    overflow: 'hidden'
  },

  '.cn-dual-pane-stepper-left-pane': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '0',
    padding: 'var(--cn-spacing-6)',
    background: 'var(--cn-bg-1)',
    borderRight: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  '.cn-dual-pane-stepper-right-pane': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-1)',
    overflow: 'hidden'
  },

  '.cn-dual-pane-stepper-content-header': {
    padding: 'var(--cn-spacing-6) var(--cn-spacing-6) 0',
    flexShrink: '0',
    gap: 'var(--cn-spacing-3)'
  },

  // Same v5 setup-head type as SinglePane. These classes own type — do not wrap
  // the nodes in Text (its font-* / text-cn-* utilities would force !important).
  // `--cn-line-height-20` / `-24` are not emitted. Title: `--cn-line-height-6-normal`
  // (24px). Intro: `--cn-line-height-6-tight` (20px).
  '.cn-dual-pane-stepper-content-title': {
    margin: '0',
    fontSize: 'var(--cn-font-size-6)',
    fontWeight: 'var(--cn-font-weight-default-normal-600)',
    lineHeight: 'var(--cn-line-height-6-normal)',
    letterSpacing: 'var(--cn-tracking-tight)',
    color: 'var(--cn-text-1)'
  },

  '.cn-dual-pane-stepper-content-subtitle': {
    margin: '0',
    fontSize: 'var(--cn-font-size-4)',
    lineHeight: 'var(--cn-line-height-6-tight)',
    color: 'var(--cn-text-2)'
  },

  '.cn-dual-pane-stepper-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',
    containerType: 'size',
    containerName: 'cardStack',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },

  '.cn-dual-pane-stepper-card-stack-inner': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-6)',
    paddingLeft: 'var(--cn-spacing-6)',
    paddingRight: 'var(--cn-spacing-6)',

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
