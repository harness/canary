import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

export const RepoLayout = ({ useTranslationStore }: { useTranslationStore: () => TranslationStore }) => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'summary'
  const { t } = useTranslationStore()

  return (
    <>
      <SandboxLayout.SubHeader className="overflow-hidden">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`summary`}>
              <TabsTrigger value="summary">{t('views:repos.summary', 'Summary')}</TabsTrigger>
            </NavLink>
            <NavLink to={`code`}>
              <TabsTrigger value="code">{t('views:repos.files', 'Files')}</TabsTrigger>
            </NavLink>
            <NavLink to={`pipelines`}>
              <TabsTrigger value="pipelines">{t('views:repos.pipelines', 'Pipelines')}</TabsTrigger>
            </NavLink>
            <NavLink to={`commits`}>
              <TabsTrigger value="commits">{t('views:repos.commits', 'Commits')}</TabsTrigger>
            </NavLink>
            <NavLink to={`pulls`}>
              <TabsTrigger value="pull-requests">{t('views:repos.pull-requests', 'Pull Requests')}</TabsTrigger>
            </NavLink>
            <NavLink to={`webhooks`}>
              <TabsTrigger value="webhooks">{t('views:repos.webhooks', 'Webhooks')}</TabsTrigger>
            </NavLink>
            <NavLink to={`branches`}>
              <TabsTrigger value="branches">{t('views:repos.branches', 'Branches')}</TabsTrigger>
            </NavLink>
            <NavLink to={`settings`}>
              <TabsTrigger value="settings">{t('views:repos.settings', 'Settings')}</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
      <Outlet />
    </>
  )
}
