import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import {
  DeleteRepositoryErrorResponse,
  FindRepositoryErrorResponse,
  FindSecuritySettingsErrorResponse,
  ListBranchesErrorResponse,
  RuleDeleteErrorResponse,
  RuleListErrorResponse,
  UpdateDefaultBranchErrorResponse,
  UpdatePublicAccessErrorResponse,
  UpdateRepositoryErrorResponse,
  UpdateSecuritySettingsErrorResponse,
  useDeleteRepositoryMutation,
  useFindRepositoryQuery,
  useFindSecuritySettingsQuery,
  useListBranchesQuery,
  useRuleDeleteMutation,
  useRuleListQuery,
  useUpdateDefaultBranchMutation,
  useUpdatePublicAccessMutation,
  useUpdateRepositoryMutation,
  useUpdateSecuritySettingsMutation
} from '@harnessio/code-service-client'
import { AlertDeleteDialog, DeleteAlertDialog } from '@harnessio/ui/components'
import {
  AccessLevel,
  BranchSelectorListItem,
  BranchSelectorTab,
  ErrorTypes,
  RepoSettingsGeneralPage,
  RepoUpdateData,
  SecurityScanning
} from '@harnessio/ui/views'

import { useGetRepoId } from '../../framework/hooks/useGetRepoId'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { useRepoBranchesStore } from './stores/repo-branches-store'
import { useRepoRulesStore } from './stores/repo-settings-store'
import { transformBranchList } from './transform-utils/branch-transform'

