import { FC } from 'react'

import { Tabs } from '@/components'
import { useTranslation } from '@/context'
import { PageTabsNavHeader } from '@views/components/PageTabsNavHeader'

export interface ProjectSettingsTabNavProps {
  isMFE?: boolean
}

export const ProjectSettingsTabNav: FC<ProjectSettingsTabNavProps> = ({ isMFE }) => {
  const { t } = useTranslation()

  return (
    <PageTabsNavHeader>
      {!isMFE && (
        <>
          <Tabs.Trigger value="general">{t('views:projectSettings.tabs.general', 'General')}</Tabs.Trigger>
          <Tabs.Trigger value="members">{t('views:projectSettings.tabs.members', 'Members')}</Tabs.Trigger>
        </>
      )}
      <Tabs.Trigger value="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</Tabs.Trigger>
      <Tabs.Trigger value="rules">{t('views:projectSettings.tabs.rules', 'Rules')}</Tabs.Trigger>
    </PageTabsNavHeader>
  )
}
