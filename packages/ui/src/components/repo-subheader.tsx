import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { TabNav, Tabs, TabsList, TabsTrigger } from '@/components'
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
      <TabNav.Root>
        <TabNav.Item>
          <NavLink to="summary">Summary</NavLink>
        </TabNav.Item>
        <TabNav.Item>
          <NavLink to="code">Files</NavLink>
        </TabNav.Item>
        <TabNav.Item>
          <NavLink to="pipelines">Pipelines</NavLink>
        </TabNav.Item>
        <TabNav.Item>
          <NavLink to="commits">Commits</NavLink>
        </TabNav.Item>
        <TabNav.Item>
          <NavLink to="pulls">Pull Requests</NavLink>
        </TabNav.Item>
      </TabNav.Root>
    </SandboxLayout.SubHeader>
  )
}
