import { FC, ReactNode, useMemo } from 'react'

import { IconV2, Layout } from '@/components'

import { ForkRepoSelector, type RepoOption } from './fork-repo-selector'

export interface ForkPRBranchSelectorViewProps {
  forkRepoRef: string
  forkRepoIdentifier: string
  forkDefaultBranch?: string
  upstreamRepoRef?: string
  upstreamRepoIdentifier?: string
  upstreamDefaultBranch?: string
  selectedBaseRepo?: RepoOption
  selectedCompareRepo?: RepoOption
  onBaseRepoChange: (repo: RepoOption) => void
  onCompareRepoChange: (repo: RepoOption) => void
  baseBranchSelector: ReactNode
  compareBranchSelector: ReactNode
  className?: string
}

export const ForkPRBranchSelectorView: FC<ForkPRBranchSelectorViewProps> = ({
  forkRepoRef,
  forkRepoIdentifier,
  forkDefaultBranch,
  upstreamRepoRef,
  upstreamRepoIdentifier,
  upstreamDefaultBranch,
  selectedBaseRepo,
  selectedCompareRepo,
  onBaseRepoChange,
  onCompareRepoChange,
  baseBranchSelector,
  compareBranchSelector,
  className
}) => {
  const repoOptions: RepoOption[] = useMemo(() => {
    const options: RepoOption[] = [
      {
        value: forkRepoRef,
        label: forkRepoIdentifier,
        identifier: forkRepoIdentifier,
        isUpstream: false,
        defaultBranch: forkDefaultBranch
      }
    ]

    if (upstreamRepoRef && upstreamRepoIdentifier) {
      options.unshift({
        value: upstreamRepoRef,
        label: upstreamRepoIdentifier,
        identifier: upstreamRepoIdentifier,
        isUpstream: true,
        defaultBranch: upstreamDefaultBranch
      })
    }

    return options
  }, [
    forkRepoRef,
    forkRepoIdentifier,
    forkDefaultBranch,
    upstreamRepoRef,
    upstreamRepoIdentifier,
    upstreamDefaultBranch
  ])

  return (
    <Layout.Horizontal gapX="3xs" align="center" className={className}>
      <ForkRepoSelector
        repos={repoOptions}
        selectedRepo={selectedBaseRepo}
        onSelectRepo={onBaseRepoChange}
        prefix="base"
        className="max-w-48"
      />
      {baseBranchSelector}

      <IconV2 name="arrow-left" />

      <ForkRepoSelector
        repos={repoOptions}
        selectedRepo={selectedCompareRepo}
        onSelectRepo={onCompareRepoChange}
        prefix="compare"
        className="max-w-48"
      />
      {compareBranchSelector}
    </Layout.Horizontal>
  )
}

ForkPRBranchSelectorView.displayName = 'ForkPRBranchSelectorView'
