import { FC } from 'react'

import { Spacer, Text, ThemeSelector } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

const ProfileSettingsThemePage: FC = () => {
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight="medium">
          Theme Selector
        </Text>
        <Spacer size={6} />
        <ThemeSelector />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ProfileSettingsThemePage }
