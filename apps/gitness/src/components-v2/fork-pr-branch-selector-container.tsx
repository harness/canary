import { FC, useCallback, useState } from 'react'

import { BranchSelectorListItem, ForkPRBranchSelectorView, RepoOption, TypesRepositoryCore } from '@harnessio/ui/views'

import { BranchSelectorContainer } from './branch-selector-container'

interface ForkPRBranchSelectorContainerProps {
  forkRepoRef: string
  forkRepoIdentifier: string
  forkDefaultBranch?: string
  upstream?: TypesRepositoryCore
  initialTargetBranch?: string
  initialSourceBranch?: string
  isUpstreamTarget?: boolean
  isUpstreamSource?: boolean
  onSelectionChange: (params: {
    targetRepo: RepoOption
    targetBranch: BranchSelectorListItem
    sourceRepo: RepoOption
    sourceBranch: BranchSelectorListItem
  }) => void
}

export const ForkPRBranchSelectorContainer: FC<ForkPRBranchSelectorContainerProps> = ({
  forkRepoRef,
  forkRepoIdentifier,
  forkDefaultBranch,
  upstream,
  initialTargetBranch,
  initialSourceBranch,
  isUpstreamTarget = false,
  isUpstreamSource = false,
  onSelectionChange
}) => {
  // State for selected repos
  const [selectedBaseRepo, setSelectedBaseRepo] = useState<RepoOption>(() => {
    if (isUpstreamTarget && upstream) {
      return {
        value: `${upstream.path}/+`,
        label: upstream.identifier || '',
        identifier: upstream.identifier || '',
        isUpstream: true,
        defaultBranch: upstream.default_branch
      }
    }
    return {
      value: forkRepoRef,
      label: forkRepoIdentifier,
      identifier: forkRepoIdentifier,
      isUpstream: false,
      defaultBranch: forkDefaultBranch
    }
  })

  const [selectedCompareRepo, setSelectedCompareRepo] = useState<RepoOption>(() => {
    if (isUpstreamSource && upstream) {
      return {
        value: `${upstream.path}/+`,
        label: upstream.identifier || '',
        identifier: upstream.identifier || '',
        isUpstream: true,
        defaultBranch: upstream.default_branch
      }
    }
    return {
      value: forkRepoRef,
      label: forkRepoIdentifier,
      identifier: forkRepoIdentifier,
      isUpstream: false,
      defaultBranch: forkDefaultBranch
    }
  })

  const [selectedBaseBranch, setSelectedBaseBranch] = useState<BranchSelectorListItem | undefined>(
    initialTargetBranch ? { name: initialTargetBranch, sha: '' } : undefined
  )
  const [selectedCompareBranch, setSelectedCompareBranch] = useState<BranchSelectorListItem | undefined>(
    initialSourceBranch ? { name: initialSourceBranch, sha: '' } : undefined
  )

  const handleBaseRepoChange = useCallback(
    (repo: RepoOption) => {
      const newBranch = repo.defaultBranch ? { name: repo.defaultBranch, sha: '' } : undefined
      setSelectedBaseRepo(repo)
      setSelectedBaseBranch(newBranch)

      if (newBranch && selectedCompareBranch) {
        onSelectionChange({
          targetRepo: repo,
          targetBranch: newBranch,
          sourceRepo: selectedCompareRepo,
          sourceBranch: selectedCompareBranch
        })
      }
    },
    [selectedCompareRepo, selectedCompareBranch, onSelectionChange]
  )

  const handleCompareRepoChange = useCallback(
    (repo: RepoOption) => {
      const newBranch = repo.defaultBranch ? { name: repo.defaultBranch, sha: '' } : undefined
      setSelectedCompareRepo(repo)
      setSelectedCompareBranch(newBranch)

      if (selectedBaseBranch && newBranch) {
        onSelectionChange({
          targetRepo: selectedBaseRepo,
          targetBranch: selectedBaseBranch,
          sourceRepo: repo,
          sourceBranch: newBranch
        })
      }
    },
    [selectedBaseRepo, selectedBaseBranch, onSelectionChange]
  )

  const handleBaseBranchChange = useCallback(
    (branch: BranchSelectorListItem) => {
      setSelectedBaseBranch(branch)

      if (selectedCompareBranch) {
        onSelectionChange({
          targetRepo: selectedBaseRepo,
          targetBranch: branch,
          sourceRepo: selectedCompareRepo,
          sourceBranch: selectedCompareBranch
        })
      }
    },
    [selectedBaseRepo, selectedCompareRepo, selectedCompareBranch, onSelectionChange]
  )

  const handleCompareBranchChange = useCallback(
    (branch: BranchSelectorListItem) => {
      setSelectedCompareBranch(branch)

      if (selectedBaseBranch) {
        onSelectionChange({
          targetRepo: selectedBaseRepo,
          targetBranch: selectedBaseBranch,
          sourceRepo: selectedCompareRepo,
          sourceBranch: branch
        })
      }
    },
    [selectedBaseRepo, selectedBaseBranch, selectedCompareRepo, onSelectionChange]
  )

  const baseBranchSelector = (
    <BranchSelectorContainer
      className="max-w-80"
      repoRef={selectedBaseRepo?.value || forkRepoRef}
      selectedBranch={selectedBaseBranch}
      onSelectBranchorTag={handleBaseBranchChange}
      branchPrefix="base"
      autoSelectDefaultBranch={false}
      hideViewAllLink
      isBranchOnly
    />
  )

  const compareBranchSelector = (
    <BranchSelectorContainer
      className="max-w-80"
      repoRef={selectedCompareRepo?.value || forkRepoRef}
      selectedBranch={selectedCompareBranch}
      onSelectBranchorTag={handleCompareBranchChange}
      branchPrefix="compare"
      autoSelectDefaultBranch={false}
      hideViewAllLink
      isBranchOnly
    />
  )

  return (
    <ForkPRBranchSelectorView
      forkRepoRef={forkRepoRef}
      forkRepoIdentifier={forkRepoIdentifier}
      forkDefaultBranch={forkDefaultBranch}
      upstreamRepoRef={upstream?.path ? `${upstream.path}/+` : undefined}
      upstreamRepoIdentifier={upstream?.identifier}
      upstreamDefaultBranch={upstream?.default_branch}
      selectedBaseRepo={selectedBaseRepo}
      selectedCompareRepo={selectedCompareRepo}
      onBaseRepoChange={handleBaseRepoChange}
      onCompareRepoChange={handleCompareRepoChange}
      baseBranchSelector={baseBranchSelector}
      compareBranchSelector={compareBranchSelector}
    />
  )
}

ForkPRBranchSelectorContainer.displayName = 'ForkPRBranchSelectorContainer'
