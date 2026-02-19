import { AnyFormValue, RenderForm, RootForm } from '@harnessio/forms'
import { Button, Layout } from '@harnessio/ui/components'

import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function InputsExample() {
  const onSubmit = (values: AnyFormValue) => {
    console.log(values)
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

export default InputsExample
