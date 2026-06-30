export default {
  '.cn-page': {
    // Horizontal page padding for scrollable content. Mirrors the sticky header's padding
    // (see page-header-v2) so the header and the content below it stay edge-aligned.
    '&-content': {
      paddingLeft: 'var(--cn-page-container-spacing-px)',
      paddingRight: 'var(--cn-page-container-spacing-px)'
    },

    // Top padding modifier. Applied only to standard content; filled/canvas views (flex-1)
    // manage their own internal spacing and opt out.
    '&-content-pt': {
      paddingTop: 'var(--cn-page-container-spacing-py)'
    }
  }
}