export const RepoSettingsGeneralPageContainer = () => {
  const repoRef = useGetRepoRef()
  const repoName = useGetRepoId()
  const navigate = useNavigate()
  const spaceId = useGetSpaceURLParam()
  const queryClient = useQueryClient()
  const { setRepoData, setRules, setSecurityScanning } = useRepoRulesStore()
  const { branchList, setBranchList, setSelectedBranchTag, setSelectedRefType } = useRepoBranchesStore()
  const [branchQuery, setBranchQuery] = useState('')
  const [apiError, setApiError] = useState<{ type: ErrorTypes; message: string } | null>(null)
  const [isRulesAlertDeleteDialogOpen, setIsRulesAlertDeleteDialogOpen] = useState<boolean>(false)
  const [isRepoAlertDeleteDialogOpen, setRepoAlertDeleteDialogOpen] = useState<boolean>(false)
  const [alertDeleteParams, setAlertDeleteParams] = useState<string>('')

  const closeRulesAlertDeleteDialog = () => setIsRulesAlertDeleteDialogOpen(false)
  const openRulesAlertDeleteDialog = (identifier: string) => {
    setAlertDeleteParams(identifier)
    setIsRulesAlertDeleteDialogOpen(true)
  }

  const closeRepoAlertDeleteDialog = () => setRepoAlertDeleteDialogOpen(false)
  const openRepoAlertDeleteDialog = () => setRepoAlertDeleteDialogOpen(true)

  const { data: { body: repoData } = {}, isLoading: isLoadingRepoData } = useFindRepositoryQuery(
    { repo_ref: repoRef },
    {
      onError: (error: FindRepositoryErrorResponse) => {
        const message = error.message || 'Error fetching repo'
        setApiError({ type: ErrorTypes.FETCH_REPO, message })
      }
    }
  )

  const { data: { body: branches } = {} } = useListBranchesQuery(
    {
      repo_ref: repoRef,
      queryParams: {
        order: 'asc',
        page: 1,
        limit: 100,
        query: branchQuery
      }
    },
    {
      onError: (error: ListBranchesErrorResponse) => {
        const message = error.message || 'Error fetching branches'
        setApiError({ type: ErrorTypes.FETCH_BRANCH, message })
      }
    }
  )

  const { data: { body: rulesData } = {}, refetch: refetchRulesList } = useRuleListQuery(
    {
      repo_ref: repoRef,
      queryParams: {}
    },
    {
      onError: (error: RuleListErrorResponse) => {
        const message = error.message || 'Error fetching rules'
        setApiError({ type: ErrorTypes.FETCH_RULES, message })
      }
    }
  )

  const {
    mutate: updateDescription,
    isLoading: updatingDescription,
    isSuccess: updateDescriptionSuccess
  } = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: newData => {
        setApiError(null)
        setRepoData(newData.body)
      },
      onError: (error: UpdateRepositoryErrorResponse) => {
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating repository description'
        setApiError({ type: ErrorTypes.DESCRIPTION_UPDATE, message })
      }
    }
  )

  const { mutate: deleteRule, isLoading: isDeletingRule } = useRuleDeleteMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        refetchRulesList()
        setIsRulesAlertDeleteDialogOpen(false)
        setApiError(null)
      },
      onError: (error: RuleDeleteErrorResponse) => {
        // Invalidate queries to refetch data from server
        queryClient.invalidateQueries(['ruleList', repoRef])

        const message = error.message || 'Error deleting rule'
        setApiError({ type: ErrorTypes.DELETE_RULE, message })
      }
    }
  )

  const {
    mutate: updateBranch,
    isLoading: updatingBranch,
    isSuccess: updateBranchSuccess
  } = useUpdateDefaultBranchMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: newData }) => {
        setRepoData(newData)
        setApiError(null)
      },
      onError: (error: UpdateDefaultBranchErrorResponse) => {
        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['listBranches', repoRef] })

        const message = error.message || 'Error updating default branch'
        setApiError({ type: ErrorTypes.BRANCH_UPDATE, message })
      }
    }
  )

  const {
    mutate: updatePublicAccess,
    isLoading: updatingPublicAccess,
    isSuccess: updatePublicAccessSuccess
  } = useUpdatePublicAccessMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: newData }) => {
        setApiError(null)
        setRepoData(newData)
      },
      onError: (error: UpdatePublicAccessErrorResponse) => {
        // Invalidate the query to refetch the data from the server
        queryClient.invalidateQueries({ queryKey: ['findRepository', repoRef] })

        const message = error.message || 'Error updating public access'
        setApiError({ type: ErrorTypes.UPDATE_ACCESS, message })
      }
    }
  )

  const { isLoading: isLoadingSecuritySettings } = useFindSecuritySettingsQuery(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: data }) => {
        setSecurityScanning(data.secret_scanning_enabled || false)
        setApiError(null)
      },
      onError: (error: FindSecuritySettingsErrorResponse) => {
        const message = error.message || 'Error fetching security settings'
        setApiError({ type: ErrorTypes.FETCH_SECURITY, message })
      }
    }
  )

  const { mutate: updateSecuritySettings, isLoading: UpdatingSecuritySettings } = useUpdateSecuritySettingsMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: data }) => {
        setSecurityScanning(data.secret_scanning_enabled || false)
        setApiError(null)
      },
      onError: (error: UpdateSecuritySettingsErrorResponse) => {
        const message = error.message || 'Error updating security settings'
        setApiError({ type: ErrorTypes.UPDATE_SECURITY, message })
      }
    }
  )

  const { mutate: deleteRepository, isLoading: isDeletingRepo } = useDeleteRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: ({ body: _data }) => {
        navigate(`/${spaceId}/repos`)
        setApiError(null)
      },
      onError: (error: DeleteRepositoryErrorResponse) => {
        const message = error.message || 'Error deleting repository'
        setApiError({ type: ErrorTypes.DELETE_REPO, message })
      }
    }
  )

  const handleDeleteRepository = (identifier: string) => {
    deleteRepository({ repo_ref: identifier })
  }

  const handleRepoUpdate = (data: RepoUpdateData) => {
    updateDescription({
      body: {
        description: data.description
      }
    })
    updateBranch({
      body: {
        name: data.branch
      }
    })
    updatePublicAccess({
      body: {
        is_public: data.access === AccessLevel.PUBLIC
      }
    })
  }

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          setSelectedBranchTag(branch)
          setSelectedRefType(type)
        }
      }
    },
    [spaceId, branchList]
  )

  useEffect(() => {
    if (repoData) {
      setRepoData(repoData)
      setApiError(null)
      const defaultBranch = branchList.find(branch => branch.default)
      setSelectedBranchTag({
        name: defaultBranch?.name || repoData?.default_branch || '',
        sha: defaultBranch?.sha || '',
        default: true
      })
    }
  }, [repoData, setRepoData])

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, ''))
      setApiError(null)
    }
  }, [branches, setBranchList])

  useEffect(() => {
    if (rulesData) {
      setRules(rulesData)
      setApiError(null)
    }
  }, [rulesData, setRules])

  const handleUpdateSecuritySettings = (data: SecurityScanning) => {
    updateSecuritySettings({
      body: {
        secret_scanning_enabled: data.secretScanning
      }
    })
  }

  const handleRuleClick = (identifier: string) => {
    const url = `/${spaceId}/repos/${repoName}/settings/rules/create/${identifier}`

    navigate(url)
  }

  const handleDeleteRule = (ruleIdentifier: string) => {
    deleteRule({ rule_identifier: ruleIdentifier })
  }

  const loadingStates = {
    isLoadingRepoData: isLoadingRepoData || isLoadingSecuritySettings,
    isUpdatingRepoData: updatingPublicAccess || updatingDescription || updatingBranch,
    isLoadingSecuritySettings,
    isUpdatingSecuritySettings: UpdatingSecuritySettings
  }
  return (
    <>
      <RepoSettingsGeneralPage
        handleRepoUpdate={handleRepoUpdate}
        selectBranchOrTag={selectBranchOrTag}
        handleUpdateSecuritySettings={handleUpdateSecuritySettings}
        apiError={apiError}
        loadingStates={loadingStates}
        isRepoUpdateSuccess={updatePublicAccessSuccess || updateDescriptionSuccess || updateBranchSuccess}
        useRepoRulesStore={useRepoRulesStore}
        useRepoBranchesStore={useRepoBranchesStore}
        useTranslationStore={useTranslationStore}
        handleRuleClick={handleRuleClick}
        openRulesAlertDeleteDialog={openRulesAlertDeleteDialog}
        openRepoAlertDeleteDialog={openRepoAlertDeleteDialog}
        searchQuery={branchQuery}
        setSearchQuery={setBranchQuery}
      />

      <DeleteAlertDialog
        open={isRulesAlertDeleteDialogOpen}
        onClose={closeRulesAlertDeleteDialog}
        deleteFn={handleDeleteRule}
        error={apiError}
        type="rule"
        identifier={alertDeleteParams}
        isLoading={isDeletingRule}
      />
      <AlertDeleteDialog
        open={isRepoAlertDeleteDialogOpen}
        onOpenChange={closeRepoAlertDeleteDialog}
        handleDeleteRepository={handleDeleteRepository}
        identifier={repoRef}
        isDeletingRepo={isDeletingRepo}
        error={apiError?.type === ErrorTypes.DELETE_REPO ? apiError.message : null}
        type="repository"
      />
    </>
  )
}
