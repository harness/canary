import { forwardRef } from 'react'

import { Icon } from '@components/icon'

import { StepsPaletteContentLayout } from './step-palette-content-layout'
import { StepsPaletteItemLayout } from './step-palette-item-layout'

export interface StepPaletteSectionProps<T> {
  title: string
  steps: T[]
  onSelect: (step: T) => void
}

const StepPaletteSection = forwardRef<
  HTMLDivElement,
  StepPaletteSectionProps<{ identifier: string; description?: string }>
>(function StepPaletteSection(props: StepPaletteSectionProps<{ identifier: string; description?: string }>, ref) {
  const { steps, onSelect, title } = props

  return (
    <StepsPaletteContentLayout.Section ref={ref}>
      <StepsPaletteContentLayout.SectionHeader>{title}</StepsPaletteContentLayout.SectionHeader>

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
        <p className="text-cn-foreground-3">There is no steps for provided query.</p>
      )}
    </StepsPaletteContentLayout.Section>
  )
})

export { StepPaletteSection }
