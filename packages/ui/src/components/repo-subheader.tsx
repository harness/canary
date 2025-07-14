import { Tabs } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

export enum RepoTabsKeys {
  SUMMARY = 'summary',
  CODE = 'code',
  PIPELINES = 'pipelines',
  COMMITS = 'commits',
  TAGS = 'tags',
  PULLS = 'pulls',
  BRANCHES = 'branches',
  SETTINGS = 'settings'
}

export const repoTabsKeysArr = Object.values(RepoTabsKeys)

interface RepoSubheaderProps {
  className?: string
  showPipelinesTab?: boolean
  onTabClick?: (tab: RepoTabsKeys) => void
}

export const RepoSubheader = ({ showPipelinesTab = true, className, onTabClick }: RepoSubheaderProps) => {
  const { t } = useTranslation()

  const handleTabClick = (value: RepoTabsKeys) => {
    if (onTabClick) {
      onTabClick(value)
    }
  }

  return (
    <SandboxLayout.SubHeader className={className}>
      <Tabs.NavRoot>
        <Tabs.List className="border-b border-cn-borders-3 px-6">
          <Tabs.Trigger
            value={RepoTabsKeys.SUMMARY}
            onClick={e => {
              e.preventDefault()
              handleTabClick(RepoTabsKeys.SUMMARY)
            }}
          >
            {t('views:repos.summary', 'Summary')}
          </Tabs.Trigger>
          <Tabs.Trigger
            value={RepoTabsKeys.CODE}
            onClick={e => {
              e.preventDefault()
              handleTabClick(RepoTabsKeys.CODE)
            }}
          >
            {t('views:repos.files', 'Files')}
          </Tabs.Trigger>
          {showPipelinesTab && (
            <Tabs.Trigger value={RepoTabsKeys.PIPELINES}>{t('views:repos.pipelines', 'Pipelines')}</Tabs.Trigger>
          )}
          <Tabs.Trigger
            value={RepoTabsKeys.COMMITS}
            onClick={e => {
              e.preventDefault()
              handleTabClick(RepoTabsKeys.COMMITS)
            }}
          >
            {t('views:repos.commits', 'Commits')}
          </Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.TAGS}>{t('views:repos.tags', 'Tags')}</Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.PULLS}>{t('views:repos.pull-requests', 'Pull Requests')}</Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.BRANCHES}>{t('views:repos.branches', 'Branches')}</Tabs.Trigger>
          <Tabs.Trigger value={RepoTabsKeys.SETTINGS}>{t('views:repos.settings', 'Settings')}</Tabs.Trigger>
        </Tabs.List>
      </Tabs.NavRoot>
    </SandboxLayout.SubHeader>
  )
}
