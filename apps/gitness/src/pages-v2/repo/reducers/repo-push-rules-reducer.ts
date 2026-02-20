import { PushRule, PushRulesAction, PushRulesActionType } from '@harnessio/views'

export const pushRuleSettingsReducer = (state: PushRule[], action: PushRulesAction): PushRule[] => {
  switch (action.type) {
    case PushRulesActionType.TOGGLE_RULE: {
      const updatedState = state.map(rule => {
        if (rule.id === action.ruleId) {
          const updatedRule = { ...rule, checked: action.checked }
          return updatedRule
        }
        return rule
      })

      return updatedState
    }

    case PushRulesActionType.SET_INPUT_VALUE:
      return state.map(rule => (rule.id === action.ruleId ? { ...rule, input: action.value } : rule))

    case PushRulesActionType.SET_INITIAL_RULES:
      return action.payload || []

    default:
      return state
  }
}
