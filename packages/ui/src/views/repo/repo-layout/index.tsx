import { useMemo } from 'react'

import { Tabs } from '@/components'
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

export const RepoLayout = ({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) => {
  const { NavLink, Outlet, location } = useRouterContext()
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
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={RepoTabsKeys.SUMMARY}>
              <Tabs.Trigger value="summary">{t('views:repos.summary', 'Summary')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.CODE}>
              <Tabs.Trigger value="code">{t('views:repos.files', 'Files')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.PIPELINES}>
              <Tabs.Trigger value="pipelines">{t('views:repos.pipelines', 'Pipelines')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.COMMITS}>
              <Tabs.Trigger value="commits">{t('views:repos.commits', 'Commits')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.PULLS}>
              <Tabs.Trigger value="pulls">{t('views:repos.pull-requests', 'Pull Requests')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.BRANCHES}>
              <Tabs.Trigger value="branches">{t('views:repos.branches', 'Branches')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={RepoTabsKeys.SETTINGS}>
              <Tabs.Trigger value="settings">{t('views:repos.settings', 'Settings')}</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}
