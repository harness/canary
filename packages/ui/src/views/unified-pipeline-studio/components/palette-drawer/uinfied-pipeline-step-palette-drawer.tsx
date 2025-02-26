import { useMemo, useState } from 'react'

import { Button } from '@components/button'
import { Input } from '@components/input'
import { Spacer } from '@components/spacer'
import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { RightDrawer } from '@views/unified-pipeline-studio/types/right-drawer-types'

import { harnessStepGroups, harnessSteps } from '../steps/harness-steps'
import { StepFormLayout } from './components/step-form-layout'
import { StepsPaletteContentLayout } from './components/step-palette-content-layout'
import { StepsPaletteLayout } from './components/step-palette-layout'
import { StepPaletteSection } from './components/step-palette-section'

interface PipelineStudioStepFormProps {
  requestClose: () => void
}

export const UnifiedPipelineStudioStepPalette = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose } = props

  const { setFormEntity, setRightDrawer } = useUnifiedPipelineStudioContext()

  const [query, setQuery] = useState('')

  // const templatesSectionRef = useRef<HTMLDivElement | null>(null)

  const harnessStepGroupsFiltered = useMemo(
    () => harnessStepGroups.filter(harnessStepGroup => harnessStepGroup.identifier.includes(query)),
    [query, harnessStepGroups]
  )

  const harnessStepsFiltered = useMemo(
    () => harnessSteps.filter(harnessStep => harnessStep.identifier.includes(query)),
    [query, harnessSteps]
  )

  return (
    <StepsPaletteLayout.Root>
      <StepsPaletteLayout.Header>
        <StepsPaletteLayout.Title>Add Step</StepsPaletteLayout.Title>
        <Input
          placeholder="Search"
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </StepsPaletteLayout.Header>
      <StepsPaletteContentLayout.Root>
        <StepPaletteSection
          steps={harnessStepGroupsFiltered}
          onSelect={step => {
            setFormEntity({
              source: 'embedded',
              type: 'step',
              data: {
                identifier: step.identifier,
                description: step.description
              }
            })
            setRightDrawer(RightDrawer.Form)
          }}
        />
        <StepPaletteSection
          steps={harnessStepsFiltered}
          onSelect={step => {
            setFormEntity({
              source: 'embedded',
              type: 'step',
              data: {
                identifier: step.identifier,
                description: step.description
              }
            })
            setRightDrawer(RightDrawer.Form)
          }}
        />
        {/* <Spacer size={8} />
        <Pagination
          nextPage={1}
          previousPage={2}
          currentPage={page}
          goToPage={(pageNum: number) => {
            templatesSectionRef.current?.scrollIntoView()
            setPage(pageNum)
          }}
          t={t}
        /> */}
        <Spacer size={8} />
      </StepsPaletteContentLayout.Root>
      <StepFormLayout.Footer>
        <Button variant="secondary" onClick={requestClose}>
          Cancel
        </Button>
      </StepFormLayout.Footer>
    </StepsPaletteLayout.Root>
  )
}
