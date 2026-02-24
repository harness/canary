import { AnyFormValue, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'
import { Button, Layout } from '@harnessio/ui/components'

import inputComponentFactory from '../../implementation/factory/factory'
import { formDefinition } from './form-definition'

function PerformanceExample() {
  const onSubmit = (values: AnyFormValue) => {
    console.log(values)
  }

  const resolver = useZodValidationResolver(formDefinition, {})

  return (
    <div style={{ width: '400px' }}>
      <RootForm onSubmit={onSubmit} resolver={resolver} mode={undefined}>
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

export default PerformanceExample
