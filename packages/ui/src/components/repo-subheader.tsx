import { Tabs } from '@/components'
import { SandboxLayout } from '@/components/layouts'
import { useTranslation } from '@/context'

export enum RepoTabsKeys {
  SUMMARY = 'summary',
  CODE = 'code',
  PIPELINES = 'pipelines',
  COMMITS = 'commits',
  TAGS = 'tags',
  PULLS = 'pulls',
  BRANCHES = 'branches',
  SETTINGS = 'settings',
  SEARCH = 'search'
}

export const repoTabsKeysArr = Object.values(RepoTabsKeys)

interface RepoSubheaderProps {
  className?: string
  showPipelinesTab?: boolean
  showSearchTab?: boolean
  summaryPath?: string
  filesPath?: string
  commitsPath?: string
  isRepoEmpty?: boolean
}

export const RepoSubheader = ({
  showPipelinesTab = true,
  showSearchTab = false,
  className,
  summaryPath,
  filesPath,
  commitsPath,
  isRepoEmpty = false
}: RepoSubheaderProps) => {
  const { t } = useTranslation()

  return (
    <SandboxLayout.SubHeader className={className}>
      <Tabs.NavRoot>
        <Tabs.List className="cn-repo-subheader-tabs">
          <Tabs.Trigger value={summaryPath || RepoTabsKeys.SUMMARY}>{t('views:repos.summary', 'Summary')}</Tabs.Trigger>
          <Tabs.Trigger value={filesPath || RepoTabsKeys.CODE} disabled={isRepoEmpty}>
            {t('views:repos.files', 'Files')}
          </Tabs.Trigger>
          {showPipelinesTab && (
            <Tabs.Trigger value={RepoTabsKeys.PIPELINES}>{t('views:repos.pipelines', 'Pipelines')}</Tabs.Trigger>
          )}
          <Tabs.Trigger value={commitsPath || RepoTabsKeys.COMMITS} disabled={isRepoEmpty}>
            {t('views:repos.commits', 'Commits')}
          </Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.TAGS} disabled={isRepoEmpty}>
            {t('views:repos.tags', 'Tags')}
          </Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.PULLS} disabled={isRepoEmpty}>
            {t('views:repos.pullRequests', 'Pull requests')}
          </Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.BRANCHES} disabled={isRepoEmpty}>
            {t('views:repos.branches.title', 'Branches')}
          </Tabs.Trigger>
          {showSearchTab && (
            <Tabs.Trigger value={RepoTabsKeys.SEARCH} disabled={isRepoEmpty}>
              {t('views:repos.search', 'Search')}
            </Tabs.Trigger>
          )}
          <Tabs.Trigger value={RepoTabsKeys.SETTINGS}>{t('views:repos.settings', 'Settings')}</Tabs.Trigger>
        </Tabs.List>
      </Tabs.NavRoot>
    </SandboxLayout.SubHeader>
  )
}
