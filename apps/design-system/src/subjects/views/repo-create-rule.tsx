import { useCallback, useEffect, useState } from 'react'

import { useRepoRulesStore } from '@subjects/views/repo-general-settings/use-repo-rules-store'

import { SkeletonForm } from '@harnessio/ui/components'
import { RepoBranchSettingsRulesPage } from '@harnessio/ui/views'

const errors = {
  principals: null,
  statusChecks: null,
  addRule: null,
  updateRule: null
}

export const RepoCreateRule = () => {
  const [loaded, setLoaded] = useState(false)
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')

  const useBranchRulesStore = useCallback(
    () => ({
      rules: [],
      dispatch: () => {},
      resetRules: () => {}
    }),
    []
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoaded(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (!loaded) {
    return <SkeletonForm className="mt-7" />
  }

  return (
    <RepoBranchSettingsRulesPage
      handleRuleUpdate={() => {}}
      apiErrors={errors}
      isLoading={false}
      useRepoRulesStore={useRepoRulesStore}
      useBranchRulesStore={useBranchRulesStore}
      handleCheckboxChange={() => {}}
      handleSubmenuChange={() => {}}
      handleSelectChangeForRule={() => {}}
      handleInputChange={() => {}}
      handleInitialRules={() => {}}
      setPrincipalsSearchQuery={setPrincipalsSearchQuery}
      principalsSearchQuery={principalsSearchQuery}
    />
  )
}
