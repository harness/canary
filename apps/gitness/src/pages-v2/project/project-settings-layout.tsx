import { Outlet, useLocation } from 'react-router-dom'

import { Tabs } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { SandboxLayout, SubHeaderWrapper } from '@harnessio/views'

import { useIsMFE } from '../../framework/hooks/useIsMFE'

export const ProjectSettingsLayout = () => {
  const isMFE = useIsMFE()
  const location = useLocation()
  const { t } = useTranslation()
  const isManageRepositoriesPage = location.pathname.includes('/manage-repositories')

  return (
    <>
      <SubHeaderWrapper>
        <SandboxLayout.SubHeader>
          <Tabs.NavRoot>
            <Tabs.List className="px-cn-xl">
              {isManageRepositoriesPage ? (
                <>
                  <Tabs.Trigger value="general">{t('views:projectSettings.tabs.settings', 'Settings')}</Tabs.Trigger>
                  <Tabs.Trigger value="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</Tabs.Trigger>
                  <Tabs.Trigger value="rules">{t('views:projectSettings.tabs.rules', 'Rules')}</Tabs.Trigger>
                </>
              ) : (
                <>
                  {!isMFE ? (
                    <>
                      <Tabs.Trigger value="general">{t('views:projectSettings.tabs.general', 'General')}</Tabs.Trigger>
                      <Tabs.Trigger value="members">{t('views:projectSettings.tabs.members', 'Members')}</Tabs.Trigger>
                    </>
                  ) : (
                    <Tabs.Trigger value="general">{t('views:projectSettings.tabs.general', 'General')}</Tabs.Trigger>
                  )}
                  <Tabs.Trigger value="labels">{t('views:projectSettings.tabs.labels', 'Labels')}</Tabs.Trigger>
                  <Tabs.Trigger value="rules">{t('views:projectSettings.tabs.rules', 'Rules')}</Tabs.Trigger>
                </>
              )}
            </Tabs.List>
          </Tabs.NavRoot>
        </SandboxLayout.SubHeader>
      </SubHeaderWrapper>
      <Outlet />
    </>
  )
}
