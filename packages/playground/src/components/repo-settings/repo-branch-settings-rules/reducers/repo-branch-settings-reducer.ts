import { Rule, Action } from '../types'

export const branchSettingsReducer = (state: Rule[], action: Action): Rule[] => {
  switch (action.type) {
    case 'TOGGLE_RULE':
      return state.map(rule => (rule.id === action.ruleId ? { ...rule, checked: action.checked } : rule))
    case 'TOGGLE_SUBMENU':
      return state.map(rule => {
        if (rule.id === action.ruleId) {
          const updatedSubmenu = action.checked
            ? [...(rule.submenu || []), action.submenuId]
            : (rule.submenu || []).filter(id => id !== action.submenuId)
          return { ...rule, submenu: updatedSubmenu }
        }
        return rule
      })
    case 'SET_SELECT_OPTION':
      return state.map(rule => (rule.id === action.ruleId ? { ...rule, selectOptions: action.selectedOptions } : rule))
    default:
      return state
  }
}
