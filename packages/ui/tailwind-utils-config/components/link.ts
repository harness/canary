export default {
  '.link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--cn-btn-link-gap-default)',
    width: 'fit-content',
    color: 'var(--cn-comp-link-default)',
    textDecoration: 'underline',
    '@apply font-body-tight-normal': '',

    '&:where(.link-sm)': {
      '@apply font-caption-tight-normal': ''
    },

    '&:hover, &:where([data-state="hovered"])': {
      color: 'var(--cn-comp-link-hover)'
    },

    '&:visited, &:where([data-state="visited"])': {
      color: 'var(--cn-comp-link-visited)'
    },

    '> .link-icon': {
      width: '12px',
      height: '12px'
    }
  }
}
