import { ElementType, Fragment, useEffect, useState } from 'react'

import { Button, ButtonGroup, Drawer, EntityFormLayout, Icon } from '@/components'
import { get } from 'lodash-es'
import { parse } from 'yaml'

import {
  getTransformers,
  inputTransformValues,
  outputTransformValues,
  RenderForm,
  RootForm,
  useZodValidationResolver
} from '@harnessio/forms'

import { useUnifiedPipelineStudioContext } from '../../context/unified-pipeline-studio-context'
import { basicStageFormDefinition } from './form-definition/stage-form-definition'

const componentsMap: Record<
  'true' | 'false',
  {
    Content: ElementType
    Header: ElementType
    Title: ElementType
    Description: ElementType
    Inner: ElementType
    Footer: ElementType
  }
> = {
  true: {
    Content: Fragment,
    Header: Drawer.Header,
    Title: Drawer.Title,
    Description: Drawer.Description,
    Inner: Drawer.Inner,
    Footer: Drawer.Footer
  },
  false: {
    Content: 'div',
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Description: EntityFormLayout.Description,
    Inner: Fragment,
    Footer: EntityFormLayout.Footer
  }
}

interface UnifiedPipelineStudioStageConfigFormProps {
  requestClose: () => void
  isDrawer?: boolean
}

export const UnifiedPipelineStudioStageConfigForm = (props: UnifiedPipelineStudioStageConfigFormProps) => {
  const { requestClose, isDrawer = false } = props
  const { Content, Header, Title, Description, Inner, Footer } = componentsMap[isDrawer ? 'true' : 'false']

  const {
    addStageIntention,
    editStageIntention,
    requestYamlModifications,
    inputComponentFactory,
    yamlRevision,
    stageFormDefinition: stageFormDefinitionFromProps
  } = useUnifiedPipelineStudioContext()

  const stageFormDefinition = stageFormDefinitionFromProps ?? basicStageFormDefinition
  const [defaultStageValues, setDefaultStageValues] = useState<Record<string, any>>()

  useEffect(() => {
    if (editStageIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const step = get(yamlJson, editStageIntention.path)

      const transformers = getTransformers(stageFormDefinition ?? { inputs: [] })
      const stageValue = inputTransformValues(step, transformers)

      setDefaultStageValues(stageValue)
    }
  }, [editStageIntention, yamlRevision])

  const resolver = useZodValidationResolver(stageFormDefinition ?? { inputs: [] })

  return (
    <RootForm
      autoFocusPath={stageFormDefinition?.inputs?.[0]?.path}
      defaultValues={defaultStageValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        const transformers = getTransformers(stageFormDefinition)
        const stageValue = outputTransformValues(values, transformers)

        if (addStageIntention) {
          requestYamlModifications.injectInArray({
            path: addStageIntention.path,
            position: addStageIntention.position,
            item: { ...stageValue, steps: [] }
          })
        } else if (editStageIntention) {
          requestYamlModifications.updateInArray({
            path: editStageIntention.path,
            item: stageValue
          })
        }

        requestClose()
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <Content>
          <Header>
            <Title>{editStageIntention ? 'Edit' : 'Add'} Stage</Title>
            <Description>
              Configure a stage for your pipeline. Stages are logical groupings of steps that execute together.
            </Description>
            <ButtonGroup>
              <Button variant={'ai'}> AI Autofill</Button>
              <Button variant={'outline'}> Use Template</Button>
            </ButtonGroup>
          </Header>
          <Inner>
            <EntityFormLayout.Form>
              <RenderForm className="space-y-6" factory={inputComponentFactory} inputs={stageFormDefinition} />
            </EntityFormLayout.Form>
          </Inner>
          <Footer>
            <ButtonGroup>
              <Button onClick={() => rootForm.submitForm()}>Submit</Button>
              <Button variant="secondary" onClick={requestClose}>
                Cancel
              </Button>
            </ButtonGroup>
            {editStageIntention && (
              <Button
                variant="secondary"
                iconOnly
                onClick={() => {
                  requestYamlModifications.deleteInArray({ path: editStageIntention.path })
                  requestClose()
                }}
              >
                <Icon name="trash" />
              </Button>
            )}
          </Footer>
        </Content>
      )}
    </RootForm>
  )
}
