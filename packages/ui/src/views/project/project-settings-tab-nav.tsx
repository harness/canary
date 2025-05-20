import { FC } from 'react'

import { TabNav } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

export interface ProjectSettingsTabNavProps {
  isMFE?: boolean
}

export const ProjectSettingsTabNav: FC<ProjectSettingsTabNavProps> = ({ isMFE }) => {
  const { t } = useTranslation()

  return (
    <SandboxLayout.SubHeader>
      <TabNav.Root>
        {!isMFE ? (
          <>
            <TabNav.Item to="general">{t('views:projectSettings.tabs.general', 'General')}</TabNav.Item>
            <TabNav.Item to="members">{t('views:projectSettings.tabs.members', 'Members')}</TabNav.Item>
          </>
        ) : null}
        <TabNav.Item to="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</TabNav.Item>
        <TabNav.Item to="rules">{t('views:projectSettings.tabs.rules', 'Rules')}</TabNav.Item>
      </TabNav.Root>
    </SandboxLayout.SubHeader>
  )
}
