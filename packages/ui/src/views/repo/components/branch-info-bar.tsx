import { FC } from 'react'

import { Button, IconV2, Layout, Link, Popover, Link as StyledLink, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import { BranchSelectorListItem, BranchSelectorTab, easyPluralize } from '@/views'

interface BranchInfoBarProps {
  defaultBranchName?: string
  repoId: string
  spaceId?: string
  selectedBranchTag?: BranchSelectorListItem
  currentBranchDivergence: {
    ahead: number
    behind: number
  }
  refType?: BranchSelectorTab
  showContributeBtn?: boolean
}

export const BranchInfoBar: FC<BranchInfoBarProps> = ({
  defaultBranchName = 'main',
  repoId,
  spaceId,
  selectedBranchTag,
  currentBranchDivergence,
  refType = BranchSelectorTab.BRANCHES,
  showContributeBtn
}) => {
  const { t } = useTranslation()
  const { behind, ahead } = currentBranchDivergence
  const hasBehind = !!behind
  const hasAhead = !!ahead

  return (
    <Layout.Flex
      className="border-cn-2 bg-cn-2 min-h-[3.25rem] rounded-md border py-2 pl-4 pr-2"
      align="center"
      justify="between"
      gapX="xs"
    >
      <Text color="foreground-1">
        <span className="mr-cn-2xs">
          This {refType === BranchSelectorTab.TAGS ? 'tag' : 'branch'} is{' '}
          {hasAhead && (
            <>
              <StyledLink
                to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${selectedBranchTag?.name}`}
              >
                {ahead} {easyPluralize(ahead, 'commit', 'commits')} ahead of
              </StyledLink>
              {hasBehind && ', '}
            </>
          )}
          {hasBehind && (
            <StyledLink
              to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${selectedBranchTag?.name}`}
            >
              {behind} {easyPluralize(behind, 'commit', 'commits')} behind
            </StyledLink>
          )}
          {!hasAhead && !hasBehind && 'up to date with'}
        </span>

        <Link noHoverUnderline to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${defaultBranchName}`}>
          <Tag variant="secondary" theme="gray" icon="git-branch" value={defaultBranchName} className="align-middle" />
        </Link>
      </Text>

      {showContributeBtn && (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outline">
              <IconV2 name="git-pull-request" size="xs" />
              Contribute
              <IconV2 className="chevron-down" name="nav-arrow-down" size="2xs" />
            </Button>
          </Popover.Trigger>
          <Popover.Content align="end" className="w-80" hideArrow>
            <Layout.Grid gapY="xs">
              <Layout.Grid flow="column" gapX="xs">
                <div className="border-cn-3 rounded-2 flex size-8 shrink-0 items-center justify-center border">
                  <IconV2 name="git-pull-request" size="md" />
                </div>
                <Layout.Grid gapY="xs">
                  <Text variant="body-single-line-strong" color="foreground-1">
                    {hasAhead
                      ? `This branch is ${ahead} ${easyPluralize(ahead, 'commit', 'commits')} ahead of`
                      : 'This branch is not ahead of'}
                    &nbsp;
                    <Tag
                      className="mt-0.5 align-sub"
                      variant="secondary"
                      theme="gray"
                      value={defaultBranchName}
                      icon="git-branch"
                    />
                  </Text>

                  <Text color="foreground-3">
                    {hasAhead
                      ? t(
                          'views:repos.compareBranchesToSeeChanges',
                          'Open a pull request to contribute your changes upstream.'
                        )
                      : t('views:repos.noNewCommits', 'No new commits yet.')}
                  </Text>
                </Layout.Grid>
              </Layout.Grid>

              {hasAhead && (
                <Button className="w-full" variant="outline" asChild>
                  <Link
                    noHoverUnderline
                    variant="secondary"
                    to={`${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare/${defaultBranchName}...${selectedBranchTag?.name}`}
                  >
                    Compare
                  </Link>
                </Button>
              )}
            </Layout.Grid>
          </Popover.Content>
        </Popover.Root>
      )}
    </Layout.Flex>
  )
}

BranchInfoBar.displayName = 'BranchInfoBar'
