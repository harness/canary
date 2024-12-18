import { BranchRulesAction, BranchRulesActionType, MergeStrategy, Rule } from '../types'

export const branchSettingsReducer = (state: Rule[], action: BranchRulesAction): Rule[] => {
  switch (action.type) {
    case BranchRulesActionType.TOGGLE_RULE:
      return state.map(rule => {
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
              selectOptions: rule.selectOptions.includes(action.checkName)
                ? rule.selectOptions.filter((option: string) => option !== action.checkName)
                : [...rule.selectOptions, action.checkName]
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
