import { Rule, Action, ActionType } from '../types'

export const branchSettingsReducer = (state: Rule[], action: Action): Rule[] => {
  switch (action.type) {
    case ActionType.TOGGLE_RULE:
      return state.map(rule => (rule.id === action.ruleId ? { ...rule, checked: action.checked } : rule))
    case ActionType.TOGGLE_SUBMENU:
      return state.map(rule => {
        if (rule.id === action.ruleId) {
          const updatedSubmenu = action.checked
            ? [...(rule.submenu || []), action.submenuId]
            : (rule.submenu || []).filter(id => id !== action.submenuId)
          return { ...rule, submenu: updatedSubmenu }
        }
        return rule
      })

    case ActionType.SET_SELECT_OPTION:
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
    default:
      return state
  }
}
