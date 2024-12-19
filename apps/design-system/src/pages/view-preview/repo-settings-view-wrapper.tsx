import { FC, PropsWithChildren } from 'react'

import { useTranslationsStore } from '@utils/viewUtils'

import { SandboxLayout, SettingsSidebar } from '@harnessio/ui/views'

export const RepoSettingsViewWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslationsStore()

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Columns columnWidths="auto 1fr">
        <SandboxLayout.Column>
          <SettingsSidebar t={t} />
        </SandboxLayout.Column>
        <SandboxLayout.Column>{children}</SandboxLayout.Column>
      </SandboxLayout.Columns>
    </SandboxLayout.Main>
  )
}
