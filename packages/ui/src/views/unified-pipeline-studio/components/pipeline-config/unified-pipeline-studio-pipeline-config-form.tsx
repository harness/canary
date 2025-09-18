import { ElementType, Fragment, useEffect, useState } from 'react'

import { Button, ButtonLayout, Drawer, EntityFormLayout } from '@/components'
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
import { basicPipelineFormDefinition } from './form-definition/pipeline-form-definition'

const componentsMap: Record<
  'true' | 'false',
  {
    Content: ElementType
    Header: ElementType
    Title: ElementType
    Description: ElementType
    Body: ElementType
    Footer: ElementType
  }
> = {
  true: {
    Content: Fragment,
    Header: Drawer.Header,
    Title: Drawer.Title,
    Description: Drawer.Description,
    Body: Drawer.Body,
    Footer: Drawer.Footer
  },
  false: {
    Content: 'div',
    Header: EntityFormLayout.Header,
    Title: EntityFormLayout.Title,
    Description: EntityFormLayout.Description,
    Body: EntityFormLayout.Form,
    Footer: EntityFormLayout.Footer
  }
}

interface UnifiedPipelineStudioPipelineConfigFormProps {
  requestClose: () => void
  isDrawer?: boolean
}

export const UnifiedPipelineStudioPipelineConfigForm = (props: UnifiedPipelineStudioPipelineConfigFormProps) => {
  const { requestClose, isDrawer = false } = props
  const { Content, Header, Title, Description, Body, Footer } = componentsMap[isDrawer ? 'true' : 'false']

  const {
    editPipelineIntention,
    requestYamlModifications,
    inputComponentFactory,
    yamlRevision,
    pipelineFormDefinition: pipelineFormDefinitionFromProps
  } = useUnifiedPipelineStudioContext()

  const pipelineFormDefinition = pipelineFormDefinitionFromProps ?? basicPipelineFormDefinition
  const [defaultPipelineValues, setDefaultPipelineValues] = useState<Record<string, any>>()

  useEffect(() => {
    if (editPipelineIntention) {
      const yamlJson = parse(yamlRevision.yaml)
      const pipeline = get(yamlJson, editPipelineIntention.path)

      const transformers = getTransformers(pipelineFormDefinition ?? { inputs: [] })
      const pipelineValue = inputTransformValues(pipeline, transformers)

      setDefaultPipelineValues(pipelineValue)
    }
  }, [editPipelineIntention, yamlRevision])

  const resolver = useZodValidationResolver(pipelineFormDefinition ?? { inputs: [] })

  return (
    <RootForm
      autoFocusPath={pipelineFormDefinition?.inputs?.[0]?.path}
      defaultValues={defaultPipelineValues}
      resolver={resolver}
      mode="onSubmit"
      onSubmit={values => {
        const transformers = getTransformers(pipelineFormDefinition)
        const pipelineValue = outputTransformValues(values, transformers)

        if (editPipelineIntention) {
          requestYamlModifications.updateInArray({
            path: editPipelineIntention.path,
            item: pipelineValue
          })
        }

        requestClose()
      }}
      validateAfterFirstSubmit={true}
    >
      {rootForm => (
        <Content>
          <Header>
            <Title>Edit Pipeline</Title>
            <Description>Configure a pipeline.</Description>
            {/* <ButtonLayout.Root>
              <Button variant={'ai'}>AI Autofill</Button>
              <Button variant={'outline'}>Use Template</Button>
            </ButtonLayout.Root> */}
          </Header>
          <Body>
            <RenderForm className="space-y-cn-xl" factory={inputComponentFactory} inputs={pipelineFormDefinition} />
          </Body>
          <Footer>
            <ButtonLayout.Root>
              <Button onClick={() => rootForm.submitForm()}>Submit</Button>
              <Button variant="secondary" onClick={requestClose}>
                Cancel
              </Button>
            </ButtonLayout.Root>
          </Footer>
        </Content>
      )}
    </RootForm>
  )
}
