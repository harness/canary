import { FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

export interface ProjectSettingsTabNavProps {
  useTranslationStore: () => TranslationStore
}

export const ProjectSettingsPage: FC<ProjectSettingsTabNavProps> = ({ useTranslationStore }) => {
  const { t } = useTranslationStore()
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop() || 'general'

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`general`}>
              <TabsTrigger value="general">{t('views:projectSettings.tabs.general', 'General')}</TabsTrigger>
            </NavLink>
            <NavLink to={`members`}>
              <TabsTrigger value="members">{t('views:projectSettings.tabs.members', 'Members')}</TabsTrigger>
            </NavLink>
            <NavLink to={`labels`}>
              <TabsTrigger value="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
    </>
  )
}
