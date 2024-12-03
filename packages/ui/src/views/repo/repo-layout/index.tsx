import { useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

export enum RepoTabsKeys {
  SUMMERY = 'summary',
  CODE = 'code',
  PIPELINES = 'pipelines',
  COMMITS = 'commits',
  PULLS = 'pulls',
  WEBHOOKS = 'webhooks',
  BRANCHES = 'branches',
  SETTINGS = 'settings'
}

export const repoTabsKeysArr = Object.values(RepoTabsKeys)

export const RepoLayout = ({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) => {
  const location = useLocation()
  const { t } = useTranslationStore()

  const activeTab = useMemo(() => {
    const tab = repoTabsKeysArr.find(key => location.pathname.includes(key))

    return tab ?? RepoTabsKeys.SUMMERY
  }, [location.pathname])

  return (
    <>
      <SandboxLayout.SubHeader className="overflow-hidden">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={RepoTabsKeys.SUMMERY}>
              <TabsTrigger value="summary">{t('views:repos.summary', 'Summary')}</TabsTrigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.CODE}>
              <TabsTrigger value="code">{t('views:repos.files', 'Files')}</TabsTrigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.PIPELINES}>
              <TabsTrigger value="pipelines">{t('views:repos.pipelines', 'Pipelines')}</TabsTrigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.COMMITS}>
              <TabsTrigger value="commits">{t('views:repos.commits', 'Commits')}</TabsTrigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.PULLS}>
              <TabsTrigger value="pulls">{t('views:repos.pull-requests', 'Pull Requests')}</TabsTrigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.WEBHOOKS}>
              <TabsTrigger value="webhooks">{t('views:repos.webhooks', 'Webhooks')}</TabsTrigger>
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
      <Outlet />
    </>
  )
}
