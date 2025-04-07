import { TranslationStore } from '@/views'
import { Icon, Logo } from '@/components'
import { StepsPaletteContentLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-content-layout'
import { StepsPaletteItemLayout } from '@views/unified-pipeline-studio/components/palette-drawer/components/step-palette-item-layout'

import { AnyConnectorDefinition } from '../types'

export interface ConnectorsPaletteSectionProps {
  connectors: AnyConnectorDefinition[]
  onSelect: (step: AnyConnectorDefinition) => void
  useTranslationStore: () => TranslationStore
}

export function ConnectorsPaletteSection(props: ConnectorsPaletteSectionProps) {
  const { connectors, onSelect, useTranslationStore } = props
  const { t: _t } = useTranslationStore()

  return (
    <StepsPaletteContentLayout.Section>
      {connectors?.length > 0 ? (
        connectors.map(connector => (
          <StepsPaletteContentLayout.SectionItem key={connector.type}>
            <StepsPaletteItemLayout.Root
              onClick={() => {
                onSelect(connector)
              }}
            >
              <StepsPaletteItemLayout.Left className="flex items-center">
                <Logo name={connector.icon} size={36} />
              </StepsPaletteItemLayout.Left>
              <StepsPaletteItemLayout.Right>
                <StepsPaletteItemLayout.Header>
                  <StepsPaletteItemLayout.Title className="text-cn-foreground-1">
                    {connector.name}
                  </StepsPaletteItemLayout.Title>
                </StepsPaletteItemLayout.Header>
                <StepsPaletteItemLayout.Description className="text-cn-foreground-2">
                  {connector.category}
                </StepsPaletteItemLayout.Description>
              </StepsPaletteItemLayout.Right>
              <StepsPaletteItemLayout.RightItem>
                <Icon name="chevron-right" size={12} />
              </StepsPaletteItemLayout.RightItem>
            </StepsPaletteItemLayout.Root>
          </StepsPaletteContentLayout.SectionItem>
        ))
      ) : (
        <p className="text-muted-foreground">There is no connector for provided query.</p>
      )}
    </StepsPaletteContentLayout.Section>
  )
}
