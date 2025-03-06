import { Icon } from '@components/icon'
import { StepsPaletteContentLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-content-layout'
import { StepsPaletteItemLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-item-layout'

import { AnyConnectorDefinition } from '../types'

export interface ConnectorsPaletteSectionProps {
  connectors: AnyConnectorDefinition[]
  onSelect: (step: AnyConnectorDefinition) => void
}

export function ConnectorsPaletteSection(props: ConnectorsPaletteSectionProps) {
  const { connectors, onSelect } = props

  return (
    <StepsPaletteContentLayout.Section>
      {connectors.length > 0 ? (
        connectors.map(connector => (
          <StepsPaletteContentLayout.SectionItem key={connector.identifier}>
            <StepsPaletteItemLayout.Root
              onClick={() => {
                onSelect(connector)
              }}
            >
              <StepsPaletteItemLayout.Left>
                <Icon name="harness-plugin" size={36} />
              </StepsPaletteItemLayout.Left>
              <StepsPaletteItemLayout.Right>
                <StepsPaletteItemLayout.Header>
                  <StepsPaletteItemLayout.Title>{connector.identifier}</StepsPaletteItemLayout.Title>
                  {/* <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper> */}
                </StepsPaletteItemLayout.Header>
                <StepsPaletteItemLayout.Description>{connector.description}</StepsPaletteItemLayout.Description>
              </StepsPaletteItemLayout.Right>
            </StepsPaletteItemLayout.Root>
          </StepsPaletteContentLayout.SectionItem>
        ))
      ) : (
        <p className="text-muted-foreground">There is no connector for provided query.</p>
      )}
    </StepsPaletteContentLayout.Section>
  )
}
