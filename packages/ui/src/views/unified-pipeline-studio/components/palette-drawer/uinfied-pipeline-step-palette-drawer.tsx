import { ElementType, useMemo, useRef, useState } from 'react'

import { Button, Drawer, EntityFormLayout, Input, Pagination, Spacer } from '@/components'
import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { RightDrawer } from '@views/unified-pipeline-studio/types/right-drawer-types'

import { harnessStepGroups, harnessSteps } from '../steps/harness-steps'
import { StepPaletteSection } from './components/step-palette-section'

const componentsMap: Record<
  'true' | 'false',
  {
    Header: ElementType
    Title: ElementType
    Inner: ElementType
    Footer: ElementType
  }
> = {
  true: {
    Header: Drawer.Header,
    Title: Drawer.Title,
    Inner: Drawer.Inner,
    Footer: Drawer.Footer
  },
  false: {
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Inner: 'div',
    Footer: EntityFormLayout.Footer
  }
}

interface PipelineStudioStepFormProps {
  requestClose: () => void
  isDrawer?: boolean
}

export const UnifiedPipelineStudioStepPalette = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose, isDrawer = false } = props
  const { Header, Title, Inner, Footer } = componentsMap[isDrawer ? 'true' : 'false']
  const { setFormEntity, setRightDrawer, useTemplateListStore, useTranslationStore } = useUnifiedPipelineStudioContext()
  const { page, xNextPage, xPrevPage, setPage, templates, templatesError } = useTemplateListStore()

  const [query, setQuery] = useState('')

  const { t } = useTranslationStore()

  const templatesSectionRef = useRef<HTMLDivElement | null>(null)

  const harnessStepGroupsFiltered = useMemo(
    () => harnessStepGroups.filter(harnessStepGroup => harnessStepGroup.identifier.includes(query)),
    [query, harnessStepGroups]
  )

  const harnessStepsFiltered = useMemo(
    () => harnessSteps.filter(harnessStep => harnessStep.identifier.includes(query)),
    [query, harnessSteps]
  )

  return (
    <>
      <Header>
        <Title>Add Step</Title>
        <Input
          placeholder="Search"
          onChange={value => {
            setQuery(value.target.value)
          }}
        />
      </Header>
      <Inner>
        <StepPaletteSection
          title="Group"
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
          title="Steps"
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
        {templatesError ? (
          <p className="text-sm text-cn-foreground-danger">{templatesError.message}</p>
        ) : (
          <>
            <StepPaletteSection
              ref={templatesSectionRef}
              title="Templates"
              steps={templates ?? []}
              onSelect={step => {
                setFormEntity({
                  source: 'external',
                  type: 'step',
                  data: {
                    identifier: step.identifier,
                    version: step.version,
                    description: step.description
                  }
                })
                setRightDrawer(RightDrawer.Form)
              }}
            />
            <Pagination
              nextPage={xNextPage}
              previousPage={xPrevPage}
              currentPage={page}
              goToPage={(pageNum: number) => {
                templatesSectionRef.current?.scrollIntoView()
                setPage(pageNum, query)
              }}
              t={t}
            />
          </>
        )}

        <Spacer size={8} />
      </Inner>
      <Footer>
        <Button variant="secondary" onClick={requestClose}>
          Cancel
        </Button>
      </Footer>
    </>
  )
}
