import { FC, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout } from '@/views'

import { ProjectSettingsTabNavProps } from './project.types'

const ProjectSettingsTabNav: FC<ProjectSettingsTabNavProps> = ({ useTranslationStore }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslationStore()
  const activeTab = location.pathname.split('/').pop() || 'general'

  const makeHandleTabChange = useCallback((tab: string) => () => navigate(tab), [navigate])

  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px]">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList fontSize="xs">
            <TabsTrigger value="general" onClick={makeHandleTabChange('general')}>
              {t('views:projectSettings.tabs.general', 'General')}
            </TabsTrigger>
            <TabsTrigger value="members" onClick={makeHandleTabChange('members')}>
              {t('views:projectSettings.tabs.members', 'Members')}
            </TabsTrigger>
            <TabsTrigger value="labels" onClick={makeHandleTabChange('labels')}>
              {t('views:projectSettings.tabs.labels', 'Labels')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
    </>
  )
}

export { ProjectSettingsTabNav }
