export default {
  '.cn-message-bubble': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&.cn-message-bubble-user': {
      background: 'var(--cn-comp-ai-chat-bubble)',
      alignSelf: 'flex-end',

      '.cn-message-bubble-content': {
        backgroundColor: 'var(--cn-comp-ai-chat-bubble)'
      }
    },
    '&.cn-message-bubble-assistant': {
      alignSelf: 'flex-start'
    }
  },
  '.cn-message-bubble-content': {
    padding: 'var(--cn-spacing-3)',
    borderRadius: 'var(--cn-rounded-4)'
  }
}
