import { BranchRulesAction, BranchRulesActionType, MergeStrategy, Rule } from '@harnessio/ui/views'

import { handleRuleInterdependencies } from '../transform-utils/handle_rule_interdependencies'

export const branchSettingsReducer = (state: Rule[], action: BranchRulesAction): Rule[] => {
  switch (action.type) {
    case BranchRulesActionType.TOGGLE_RULE:
      const updatedState = state.map(rule => {
        if (rule.id === action.ruleId) {
          const updatedRule = { ...rule, checked: action.checked }
          if (!action.checked) {
            updatedRule.submenu = []
            updatedRule.selectOptions = []
          }
          return updatedRule
        }
        return rule
      })

      return handleRuleInterdependencies(action.ruleId, updatedState)

    case BranchRulesActionType.TOGGLE_SUBMENU:
      return state.map(rule => {
        if (rule.id === action.ruleId) {
          const updatedSubmenu = action.checked
            ? [...(rule.submenu || []), action.submenuId]
            : (rule.submenu || []).filter(id => id !== action.submenuId)
          return { ...rule, submenu: updatedSubmenu as MergeStrategy[] }
        }
        return rule
      })

    case BranchRulesActionType.SET_SELECT_OPTION:
      return state.map(rule =>
        rule.id === action.ruleId
          ? {
              ...rule,
              selectOptions: action.selectedOptions
            }
          : rule
      )

    case BranchRulesActionType.SET_INPUT_VALUE:
      return state.map(rule => (rule.id === action.ruleId ? { ...rule, input: action.value } : rule))

    case BranchRulesActionType.SET_INITIAL_RULES:
      return action.payload || []

    default:
      return state
  }
}
