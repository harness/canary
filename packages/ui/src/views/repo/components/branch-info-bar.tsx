import { FC, useMemo } from 'react'

import { Button, IconV2, Layout, Link, Popover, Link as StyledLink, Tag, Text } from '@/components'
import { useTranslation } from '@/context'
import { BranchSelectorListItem, BranchSelectorTab, easyPluralize, TypesRepositoryCore } from '@/views'

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
  upstream?: TypesRepositoryCore
  onFetchAndMerge?: () => void
  isFetchingUpstream?: boolean
}

export const BranchInfoBar: FC<BranchInfoBarProps> = ({
  defaultBranchName = 'main',
  repoId,
  spaceId,
  selectedBranchTag,
  currentBranchDivergence,
  refType = BranchSelectorTab.BRANCHES,
  showContributeBtn,
  upstream,
  onFetchAndMerge,
  isFetchingUpstream
}) => {
  const { t } = useTranslation()
  const { behind, ahead } = currentBranchDivergence
  const hasBehind = !!behind
  const hasAhead = !!ahead
  const compareDefaultBranch = upstream ? `upstream:${upstream.default_branch}` : defaultBranchName

  const compareUrls = useMemo(() => {
    const baseUrl = `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare`
    return {
      aheadCompare: `${baseUrl}/${compareDefaultBranch}...${selectedBranchTag?.name}`,
      behindCompare: `${baseUrl}/${selectedBranchTag?.name}...${compareDefaultBranch}`
    }
  }, [spaceId, repoId, compareDefaultBranch, selectedBranchTag?.name])

  const defaultBranchUrl = useMemo(
    () => `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/${defaultBranchName}`,
    [spaceId, repoId, defaultBranchName]
  )

  const statusContent = useMemo(() => {
    const refTypeName = refType === BranchSelectorTab.TAGS ? 'tag' : 'branch'

    if (!hasAhead && !hasBehind) {
      return `This ${refTypeName} is up to date with`
    }

    const message: React.ReactNode[] = [`This ${refTypeName} is `]

    if (hasAhead) {
      message.push(
        <StyledLink key="ahead" to={compareUrls.aheadCompare}>
          {ahead} {easyPluralize(ahead, 'commit', 'commits')} ahead of
        </StyledLink>
      )
      if (hasBehind) {
        message.push(', ')
      }
    }

    if (hasBehind) {
      message.push(
        <StyledLink key="behind" to={compareUrls.behindCompare}>
          {behind} {easyPluralize(behind, 'commit', 'commits')} behind
        </StyledLink>
      )
    }

    return message
  }, [refType, ahead, behind, compareUrls])

  return (
    <Layout.Flex
      className="min-h-[3.25rem] rounded-cn-3 border border-cn-2 bg-cn-2 py-cn-xs pl-cn-md pr-cn-xs"
      align="center"
      justify="between"
      gapX="xs"
    >
      <Layout.Horizontal align="center" gap="xs">
        <Text color="foreground-1">{statusContent}</Text>
        <Link noHoverUnderline to={defaultBranchUrl}>
          <Tag
            variant="secondary"
            theme="gray"
            icon="git-branch"
            value={compareDefaultBranch}
            className="align-middle"
          />
        </Link>
      </Layout.Horizontal>

      <Layout.Horizontal gap="xs">
        {upstream && (
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button variant="outline">
                <IconV2 name="refresh-double" size="xs" />
                {t('views:repos.fetchUpstream', 'Fetch Upstream')}
                <IconV2 className="chevron-down" name="nav-arrow-down" size="2xs" />
              </Button>
            </Popover.Trigger>
            <Popover.Content align="end" className="w-80" hideArrow>
              <Layout.Grid gapY="xs">
                <Layout.Grid flow="column" gapX="xs">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-cn-2 border border-cn-3">
                    <IconV2 name="git-pull-request" size="md" />
                  </div>
                  <Layout.Grid gapY="xs">
                    <Text variant="body-single-line-strong" color="foreground-1">
                      {hasBehind
                        ? t('views:repos.fetchAndMergeCommits', 'Fetch and merge {{count}} {{commits}}', {
                            count: behind,
                            commits: easyPluralize(behind, 'commit', 'commits')
                          })
                        : t('views:repos.noCommitsToFetch', 'No new commits to fetch')}
                    </Text>

                    <Text color="foreground-3">
                      {t('views:repos.keepForkUpToDate', 'Keep this fork up-to-date with upstream repository.')}{' '}
                      <Link to="https://developer.harness.io/docs/code-repository" target="_blank">
                        {t('views:repos.learnMore', 'Learn more')}
                      </Link>
                    </Text>
                  </Layout.Grid>
                </Layout.Grid>

                <Button className="w-full" variant="outline" asChild>
                  <Link noHoverUnderline variant="secondary" to={compareUrls.behindCompare}>
                    {t('views:repos.compare', 'Compare')}
                  </Link>
                </Button>

                {hasBehind && (
                  <Button className="w-full" onClick={onFetchAndMerge} loading={isFetchingUpstream}>
                    {t('views:repos.fetchAndMerge', 'Fetch and merge')}
                  </Button>
                )}
              </Layout.Grid>
            </Popover.Content>
          </Popover.Root>
        )}

        {showContributeBtn && (
          <Button variant="outline" disabled={!hasAhead} asChild={hasAhead}>
            {hasAhead ? (
              <Link noHoverUnderline variant="secondary" to={compareUrls.aheadCompare}>
                <IconV2 name="git-pull-request" size="xs" />
                {t('views:repos.openPullRequest', 'Open Pull Request')}
              </Link>
            ) : (
              <>
                <IconV2 name="git-pull-request" size="xs" />
                {t('views:repos.openPullRequest', 'Open Pull Request')}
              </>
            )}
          </Button>
        )}
      </Layout.Horizontal>
    </Layout.Flex>
  )
}

BranchInfoBar.displayName = 'BranchInfoBar'
