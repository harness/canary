export default {
  '.cn-message-bubble': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&.cn-message-bubble-user': {
      alignSelf: 'flex-end',

      '.cn-message-bubble-content': {
        padding: 'var(--cn-spacing-3)',
        background: 'var(--cn-comp-ai-chat-bubble)'
      }
    },
    '&.cn-message-bubble-assistant': {
      alignSelf: 'flex-start'
    },
    '.cn-message-bubble-content': {
      borderRadius: 'var(--cn-rounded-4)'
    }
  }
}
