import { FC } from 'react'

import { Button, ButtonLayout, DropdownMenu, IconV2, Layout, Link as StyledLink, Tag, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { BranchSelectorListItem, BranchSelectorTab, easyPluralize } from '@/views'

interface BranchInfoBarProps {
  defaultBranchName?: string
  repoId: string
  spaceId: string
  selectedBranchTag?: BranchSelectorListItem
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
  selectedBranchTag,
  currentBranchDivergence,
  refType = BranchSelectorTab.BRANCHES
}) => {
  const { t } = useTranslation()
  const { Link } = useRouterContext()
  const { behind, ahead } = currentBranchDivergence
  const hasBehind = !!behind
  const hasAhead = !!ahead

  return (
    <div className="flex min-h-9 items-center justify-between rounded-md border border-cn-borders-2 bg-cn-background-2 px-4 py-2">
      <Layout.Flex align="center" gapX="2xs">
        <Text color="foreground-1">
          This {refType === BranchSelectorTab.TAGS ? 'tag' : 'branch'} is{' '}
          {hasAhead && (
            <>
              <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
                {ahead} {easyPluralize(ahead, 'commit', 'commits')} ahead of
              </StyledLink>
              {hasBehind && ', '}
            </>
          )}
          {hasBehind && (
            <StyledLink to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/`}>
              {behind} {easyPluralize(behind, 'commit', 'commits')} behind
            </StyledLink>
          )}
          {!hasAhead && !hasBehind && 'up to date with'}
        </Text>

        <Tag variant="secondary" theme="blue" size="md" value={defaultBranchName}>
          <IconV2 name="git-branch" size="xs" />
        </Tag>
      </Layout.Flex>

      {refType === BranchSelectorTab.BRANCHES && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              className="group/contribute data-[state=open]:border-cn-borders-9 data-[state=open]:text-cn-foreground-1"
              variant="outline"
            >
              <IconV2 name="git-pull-request" size="xs" />
              Contribute
              <IconV2
                className="chevron-down text-icons-7 group-data-[state=open]/contribute:text-icons-2"
                name="nav-arrow-down"
                size="2xs"
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-60">
            <DropdownMenu.Slot>
              <Layout.Grid gapY="xs" className="p-2">
                <Layout.Grid flow="column" gapX="xs">
                  <div className="border-cn-borders-4 flex size-8 shrink-0 items-center justify-center rounded-2 border">
                    <IconV2 name="git-pull-request" size="md" />
                  </div>
                  <Layout.Grid gapY="xs">
                    <Text variant="body-single-line-strong" color="foreground-1">
                      This branch is {ahead} {easyPluralize(ahead, 'commit', 'commits')} ahead of{' '}
                      <Tag
                        className="inline-flex align-middle"
                        variant="outline"
                        theme="gray"
                        size="sm"
                        value={defaultBranchName}
                        icon="git-branch"
                        showIcon
                      />
                    </Text>

                    <Text color="foreground-3">
                      {t(
                        'views:repos.compareBranchesToSeeChanges',
                        'Open a pull request to contribute your changes upstream.'
                      )}
                    </Text>
                  </Layout.Grid>
                </Layout.Grid>

                <ButtonLayout>
                  <Button className="w-full" variant="outline" asChild>
                    <Link
                      to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${selectedBranchTag?.name}`}
                    >
                      Compare
                    </Link>
                  </Button>
                </ButtonLayout>
              </Layout.Grid>
            </DropdownMenu.Slot>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
    </div>
  )
}

BranchInfoBar.displayName = 'BranchInfoBar'
