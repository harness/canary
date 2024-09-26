import React, { useEffect, useState } from 'react'
import { Input, Icon, Button } from '@harnessio/canary'
import { useListPluginsQuery } from '@harnessio/code-service-client'
import {
  StepForm,
  StepsPalette,
  StepsPaletteContent,
  StepsPaletteItem,
  StepPaletteFilters,
  RUN_STEP_IDENTIFIER,
  RUN_STEP_DESCRIPTION
} from '@harnessio/playground'
import { usePipelineDataContext } from '../context/PipelineStudioDataProvider'
import { StepDrawer, usePipelineViewContext } from '../context/PipelineStudioViewProvider'
import { TypesPlugin } from '../types/api-types'

interface PipelineStudioStepFormProps {
  requestClose: () => void
}

const PipelineStudioStepPalette = (props: PipelineStudioStepFormProps): JSX.Element => {
  const { requestClose } = props
  const { addStepIntention, setCurrentStepFormDefinition } = usePipelineDataContext()
  const { setStepDrawerOpen } = usePipelineViewContext()

  const [pluginsData, setPluginsData] = useState<TypesPlugin[]>([])

  // TODO: only 100 items
  const { data: pluginsResponse } = useListPluginsQuery({ queryParams: { limit: 100, page: 1 } })

  useEffect(() => {
    // TODO: Do not parse all plugins in advance  - check if its not needed (wrap inside try...catch)
    // TODO: duplicated code
    setPluginsData(pluginsResponse?.map(d => ({ ...d, spec: JSON.parse(d.spec ?? '') })) ?? [])
  }, [pluginsData])

  return (
    <StepsPalette.Root>
      <StepsPalette.Header>
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Deploy to Dev</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="font-thin">/</BreadcrumbSeparator>
            <BreadcrumbPage>
              <BreadcrumbLink>Add Step</BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb> */}

        <StepsPalette.Title>Add Step</StepsPalette.Title>
        {/* TODO leftIcon={<Search />} */}
        <Input placeholder="Search" />
        <StepPaletteFilters />
      </StepsPalette.Header>
      <StepsPaletteContent.Root>
        <StepsPaletteContent.Section>
          <StepsPaletteContent.SectionHeader>Run</StepsPaletteContent.SectionHeader>
          <StepsPaletteContent.SectionItem>
            <StepsPaletteItem.Root
              onClick={() => {
                setCurrentStepFormDefinition({
                  identifier: RUN_STEP_IDENTIFIER,
                  description: RUN_STEP_DESCRIPTION,
                  type: 'step'
                })
                setStepDrawerOpen(StepDrawer.Form)
              }}>
              <StepsPaletteItem.Left>
                <Icon name="harness-plugin" size={36} />
              </StepsPaletteItem.Left>
              <StepsPaletteItem.Right>
                <StepsPaletteItem.Header>
                  <StepsPaletteItem.Title>run</StepsPaletteItem.Title>
                  <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper>
                </StepsPaletteItem.Header>
                <StepsPaletteItem.Description>{RUN_STEP_DESCRIPTION}</StepsPaletteItem.Description>
              </StepsPaletteItem.Right>
            </StepsPaletteItem.Root>
          </StepsPaletteContent.SectionItem>
        </StepsPaletteContent.Section>
        <StepsPaletteContent.Section>
          <StepsPaletteContent.SectionHeader>Plugins</StepsPaletteContent.SectionHeader>
          {pluginsData.map(item => (
            <StepsPaletteContent.SectionItem key={item.identifier}>
              <StepsPaletteItem.Root
                onClick={() => {
                  if (addStepIntention?.path && addStepIntention?.position && item.spec) {
                    setCurrentStepFormDefinition(item)
                    setStepDrawerOpen(StepDrawer.Form)
                  } else {
                    //TODO: TOAST HERE
                  }
                }}>
                <StepsPaletteItem.Left>
                  <Icon name="harness-plugin" size={36} />
                </StepsPaletteItem.Left>
                <StepsPaletteItem.Right>
                  <StepsPaletteItem.Header>
                    <StepsPaletteItem.Title>{item.identifier}</StepsPaletteItem.Title>
                    <StepsPaletteItem.BadgeWrapper>verified</StepsPaletteItem.BadgeWrapper>
                  </StepsPaletteItem.Header>
                  <StepsPaletteItem.Description>{item.description}</StepsPaletteItem.Description>
                </StepsPaletteItem.Right>
              </StepsPaletteItem.Root>
            </StepsPaletteContent.SectionItem>
          ))}
        </StepsPaletteContent.Section>
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
