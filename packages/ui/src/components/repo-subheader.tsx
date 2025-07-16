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
  summaryPath?: string
  filesPath?: string
  pipelinesPath?: string
  commitsPath?: string
  tagsPath?: string
  pullsPath?: string
  branchesPath?: string
  settingsPath?: string
  currentPath?: string
}

export const RepoSubheader = ({
  showPipelinesTab = true,
  className,
  summaryPath,
  filesPath,
  pipelinesPath,
  commitsPath,
  tagsPath,
  pullsPath,
  branchesPath,
  settingsPath,
  currentPath
}: RepoSubheaderProps) => {
  const { t } = useTranslation()

  return (
    <SandboxLayout.SubHeader className={className}>
      <Tabs.NavRoot value={currentPath}>
        <Tabs.List className="border-b border-cn-borders-3 px-6">
          <Tabs.Trigger value={summaryPath ?? RepoTabsKeys.SUMMARY}>{t('views:repos.summary', 'Summary')}</Tabs.Trigger>
          <Tabs.Trigger value={filesPath ?? RepoTabsKeys.CODE}>{t('views:repos.files', 'Files')}</Tabs.Trigger>
          {showPipelinesTab && (
            <Tabs.Trigger value={pipelinesPath ?? RepoTabsKeys.PIPELINES}>
              {t('views:repos.pipelines', 'Pipelines')}
            </Tabs.Trigger>
          )}
          <Tabs.Trigger value={commitsPath ?? RepoTabsKeys.COMMITS}>{t('views:repos.commits', 'Commits')}</Tabs.Trigger>
          <Tabs.Trigger value={tagsPath ?? RepoTabsKeys.TAGS}>{t('views:repos.tags', 'Tags')}</Tabs.Trigger>
          <Tabs.Trigger value={pullsPath ?? RepoTabsKeys.PULLS}>
            {t('views:repos.pull-requests', 'Pull Requests')}
          </Tabs.Trigger>
          <Tabs.Trigger value={branchesPath ?? RepoTabsKeys.BRANCHES}>
            {t('views:repos.branches', 'Branches')}
          </Tabs.Trigger>
          <Tabs.Trigger value={settingsPath ?? RepoTabsKeys.SETTINGS}>
            {t('views:repos.settings', 'Settings')}
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.NavRoot>
    </SandboxLayout.SubHeader>
  )
}
