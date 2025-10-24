export default {
  '.cn-sandbox-layout': {
    '&-content': {
      paddingTop: 'var(--cn-container-spacing-py)',
      paddingBottom: 'var(--cn-container-spacing-py)',
      paddingLeft: 'var(--cn-container-spacing-px)',
      paddingRight: 'var(--cn-container-spacing-px)',
      '@apply flex flex-col grow w-full': ''
    },

    '&-tabs': {
      marginLeft: 'calc(-1 * var(--cn-container-spacing-px))',
      marginRight: 'calc(-1 * var(--cn-container-spacing-px))',
      paddingLeft: 'var(--cn-container-spacing-px)',
      paddingRight: 'var(--cn-container-spacing-px)'
    }
  }
}
