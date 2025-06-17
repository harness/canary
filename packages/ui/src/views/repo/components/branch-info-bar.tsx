import { FC } from 'react'

import { Button, DropdownMenu, IconV2, StatusBadge, Link as StyledLink } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore } from '@/views'

interface BranchInfoBarProps {
  defaultBranchName?: string
  repoId: string
  spaceId: string
  selectedBranchTag?: BranchSelectorListItem
  useRepoBranchesStore?: () => IBranchSelectorStore
  currentBranchDivergence: {
    ahead: number
    behind: number
  }
  refType?: BranchSelectorTab
}

export const BranchInfoBar: FC<BranchInfoBarProps> = ({
  defaultBranchName = 'main',
  repoId,
  spaceId,
  useRepoBranchesStore,
  selectedBranchTag,
  currentBranchDivergence,
  refType = BranchSelectorTab.BRANCHES
}) => {
  const { t } = useTranslation()
  const { Link } = useRouterContext()
  const { behind, ahead } = currentBranchDivergence
  const hasBehind = !!behind
  const hasAhead = !!ahead
  // Get selectedBranchTag from store if useRepoBranchesStore is provided
  const selectedBranchTagFromStore = useRepoBranchesStore?.()?.selectedBranchTag

  // Use the explicitly passed selectedBranchTag if available, otherwise use the one from store
  const activeBranchTag = selectedBranchTag ?? selectedBranchTagFromStore

  return (
    <div className="border-cn-borders-2 bg-cn-background-2 flex h-11 items-center justify-between rounded-md border pl-4 pr-1.5">
      <div className="flex items-center gap-x-1.5">
        <span className="text-2 text-cn-foreground-1 leading-tight">
          This {refType === BranchSelectorTab.TAGS ? 'tag' : 'branch'} is{' '}
          {hasAhead && (
            <>
              <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
                {ahead} commits ahead of
              </StyledLink>
              {hasBehind && ', '}
            </>
          )}
          {hasBehind && (
            <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
              {behind} commits behind
            </StyledLink>
          )}
          {!hasAhead && !hasBehind && 'up to date with'}
        </span>
        {/* TODO: Design system: change it to tag */}
        <StatusBadge variant="secondary" theme="muted" size="sm">
          <IconV2 name="git-branch" size="xs" />
          <span>{defaultBranchName}</span>
        </StatusBadge>
      </div>
      {refType === BranchSelectorTab.BRANCHES ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              className="group/contribute data-[state=open]:border-cn-borders-9 data-[state=open]:text-cn-foreground-1 [&_svg]:data-[state=open]:text-icons-9 gap-x-2 px-2.5"
              variant="outline"
            >
              <IconV2 name="git-pull-request" size="xs" />
              <span>Contribute</span>
              <IconV2
                className="chevron-down text-icons-7 group-data-[state=open]/contribute:text-icons-2"
                name="nav-arrow-down"
                size="2xs"
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Slot className="flex gap-x-2">
              <div className="border-cn-borders-4 flex size-6 shrink-0 items-center justify-center rounded-full border">
                <IconV2 name="git-pull-request" size="2xs" />
              </div>
              <div>
                <span className="text-2 text-cn-foreground-1 leading-snug">
                  This branch is {ahead} commits ahead of{' '}
                </span>
                <StatusBadge className="mt-1" variant="secondary" theme="muted" size="sm">
                  <IconV2 name="git-branch" size="xs" />
                  <span>{defaultBranchName}</span>
                </StatusBadge>
                .
                <p className="text-2 text-cn-foreground-2 mt-2.5 leading-tight">
                  {t('views:repos.compareBranchesToSeeChanges', 'Compare branches to see your changes.')}
                </p>
                <p className="text-2 text-cn-foreground-2 mt-2.5 leading-tight">
                  {t(
                    'views:repos.afterComparingOpenPullRequest',
                    'After comparing changes, you may open a pull request to contribute your changes upstream.'
                  )}
                </p>
              </div>
            </DropdownMenu.Slot>
            <DropdownMenu.Slot className="mt-4 flex flex-col gap-y-2.5">
              <Button className="w-full" variant="outline" asChild>
                <Link
                  to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${activeBranchTag?.name}`}
                >
                  Compare
                </Link>
              </Button>
            </DropdownMenu.Slot>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ) : null}
    </div>
  )
}
