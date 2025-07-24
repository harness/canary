import { MessageTheme } from '@harnessio/ui/components'
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
  const enableDefaultReviewersRule = ruleMap[BranchRuleId.ENABLE_DEFAULT_REVIEWERS]
  const reqiureMinDefaultReviewers = ruleMap[BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT]

  if (
    !blockUpdateRule ||
    !requirePRRule ||
    !blockForcePushRule ||
    !enableDefaultReviewersRule ||
    !reqiureMinDefaultReviewers
  ) {
    return rules
  }

  const getIndex = (id: string) => ruleIndexMap[id]

  // Handle validation for enable default reviewers
  if (
    (ruleId === BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT ||
      ruleId === BranchRuleId.ENABLE_DEFAULT_REVIEWERS) &&
    enableDefaultReviewersRule.checked &&
    reqiureMinDefaultReviewers.checked
  ) {
    const minDefaultReviewerCount = Number(reqiureMinDefaultReviewers.input)
    const defaultReviewersCount = enableDefaultReviewersRule.selectOptions?.length || 0

    const validationMessage = {
      message: '',
      theme: MessageTheme.DEFAULT
    }
    if (minDefaultReviewerCount === defaultReviewersCount) {
      if (defaultReviewersCount === 1) {
        validationMessage.message = 'defaultReviewerWarning'
      } else if (defaultReviewersCount > 1) {
        validationMessage.message = 'defaultReviewersWarning'
      }
      validationMessage.theme = MessageTheme.WARNING
    } else if (minDefaultReviewerCount > defaultReviewersCount) {
      validationMessage.message =
        minDefaultReviewerCount > 1
          ? `Select at least ${minDefaultReviewerCount} default reviewers`
          : 'Select at least 1 default reviewer'
      validationMessage.theme = MessageTheme.ERROR
    }

    newRules[getIndex(BranchRuleId.ENABLE_DEFAULT_REVIEWERS)] = {
      ...enableDefaultReviewersRule,
      validationMessage
    }
  }

  // Handle visibility for other rules
  switch (ruleId) {
    case BranchRuleId.ENABLE_DEFAULT_REVIEWERS: {
      const isHidden = !enableDefaultReviewersRule.checked

      newRules[getIndex(BranchRuleId.REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT)] = {
        ...reqiureMinDefaultReviewers,
        hidden: isHidden
      }
      break
    }

    case BranchRuleId.BLOCK_BRANCH_UPDATE: {
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
      break
    }

    case BranchRuleId.REQUIRE_PULL_REQUEST: {
      const isChecked = requirePRRule.checked

      newRules[getIndex(BranchRuleId.BLOCK_FORCE_PUSH)] = {
        ...blockForcePushRule,
        checked: isChecked,
        disabled: isChecked
      }
      break
    }
  }

  return newRules
}
