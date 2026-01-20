export default {
  '.cn-message-bubble': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',

    '&.cn-message-bubble-user': {
      alignSelf: 'flex-end',

      '.cn-message-bubble-content': {
        padding: 'var(--cn-spacing-3)',
        background: 'var(--cn-comp-ai-chat-bubble)'
      }
    },
    '&.cn-message-bubble-assistant': {
      alignSelf: 'flex-start',
      alignItems: 'flex-start'
    },
    '.cn-message-bubble-content': {
      borderRadius: 'var(--cn-rounded-4)'
    },
    '.cn-message-bubble-footer': {
      display: 'flex',
      alignItems: 'center',
      marginTop: 'var(--cn-spacing-1)',
      gap: 'var(--cn-spacing-1)'
    }
  }
}
