import { ElementType, useCallback, useMemo, useRef } from 'react'

import {
  Button,
  ButtonLayout,
  Drawer,
  EntityFormLayout,
  Layout,
  Pagination,
  SearchInput,
  SkeletonList,
  Spacer,
  Text
} from '@/components'
import { useUnifiedPipelineStudioContext } from '@views/unified-pipeline-studio/context/unified-pipeline-studio-context'
import { RightDrawer } from '@views/unified-pipeline-studio/types/right-drawer-types'

import { harnessStepGroups, harnessSteps } from '../steps/harness-steps'
import { StepPaletteSection } from './components/step-palette-section'

const componentsMap: Record<
  'true' | 'false',
  {
    Header: ElementType
    Title: ElementType
    Body: ElementType
    Footer: ElementType
  }
> = {
  true: {
    Header: Drawer.Header,
    Title: Drawer.Title,
    Body: Drawer.Body,
    Footer: Drawer.Footer
  },
  false: {
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Body: 'div',
    Footer: EntityFormLayout.Footer
  }
}

interface PipelineStudioStepFormProps {
  requestClose: () => void
  isDrawer?: boolean
}

export const UnifiedPipelineStudioStepPalette = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose, isDrawer = false } = props
  const { Header, Title, Body, Footer } = componentsMap[isDrawer ? 'true' : 'false']
  const { setFormEntity, setRightDrawer, useTemplateListStore } = useUnifiedPipelineStudioContext()
  const {
    page,
    setPage,
    pageSize,
    totalItems,
    templates,
    templatesError,
    searchQuery,
    setSearchQuery,
    isLoading: isFetchingTemplates
  } = useTemplateListStore()

  const templatesSectionRef = useRef<HTMLDivElement | null>(null)

  const harnessStepGroupsFiltered = useMemo(
    () => harnessStepGroups.filter(harnessStepGroup => harnessStepGroup.identifier.includes(searchQuery)),
    [searchQuery, harnessStepGroups]
  )

  const harnessStepsFiltered = useMemo(
    () => harnessSteps.filter(harnessStep => harnessStep.identifier.includes(searchQuery)),
    [searchQuery, harnessSteps]
  )
  const handleSearchQuery = (query: string) => {
    setSearchQuery(query ?? '')
  }

  const goToPage = useCallback(
    (page: number) => {
      templatesSectionRef.current?.scrollIntoView()
      setPage(page - 1)
    },
    [setPage]
  )

  return (
    <>
      <Header>
        <Title>Add Step</Title>
        <SearchInput
          size="sm"
          autoFocus
          id="search"
          defaultValue={searchQuery}
          placeholder="Search"
          onChange={handleSearchQuery}
        />
      </Header>
      <Body>
        <Layout.Flex direction="column" gap="sm">
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
            <Text color="danger">{templatesError.message}</Text>
          ) : isFetchingTemplates ? (
            <SkeletonList />
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
              <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={page + 1} goToPage={goToPage} />
            </>
          )}

          <Spacer size={8} />
        </Layout.Flex>
      </Body>
      <Footer>
        <ButtonLayout.Root>
          <ButtonLayout.Secondary>
            <Button variant="secondary" onClick={requestClose}>
              Cancel
            </Button>
          </ButtonLayout.Secondary>
        </ButtonLayout.Root>
      </Footer>
    </>
  )
}
