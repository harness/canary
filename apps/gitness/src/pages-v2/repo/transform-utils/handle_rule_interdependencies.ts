import { BranchRuleId, Rule } from '@harnessio/ui/views'

export const handleRuleInterdependencies = (ruleId: string, rules: Rule[]): Rule[] => {
  const newRules = [...rules]

  const ruleIndexMap: Record<string, number> = {}
  const ruleMap: Record<string, Rule> = {}

  newRules.forEach((rule, index) => {
    ruleMap[rule.id] = rule
    ruleIndexMap[rule.id] = index
  })

  const blockUpdateRule = ruleMap[BranchRuleId.BLOCK_BRANCH_UPDATE]
  const requirePRRule = ruleMap[BranchRuleId.REQUIRE_PULL_REQUEST]
  const blockForcePushRule = ruleMap[BranchRuleId.BLOCK_FORCE_PUSH]

  if (!blockUpdateRule || !requirePRRule || !blockForcePushRule) {
    return rules
  }

  const getIndex = (id: string) => ruleIndexMap[id]

  if (ruleId === BranchRuleId.BLOCK_BRANCH_UPDATE) {
    const isChecked = blockUpdateRule.checked

    newRules[getIndex(BranchRuleId.BLOCK_FORCE_PUSH)] = {
      ...blockForcePushRule,
      checked: isChecked,
      disabled: isChecked
    }

    newRules[getIndex(BranchRuleId.REQUIRE_PULL_REQUEST)] = {
      ...requirePRRule,
      checked: !isChecked && requirePRRule.checked,
      disabled: isChecked
    }
  }

  if (ruleId === BranchRuleId.REQUIRE_PULL_REQUEST) {
    const isChecked = requirePRRule.checked

    newRules[getIndex(BranchRuleId.BLOCK_FORCE_PUSH)] = {
      ...blockForcePushRule,
      checked: isChecked,
      disabled: isChecked
    }
  }

  return newRules
}
