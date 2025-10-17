import { FC, useMemo } from 'react'

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

  const compareUrls = useMemo(() => {
    const baseUrl = `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/pulls/compare`
    return {
      aheadCompare: `${baseUrl}/${defaultBranchName}...${selectedBranchTag?.name}`,
      behindCompare: `${baseUrl}/${selectedBranchTag?.name}...${defaultBranchName}`
    }
  }, [spaceId, repoId, defaultBranchName, selectedBranchTag?.name])

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
      className="border-cn-2 bg-cn-2 min-h-[3.25rem] rounded-3 border py-2 pl-4 pr-2"
      align="center"
      justify="between"
      gapX="xs"
    >
      <Layout.Horizontal align="center" gap="xs">
        <Text color="foreground-1">{statusContent}</Text>
        <Link noHoverUnderline to={defaultBranchUrl}>
          <Tag variant="secondary" theme="gray" icon="git-branch" value={defaultBranchName} className="align-middle" />
        </Link>
      </Layout.Horizontal>

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
                  <Link noHoverUnderline variant="secondary" to={compareUrls.aheadCompare}>
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
