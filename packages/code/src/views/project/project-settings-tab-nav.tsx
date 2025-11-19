import { FC } from 'react'

import { SandboxLayout } from '@/views'

import { Tabs } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

export interface ProjectSettingsTabNavProps {
  isMFE?: boolean
}

export const ProjectSettingsTabNav: FC<ProjectSettingsTabNavProps> = ({ isMFE }) => {
  const { t } = useTranslation()

  return (
    <SandboxLayout.SubHeader>
      <Tabs.NavRoot>
        <Tabs.List className="px-cn-xl">
          {!isMFE ? (
            <>
              <Tabs.Trigger value="general">{t('views:projectSettings.tabs.general', 'General')}</Tabs.Trigger>
              <Tabs.Trigger value="members">{t('views:projectSettings.tabs.members', 'Members')}</Tabs.Trigger>
            </>
          ) : null}
          <Tabs.Trigger value="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</Tabs.Trigger>
          <Tabs.Trigger value="rules">{t('views:projectSettings.tabs.rules', 'Rules')}</Tabs.Trigger>
        </Tabs.List>
      </Tabs.NavRoot>
    </SandboxLayout.SubHeader>
  )
}
