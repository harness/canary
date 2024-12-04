import { ReactElement, useEffect, useRef, type Attributes } from 'react'
import {
  DeepPartial,
  DefaultValues,
  FieldValues,
  FormProvider,
  Path,
  Resolver,
  useForm,
  UseFormReturn
} from 'react-hook-form'

interface RootFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any> {
  defaultValues?: DefaultValues<TFieldValues>
  resolver: Resolver<TFieldValues, TContext> | undefined
  onValuesChange?: (values: DeepPartial<TFieldValues>, formState: { isValid?: boolean }) => void
  onSubmit?: (values: FieldValues) => void
  shouldFocusError?: boolean
  mode: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all' | undefined
  children:
    | JSX.Element
    | ((props: UseFormReturn<TFieldValues, any, undefined> & { submitForm: () => void }) => JSX.Element)
  validateAfterFirstSubmit?: boolean
  /**
   * This is passed to input handlers
   *
   * For visible function second argument is metadata.
   *
   * ```isVisible?: (values: AnyFormikValue, metadata: any) => boolean```
   */
  metadata?: any

  /**
   * Provide fixed value that are required for defined inputs
   */
  fixedValues?: { [path: string]: any }
  /**
   * Prefix to target nested structure
   */
  prefix?: string
  key?: Attributes['key']
  /**
   * auto focus input
   */
  autoFocusPath?: Path<TFieldValues>
}

export function RootForm<TFieldValues extends FieldValues = FieldValues, TContext = any>(
  props: RootFormProps<TFieldValues, TContext>
): ReactElement {
  const {
    mode = 'onSubmit',
    resolver,
    defaultValues,
    shouldFocusError,
    // validateAfterFirstSubmit,
    onValuesChange,
    onSubmit,
    // validate,
    // validateDebounceInterval,
    // validationConfig,
    // metadata,
    children,
    // fixedValues
    autoFocusPath
  } = props

  const methods = useForm<TFieldValues>({
    mode: mode ?? 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues,
    shouldFocusError,
    resolver
  })

  const submittedRef = useRef(false)

  useEffect(() => {
    methods.reset(defaultValues)
  }, [methods.reset, defaultValues])

  const { getValues, handleSubmit } = methods
  const values = getValues()

  // trigger validation on value change
  useEffect(() => {
    onValuesChange?.({ ...(values as any) }, { isValid: methods.formState.isValid })

    if (submittedRef.current === true) {
      methods.trigger()
    }
  }, [JSON.stringify(values)])

  // auto focus
  useEffect(() => {
    if (autoFocusPath) {
      if ('requestIdleCallback' in window) {
        const handle = requestIdleCallback(() => {
          methods.setFocus(autoFocusPath)
        })
        return () => cancelIdleCallback(handle)
      }
      // fallback for safari
      else {
        const handle = setTimeout(() => {
          methods.setFocus(autoFocusPath)
        }, 100)
        return () => clearTimeout(handle)
      }
    }
  }, [methods])

  return (
    <FormProvider {...methods}>
      {typeof children === 'function'
        ? children({
            ...methods,
            submitForm: async () => {
              if (onSubmit) {
                submittedRef.current = true
                handleSubmit(values => {
                  onSubmit(values)
                })()
              }
            }
          })
        : children}
    </FormProvider>
  )
}
