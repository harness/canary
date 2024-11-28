import { useTheme } from '~/framework/context/ThemeContext'

import { Spacer, Text, ThemeSelector } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/ui/views'

export default function ProfileSettingsThemePage() {
  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content>
        <Spacer size={10} />
        <Text size={5} weight="medium">
          Theme Selector
        </Text>
        <Spacer size={6} />
        <ThemeSelector useTheme={useTheme} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
