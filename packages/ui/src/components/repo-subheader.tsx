import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
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

export const RepoSubheader = ({
  useTranslationStore,
  showPipelinesTab = true
}: {
  useTranslationStore: () => TranslationStore
  showPipelinesTab?: boolean
}) => {
  const location = useLocation()
  const { t } = useTranslationStore()

  const activeTab = useMemo(() => {
    // Prioritize 'pulls' over 'commits' if both are present in the pathname
    if (location.pathname.includes(RepoTabsKeys.PULLS)) {
      return RepoTabsKeys.PULLS
    }
    const tab = repoTabsKeysArr.find(key => location.pathname.includes(key))
    return tab ?? RepoTabsKeys.SUMMARY
  }, [location.pathname])

  return (
    <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
      <Tabs variant="navigation" value={activeTab}>
        <TabsList>
          <NavLink to={RepoTabsKeys.SUMMARY}>
            <TabsTrigger value="summary">{t('views:repos.summary', 'Summary')}</TabsTrigger>
          </NavLink>
          <NavLink to={RepoTabsKeys.CODE}>
            <TabsTrigger value="code">{t('views:repos.files', 'Files')}</TabsTrigger>
          </NavLink>
          {showPipelinesTab && (
            <NavLink to={RepoTabsKeys.PIPELINES}>
              <TabsTrigger value="pipelines">{t('views:repos.pipelines', 'Pipelines')}</TabsTrigger>
            </NavLink>
          )}
          <NavLink to={RepoTabsKeys.COMMITS}>
            <TabsTrigger value="commits">{t('views:repos.commits', 'Commits')}</TabsTrigger>
          </NavLink>
          <NavLink to={RepoTabsKeys.PULLS}>
            <TabsTrigger value="pulls">{t('views:repos.pull-requests', 'Pull Requests')}</TabsTrigger>
          </NavLink>
          <NavLink to={RepoTabsKeys.BRANCHES}>
            <TabsTrigger value="branches">{t('views:repos.branches', 'Branches')}</TabsTrigger>
          </NavLink>
          <NavLink to={RepoTabsKeys.SETTINGS}>
            <TabsTrigger value="settings">{t('views:repos.settings', 'Settings')}</TabsTrigger>
          </NavLink>
        </TabsList>
      </Tabs>
    </SandboxLayout.SubHeader>
  )
}
