import { ComponentProps, ComponentType, forwardRef, ForwardRefExoticComponent, useContext } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { FormWrapperContext } from '@/components'

type ControllerProps = ComponentProps<typeof Controller>
type ControllerRenderPropsParamsType = Parameters<NonNullable<ControllerProps['render']>>[0]
export type WithFormProps = {
  name: string
  error?: string
}

export function withForm<T>(
  FormPrimitiveComponent: ComponentType<T> | ForwardRefExoticComponent<T>,
  overridingProps: (
    props: ControllerRenderPropsParamsType
  ) => Partial<ComponentProps<typeof FormPrimitiveComponent>> = () => ({})
) {
  const WithForm = forwardRef<ComponentType<typeof FormPrimitiveComponent>, T & WithFormProps>((props, ref) => {
    const formContext = useFormContext()
    const { orientation } = useContext(FormWrapperContext)

    if (!formContext) {
      throw new Error(
        `Form-${FormPrimitiveComponent.displayName} must be used within a FormProvider context through FormWrapper. Use the standalone ${FormPrimitiveComponent.displayName} component if form integration is not required.`
      )
    }

    return (
      <Controller
        name={props.name}
        control={formContext.control}
        render={({ field, fieldState, formState }) => (
          <FormPrimitiveComponent
            orientation={orientation}
            {...props}
            {...field}
            error={fieldState.error?.message || props.error}
            ref={ref}
            {...overridingProps({ field, fieldState, formState })}
          />
        )}
      />
    )
  })

  WithForm.displayName = `withForm(${FormPrimitiveComponent.displayName})`
  return WithForm
}
