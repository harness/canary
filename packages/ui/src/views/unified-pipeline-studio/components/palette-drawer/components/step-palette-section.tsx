import { Icon } from '@components/icon'

import { AnyStepDefinition } from '../../steps/types'
import { StepsPaletteContentLayout } from './step-palette-content-layout'
import { StepsPaletteItemLayout } from './step-palette-item-layout'

export interface StepPaletteSectionProps {
  steps: AnyStepDefinition[]
  onSelect: (step: AnyStepDefinition) => void
}

export function StepPaletteSection(props: StepPaletteSectionProps) {
  const { steps, onSelect } = props

  return (
    <StepsPaletteContentLayout.Section>
      <StepsPaletteContentLayout.SectionHeader>Groups</StepsPaletteContentLayout.SectionHeader>

      {steps.length > 0 ? (
        steps.map(step => (
          <StepsPaletteContentLayout.SectionItem key={step.identifier}>
            <StepsPaletteItemLayout.Root
              onClick={() => {
                onSelect(step)
              }}
            >
              <StepsPaletteItemLayout.Left>
                <Icon name="harness-plugin" size={36} />
              </StepsPaletteItemLayout.Left>
              <StepsPaletteItemLayout.Right>
                <StepsPaletteItemLayout.Header>
                  <StepsPaletteItemLayout.Title>{step.identifier}</StepsPaletteItemLayout.Title>
                  {/* <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper> */}
                </StepsPaletteItemLayout.Header>
                <StepsPaletteItemLayout.Description>{step.description}</StepsPaletteItemLayout.Description>
              </StepsPaletteItemLayout.Right>
            </StepsPaletteItemLayout.Root>
          </StepsPaletteContentLayout.SectionItem>
        ))
      ) : (
        <p className="text-muted-foreground">There is no steps for provided query.</p>
      )}
    </StepsPaletteContentLayout.Section>
  )
}
