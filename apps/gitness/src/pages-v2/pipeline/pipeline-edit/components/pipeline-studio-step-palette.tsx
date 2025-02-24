import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Button, Icon, Input, Spacer } from '@harnessio/canary'
import { useListTemplatesQuery } from '@harnessio/code-service-client'
import { Pagination, SkeletonList } from '@harnessio/ui/components'
import {
  harnessStepGroups,
  harnessSteps,
  StepForm,
  StepsPalette,
  StepsPaletteContent,
  StepsPaletteItem
} from '@harnessio/views'

import { useTranslationStore } from '../../../../i18n/stores/i18n-store.ts'
import { PathParams } from '../../../../RouteDefinitions'
import { PageResponseHeader } from '../../../../types'
import { StepSource } from '../context/data-store/types'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'

interface PipelineStudioStepFormProps {
  requestClose: () => void
}

const PipelineStudioStepPalette = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { t } = useTranslationStore()
  const { requestClose } = props
  const {
    state: { addStepIntention },
    setFormStep,
    requestYamlModifications
  } = usePipelineDataContext()
  const { setStepDrawerOpen } = usePipelineViewContext()
  const { spaceId } = useParams<PathParams>()

  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const { data: { body: pluginsResponse, headers } = {}, isFetching } = useListTemplatesQuery({
    space_ref: spaceId || '',
    queryParams: { limit: 100, page, query }
  })

  const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
  const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')

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
    <StepsPalette.Root>
      <StepsPalette.Header>
        <StepsPalette.Title>Add Step</StepsPalette.Title>
        <Input
          placeholder="Search"
          onChange={value => {
            setQuery(value.target.value)
            setPage(1)
          }}
        />
        {/* <StepPaletteFilters /> */}
      </StepsPalette.Header>
      <StepsPaletteContent.Root>
        <StepsPaletteContent.Section>
          <StepsPaletteContent.SectionHeader>Groups</StepsPaletteContent.SectionHeader>

          {harnessStepGroupsFiltered.length > 0 ? (
            harnessStepGroupsFiltered.map(harnessStepGroup => (
              <StepsPaletteContent.SectionItem key={harnessStepGroup.identifier}>
                <StepsPaletteItem.Root
                  onClick={() => {
                    if (addStepIntention) {
                      requestYamlModifications.injectInArray({
                        path: addStepIntention.path,
                        position: addStepIntention.position,
                        item: { [harnessStepGroup.identifier]: { steps: [] } }
                      })
                    }

                    requestClose()
                  }}
                >
                  <StepsPaletteItem.Left>
                    <Icon name="harness-plugin" size={36} />
                  </StepsPaletteItem.Left>
                  <StepsPaletteItem.Right>
                    <StepsPaletteItem.Header>
                      <StepsPaletteItem.Title>{harnessStepGroup.identifier}</StepsPaletteItem.Title>
                      {/* <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper> */}
                    </StepsPaletteItem.Header>
                    <StepsPaletteItem.Description>{harnessStepGroup.description}</StepsPaletteItem.Description>
                  </StepsPaletteItem.Right>
                </StepsPaletteItem.Root>
              </StepsPaletteContent.SectionItem>
            ))
          ) : (
            <p className="text-muted-foreground">There is no steps for provided query.</p>
          )}
        </StepsPaletteContent.Section>
        <StepsPaletteContent.Section>
          <StepsPaletteContent.SectionHeader>Harness</StepsPaletteContent.SectionHeader>

          {harnessStepsFiltered.length > 0 ? (
            harnessStepsFiltered.map(harnessStep => (
              <StepsPaletteContent.SectionItem key={harnessStep.identifier}>
                <StepsPaletteItem.Root
                  onClick={() => {
                    setFormStep({
                      stepSource: StepSource.Harness,
                      data: {
                        identifier: harnessStep.identifier,
                        description: harnessStep.description
                      }
                    })
                    setStepDrawerOpen(StepDrawer.Form)
                  }}
                >
                  <StepsPaletteItem.Left>
                    <Icon name="harness-plugin" size={36} />
                  </StepsPaletteItem.Left>
                  <StepsPaletteItem.Right>
                    <StepsPaletteItem.Header>
                      <StepsPaletteItem.Title>{harnessStep.identifier}</StepsPaletteItem.Title>
                    </StepsPaletteItem.Header>
                    <StepsPaletteItem.Description>{harnessStep.description}</StepsPaletteItem.Description>
                  </StepsPaletteItem.Right>
                </StepsPaletteItem.Root>
              </StepsPaletteContent.SectionItem>
            ))
          ) : (
            <p className="text-muted-foreground">There is no steps for provided query.</p>
          )}
        </StepsPaletteContent.Section>
        <StepsPaletteContent.Section ref={templatesSectionRef}>
          <StepsPaletteContent.SectionHeader>Templates</StepsPaletteContent.SectionHeader>
          {isFetching ? (
            <SkeletonList />
          ) : (
            pluginsResponse?.map(item => (
              <StepsPaletteContent.SectionItem key={item.identifier}>
                <StepsPaletteItem.Root
                  onClick={() => {
                    if (addStepIntention?.path && addStepIntention?.position && item.data) {
                      setFormStep({
                        stepSource: StepSource.Templates,
                        data: item
                      })
                      setStepDrawerOpen(StepDrawer.Form)
                    } else {
                      //TODO: TOAST HERE
                    }
                  }}
                >
                  <StepsPaletteItem.Left>
                    <Icon name="harness-plugin" size={36} />
                  </StepsPaletteItem.Left>
                  <StepsPaletteItem.Right>
                    <StepsPaletteItem.Header>
                      <StepsPaletteItem.Title>{item.identifier}</StepsPaletteItem.Title>
                      {/* <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper> */}
                    </StepsPaletteItem.Header>
                    <StepsPaletteItem.Description>{item.description}</StepsPaletteItem.Description>
                  </StepsPaletteItem.Right>
                </StepsPaletteItem.Root>
              </StepsPaletteContent.SectionItem>
            ))
          )}
          {!isFetching && pluginsResponse?.length === 0 ? (
            <p className="text-muted-foreground">There is no steps for provided query.</p>
          ) : null}
        </StepsPaletteContent.Section>
        <Spacer size={8} />
        <Pagination
          nextPage={xNextPage}
          previousPage={xPrevPage}
          currentPage={page}
          goToPage={(pageNum: number) => {
            templatesSectionRef.current?.scrollIntoView()
            setPage(pageNum)
          }}
          t={t}
        />
        <Spacer size={8} />
      </StepsPaletteContent.Root>
      <StepForm.Footer>
        <Button variant="secondary" onClick={requestClose}>
          Cancel
        </Button>
      </StepForm.Footer>
    </StepsPalette.Root>
  )
}

export { PipelineStudioStepPalette }
