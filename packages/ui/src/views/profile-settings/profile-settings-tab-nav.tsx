import { NavLink } from 'react-router-dom'

import { Tabs, TabsList, TabsTrigger } from '@/components'
import { SandboxLayout, TranslationStore } from '@/views'

function ProfileSettingsTabNav({
  activeTab,
  useTranslationStore
}: {
  activeTab: string
  useTranslationStore: () => TranslationStore
}) {
  const { t } = useTranslationStore()
  return (
    <>
      <SandboxLayout.SubHeader className="h-[45px] overflow-hidden">
        <Tabs variant="navigation" value={activeTab}>
          <TabsList>
            <NavLink to={`general`}>
              <TabsTrigger value="general">{t('views:profileSettings.GeneralTab', 'General')}</TabsTrigger>
            </NavLink>
            <NavLink to={`keys`}>
              <TabsTrigger value="keys">{t('views:profileSettings.KeysTab', 'Keys and Tokens')}</TabsTrigger>
            </NavLink>
          </TabsList>
        </Tabs>
      </SandboxLayout.SubHeader>
    </>
  )
}

export { ProfileSettingsTabNav }
