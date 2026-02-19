import {
  AnyFormValue,
  getTransformers,
  outputTransformValues,
  RenderForm,
  RootForm,
  unsetHiddenInputsValues
} from '@harnessio/forms'
import { Button, Layout } from '@harnessio/ui/components'

import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function ConditionalExample() {
  const onSubmit = (values: AnyFormValue) => {
    const transformers = getTransformers(formDefinition)
    const values2 = outputTransformValues(values, transformers)
    const values3 = unsetHiddenInputsValues(formDefinition, values2)

    console.log(values3)
  }

  return (
    <div style={{ width: '400px' }}>
      <RootForm onSubmit={onSubmit} resolver={undefined} mode={undefined}>
        {rootForm => (
          <Layout.Vertical gap="lg">
            <RenderForm factory={inputComponentFactory} inputs={formDefinition} className="space-y-cn-md" />
            <Button onClick={() => rootForm.submitForm()} className="self-start">
              Submit
            </Button>
          </Layout.Vertical>
        )}
      </RootForm>
    </div>
  )
}

export default ConditionalExample
