import {
  IFormDefinition,
  InputFactory,
  RenderForm,
  RootForm,
  RootFormProps,
  useZodValidationResolver
} from '@harnessio/forms'

export interface VisualViewProps {
  formDefinition: IFormDefinition
  formValues: RootFormProps['defaultValues']
  onFormValuesChange: RootFormProps['onValuesChange']
  onFormValidationChange: RootFormProps['onValidationChange']
  inputComponentFactory: InputFactory
  onFormSubmit: RootFormProps['onSubmit']
  rootFormRef: React.MutableRefObject<
    | {
        submitForm: () => void
      }
    | undefined
  >
}

export default function VisualView(props: VisualViewProps) {
  const {
    formDefinition,
    formValues,
    onFormValuesChange,
    inputComponentFactory,
    rootFormRef,
    onFormSubmit,
    onFormValidationChange
  } = props

  const resolver = useZodValidationResolver(formDefinition)

  return (
    <RootForm
      defaultValues={formValues}
      onValuesChange={onFormValuesChange}
      onValidationChange={onFormValidationChange}
      onSubmit={onFormSubmit}
      resolver={resolver}
      mode="onSubmit"
    >
      {rootForm => {
        if (rootFormRef) {
          rootFormRef.current = rootForm
        }

        return <RenderForm className="space-y-5 p-5" factory={inputComponentFactory} inputs={formDefinition} />
      }}
    </RootForm>
  )
}
