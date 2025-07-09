import { IconV2, LogoV2, Text } from '@/components'
import { useTranslation } from '@/context'
import { StepsPaletteContentLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-content-layout'
import { StepsPaletteItemLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-item-layout'

import { ConnectorTypeToLogoNameMap } from '../connectors-list/utils'
import { AnyConnectorDefinition } from '../types'

export interface ConnectorsPaletteSectionProps {
  connectors: AnyConnectorDefinition[]
  onSelect: (step: AnyConnectorDefinition) => void
  showCategory?: boolean
}

export function ConnectorsPaletteSection(props: ConnectorsPaletteSectionProps) {
  const { connectors, onSelect, showCategory } = props
  const { t: _t } = useTranslation()

  return (
    <StepsPaletteContentLayout.Section>
      {connectors?.length > 0 ? (
        connectors.map(connector => {
          const logoName = ConnectorTypeToLogoNameMap.get(connector.type)

          return (
            <StepsPaletteContentLayout.SectionItem key={connector.type}>
              <StepsPaletteItemLayout.Root
                onClick={() => {
                  onSelect(connector)
                }}
              >
                <StepsPaletteItemLayout.Left className="flex items-center">
                  {logoName ? <LogoV2 name={logoName} /> : <IconV2 name="connectors" size="lg" />}
                </StepsPaletteItemLayout.Left>
                <StepsPaletteItemLayout.Right>
                  <StepsPaletteItemLayout.Header>
                    <StepsPaletteItemLayout.Title className="text-cn-foreground-1">
                      {connector.name}
                    </StepsPaletteItemLayout.Title>
                  </StepsPaletteItemLayout.Header>
                  {showCategory && (
                    <StepsPaletteItemLayout.Description className="text-cn-foreground-4">
                      {connector.category}
                    </StepsPaletteItemLayout.Description>
                  )}
                </StepsPaletteItemLayout.Right>
                <StepsPaletteItemLayout.RightItem>
                  <IconV2 name="nav-arrow-right" size="2xs" />
                </StepsPaletteItemLayout.RightItem>
              </StepsPaletteItemLayout.Root>
            </StepsPaletteContentLayout.SectionItem>
          )
        })
      ) : (
        <Text color="foreground-3">There is no connector for provided query.</Text>
      )}
    </StepsPaletteContentLayout.Section>
  )
}
