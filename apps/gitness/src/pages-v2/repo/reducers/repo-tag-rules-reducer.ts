import { TagRule, TagRulesAction, TagRulesActionType } from '@harnessio/views'

export const tagSettingsReducer = (state: TagRule[], action: TagRulesAction): TagRule[] => {
  switch (action.type) {
    case TagRulesActionType.TOGGLE_RULE: {
      const updatedState = state.map(rule => {
        if (rule.id === action.ruleId) {
          const updatedRule = { ...rule, checked: action.checked }
          return updatedRule
        }
        return rule
      })

      return updatedState
    }

    case TagRulesActionType.SET_INITIAL_RULES:
      return action.payload || []

    default:
      return state
  }
}
