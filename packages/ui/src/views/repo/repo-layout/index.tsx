import { ReactNode, useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

export enum RepoTabsKeys {
  SUMMERY = 'summary',
  CODE = 'code',
  PIPELINES = 'pipelines',
  COMMITS = 'commits',
  PULLS = 'pulls',
  BRANCHES = 'branches',
  SETTINGS = 'settings'
}

export const repoTabsKeysArr = Object.values(RepoTabsKeys)

export const RepoLayout = ({
  useTranslationStore,
  breadcrumbs
}: {
  useTranslationStore: () => TranslationStore
  breadcrumbs: ReactNode
}) => {
  const location = useLocation()
  const { t } = useTranslationStore()

  const activeTab = useMemo(() => {
    // Prioritize 'pulls' over 'commits' if both are present in the pathname
    if (location.pathname.includes(RepoTabsKeys.PULLS)) {
      return RepoTabsKeys.PULLS
    }
    const tab = repoTabsKeysArr.find(key => location.pathname.includes(key))
    return tab ?? RepoTabsKeys.SUMMERY
  }, [location.pathname])

  return (
    <>
      <div className="bg-background-1 sticky top-0 z-40">
        {breadcrumbs}
        <SandboxLayout.SubHeader className="overflow-hidden h-[45px]">
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
              <NavLink to={RepoTabsKeys.BRANCHES}>
                <TabsTrigger value="branches">{t('views:repos.branches', 'Branches')}</TabsTrigger>
              </NavLink>
              <NavLink to={RepoTabsKeys.SETTINGS}>
                <TabsTrigger value="settings">{t('views:repos.settings', 'Settings')}</TabsTrigger>
              </NavLink>
            </TabsList>
          </Tabs>
        </SandboxLayout.SubHeader>
      </div>
      {/* 100vh = screen height - (55px Breadcrumbs Height + 45px SubHeader Height = 100px) */}
      {/* Total height of both the divs should be 100vh */}
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  )
}
