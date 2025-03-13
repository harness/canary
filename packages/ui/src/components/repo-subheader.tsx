import { TabNav } from '@/components'
import { useRouterContext } from '@/context'
import { SandboxLayout, TranslationStore } from '@/views'

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

interface PathParams {
  spaceId?: string
  repoId?: string
}

interface RoutingProps {
  toSummary: ({ spaceId, repoId }: PathParams) => string
  toCode: ({ spaceId, repoId }: PathParams) => string
  toPipelines: ({ spaceId, repoId }: PathParams) => string
  toCommits: ({ spaceId, repoId }: PathParams) => string
  toTags: ({ spaceId, repoId }: PathParams) => string
  toPullRequests: ({ spaceId, repoId }: PathParams) => string
  toBranches: ({ spaceId, repoId }: PathParams) => string
  toSettings: ({ spaceId, repoId }: PathParams) => string
}

interface RepoSubheaderProps {
  useTranslationStore: () => TranslationStore
  showPipelinesTab?: boolean
  className?: string
  tabRoutes?: RoutingProps
}

export const RepoSubheader = ({
  useTranslationStore,
  showPipelinesTab = true,
  className,
  tabRoutes
}: RepoSubheaderProps) => {
  const { useParams } = useRouterContext()
  const { spaceId, repoId } = useParams()
  const { t } = useTranslationStore()

  return (
    <SandboxLayout.SubHeader className={className}>
      <TabNav.Root>
        <TabNav.Item to={tabRoutes?.toSummary({ spaceId, repoId }) || ''}>
          {t('views:repos.summary', 'Summary')}
        </TabNav.Item>
        <TabNav.Item to={tabRoutes?.toCode({ spaceId, repoId }) || ''}>{t('views:repos.files', 'Files')}</TabNav.Item>
        {showPipelinesTab && (
          <TabNav.Item to={tabRoutes?.toPipelines({ spaceId, repoId }) || ''}>
            {t('views:repos.pipelines', 'Pipelines')}
          </TabNav.Item>
        )}
        <TabNav.Item to={tabRoutes?.toCommits({ spaceId, repoId }) || ''}>
          {t('views:repos.commits', 'Commits')}
        </TabNav.Item>
        <TabNav.Item to={tabRoutes?.toTags({ spaceId, repoId }) || ''}>{t('views:repos.tags', 'Tags')}</TabNav.Item>
        <TabNav.Item to={tabRoutes?.toPullRequests({ spaceId, repoId }) || ''}>
          {t('views:repos.pull-requests', 'Pull Requests')}
        </TabNav.Item>
        <TabNav.Item to={tabRoutes?.toBranches({ spaceId, repoId }) || ''}>
          {t('views:repos.branches', 'Branches')}
        </TabNav.Item>
        <TabNav.Item to={tabRoutes?.toSettings({ spaceId, repoId }) || ''}>
          {t('views:repos.settings', 'Settings')}
        </TabNav.Item>
      </TabNav.Root>
    </SandboxLayout.SubHeader>
  )
}
