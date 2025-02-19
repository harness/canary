import { FC } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Tabs } from '@/components'
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
        <Tabs.Root variant="navigation" value={activeTab}>
          <Tabs.List>
            <NavLink to={`general`}>
              <Tabs.Trigger value="general">{t('views:projectSettings.tabs.general', 'General')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={`members`}>
              <Tabs.Trigger value="members">{t('views:projectSettings.tabs.members', 'Members')}</Tabs.Trigger>
            </NavLink>
            <NavLink to={`labels`}>
              <Tabs.Trigger value="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</Tabs.Trigger>
            </NavLink>
          </Tabs.List>
        </Tabs.Root>
      </SandboxLayout.SubHeader>
    </>
  )
}
