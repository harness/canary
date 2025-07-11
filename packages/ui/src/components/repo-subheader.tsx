import { Tabs } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

export enum RepoTabsKeys {
  SUMMARY = 'summary',
  CODE = 'code',
  PIPELINES = 'pipelines',
  COMMITS = 'commits',
  PULLS = 'pulls',
  BRANCHES = 'branches',
  SETTINGS = 'settings'
}

export const repoTabsKeysArr = Object.values(RepoTabsKeys)

interface RepoSubheaderProps {
  className?: string
  showPipelinesTab?: boolean
  onTabClick?: (tab: 'summary' | 'code' | 'commits') => void
}

export const RepoSubheader = ({ showPipelinesTab = true, className, onTabClick }: RepoSubheaderProps) => {
  const { t } = useTranslation()

  const handleTabClick = (value: 'summary' | 'code' | 'commits') => {
    if (onTabClick) {
      onTabClick(value)
    }
  }

  return (
    <SandboxLayout.SubHeader className={className}>
      <Tabs.NavRoot>
        <Tabs.List className="border-b border-cn-borders-3 px-6">
          <Tabs.Trigger
            value="summary"
            onClick={e => {
              e.preventDefault()
              handleTabClick('summary')
            }}
          >
            {t('views:repos.summary', 'Summary')}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="code"
            onClick={e => {
              e.preventDefault()
              handleTabClick('code')
            }}
          >
            {t('views:repos.files', 'Files')}
          </Tabs.Trigger>
          {showPipelinesTab && <Tabs.Trigger value="pipelines">{t('views:repos.pipelines', 'Pipelines')}</Tabs.Trigger>}
          <Tabs.Trigger
            value="commits"
            onClick={e => {
              e.preventDefault()
              handleTabClick('commits')
            }}
          >
            {t('views:repos.commits', 'Commits')}
          </Tabs.Trigger>
          <Tabs.Trigger value="tags">{t('views:repos.tags', 'Tags')}</Tabs.Trigger>
          <Tabs.Trigger value="pulls">{t('views:repos.pull-requests', 'Pull Requests')}</Tabs.Trigger>
          <Tabs.Trigger value="branches">{t('views:repos.branches', 'Branches')}</Tabs.Trigger>
          <Tabs.Trigger value="settings">{t('views:repos.settings', 'Settings')}</Tabs.Trigger>
        </Tabs.List>
      </Tabs.NavRoot>
    </SandboxLayout.SubHeader>
  )
}
