import { TabNav } from '@/components'
import { TranslationStore } from '@/types'
// TODO Move sandbox layout to UI components
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

export const RepoSubheader = ({
  useTranslationStore,
  showPipelinesTab = true,
  className
}: {
  useTranslationStore: () => TranslationStore
  showPipelinesTab?: boolean
  className?: string
}) => {
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.SubHeader className={className}>
      <TabNav.Root>
        <TabNav.Item to="summary">{t('views:repos.summary', 'Summary')}</TabNav.Item>
        <TabNav.Item to="code">{t('views:repos.files', 'Files')}</TabNav.Item>
        {showPipelinesTab && <TabNav.Item to="pipelines">{t('views:repos.pipelines', 'Pipelines')}</TabNav.Item>}
        <TabNav.Item to="commits">{t('views:repos.commits', 'Commits')}</TabNav.Item>
        <TabNav.Item to="tags">{t('views:repos.tags', 'Tags')}</TabNav.Item>
        <TabNav.Item to="pulls">{t('views:repos.pull-requests', 'Pull Requests')}</TabNav.Item>
        <TabNav.Item to="branches">{t('views:repos.branches', 'Branches')}</TabNav.Item>
        <TabNav.Item to="settings">{t('views:repos.settings', 'Settings')}</TabNav.Item>
      </TabNav.Root>
    </SandboxLayout.SubHeader>
  )
}
