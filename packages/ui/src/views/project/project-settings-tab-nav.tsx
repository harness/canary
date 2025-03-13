import { FC } from 'react'

import { TabNav } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

export interface ProjectSettingsTabNavProps {
  useTranslationStore: () => TranslationStore
  isMFE?: boolean
}

export const ProjectSettingsTabNav: FC<ProjectSettingsTabNavProps> = ({ useTranslationStore, isMFE }) => {
  const { t } = useTranslationStore()

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
      </TabNav.Root>
    </SandboxLayout.SubHeader>
  )
}
