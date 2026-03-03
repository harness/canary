export default {
  '.cn-sandbox-layout': {
    '&-content': {
      paddingTop: 'var(--cn-page-container-spacing-py)',
      paddingBottom: 'var(--cn-page-container-spacing-py)',
      paddingLeft: 'var(--cn-page-container-spacing-px)',
      paddingRight: 'var(--cn-page-container-spacing-px)',
      '@apply flex flex-col grow w-full': ''
    },

    '&-tabs': {
      marginLeft: 'calc(-1 * var(--cn-page-container-spacing-px))',
      marginRight: 'calc(-1 * var(--cn-page-container-spacing-px))',
      paddingLeft: 'var(--cn-page-container-spacing-px)',
      paddingRight: 'var(--cn-page-container-spacing-px)'
    }
  }
}
