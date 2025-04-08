import { IFormDefinition, InputFactory, RenderForm, RootForm, useZodValidationResolver } from '@harnessio/forms'

export interface VisualViewProps {
  formDefinition: IFormDefinition
  formValues: any | undefined
  onFormValuesChange: (yamlRevision: any) => void
  inputComponentFactory: InputFactory
}

export default function VisualView(props: VisualViewProps) {
  const { formDefinition, formValues, onFormValuesChange, inputComponentFactory } = props

  const resolver = useZodValidationResolver(formDefinition)

  return (
    <RootForm
      defaultValues={formValues}
      onValuesChange={values => {
        onFormValuesChange(values)
      }}
      onSubmit={values => {
        console.log(values)
      }}
      resolver={resolver}
      mode="onChange"
    >
      <RenderForm className="space-y-4" factory={inputComponentFactory} inputs={formDefinition} />
    </RootForm>
  )
}
