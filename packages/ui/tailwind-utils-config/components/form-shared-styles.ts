import { CONTROL_GROUP_STACK_GAP, FORM_FIELD_STACK_GAP } from './form-constants'

export default {
  '.cn-form': {
    [`@apply flex flex-col ${FORM_FIELD_STACK_GAP}`]: ''
  },

  ':where(.cn-control-group)': {
    [`@apply relative flex flex-col ${CONTROL_GROUP_STACK_GAP}`]: '',
    maxWidth: '100%',

    '&.cn-control-group-horizontal': {
      '@apply flex-row': '',

      '.cn-control-group-label': {
        width: 'var(--cn-input-horizontal-label-max-width)'
      },

      '.cn-control-group-input': {
        '@apply flex-1': ''
      }
    }
  },

  ':where(.cn-control-group-label)': {
    gap: 'var(--cn-layout-3xs)',
    '@apply relative flex flex-col': ''
  },

  ':where(.cn-control-group-input)': {
    [`@apply relative flex flex-col ${CONTROL_GROUP_STACK_GAP}`]: ''
  }
}
