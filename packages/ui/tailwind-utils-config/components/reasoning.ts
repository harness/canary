export default {
  '.cn-reasoning': {
    marginBottom: 'var(--cn-spacing-4)'
  },
  '.cn-reasoning-trigger': {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: 'var(--cn-spacing-2)',
    transition: 'color 150ms ease'
  },
  '.cn-reasoning-trigger-indicator': {
    color: 'var(--cn-text-3)',
    transition: 'transform 150ms ease',

    '&.cn-reasoning-trigger-indicator-open': {
      transform: 'rotate(180deg)'
    }
  },
  '.cn-reasoning-content': {
    marginTop: 'var(--cn-spacing-4)',
    overflow: 'hidden',
    borderLeftWidth: 'var(--cn-border-width-1)',
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--cn-border-3)',
    paddingLeft: 'var(--cn-layout-md)',
    marginLeft: 'var(--cn-layout-2xs)',

    '&[data-state="open"]': {
      animation: 'collapsible-down 150ms ease-out'
    },
    '&[data-state="closed"]': {
      animation: 'collapsible-up 150ms ease-out'
    }
  },
  '@keyframes collapsible-down': {
    from: {
      height: '0',
      opacity: '0'
    },
    to: {
      height: 'var(--radix-collapsible-content-height)',
      opacity: '1'
    }
  },
  '@keyframes collapsible-up': {
    from: {
      height: 'var(--radix-collapsible-content-height)',
      opacity: '1'
    },
    to: {
      height: '0',
      opacity: '0'
    }
  }
}
