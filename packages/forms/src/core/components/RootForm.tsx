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

import { RootFormProvider } from '../context/RootFormContext'
import { cancelIdleCallbackPolyfill, requestIdleCallbackPolyfill } from '../utils/request-idle-callback'

export interface RootFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any, TMetadata = any> {
  /**
   * Default values for the form (UNCONTROLLED COMPONENT).
   * These values are only used on initial mount.
   * Changing this prop will NOT update the form values.
   *
   * To update form values after mount:
   * - Use form.setValue() for programmatic updates (preserves form state)
   * - Change the `key` prop to remount with new defaultValues (resets form state)
   */
  defaultValues?: DefaultValues<TFieldValues>
  resolver: Resolver<TFieldValues, TContext> | undefined
  onValuesChange?: (values: DeepPartial<TFieldValues>) => void
  onValidationChange?: (props: { isValid: boolean; isSubmitted: boolean }) => void
  onSubmit?: (values: FieldValues) => void
  onInputRenderError?: (error: Error) => void
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
   * ```isVisible?: (values: AnyFormValue, metadata: any) => boolean```
   */
  metadata?: TMetadata

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
  /**
   * Make form readonly
   */
  readonly?: boolean
}

export function RootForm<TFieldValues extends FieldValues = FieldValues, TContext = any, TMetadata = any>(
  props: RootFormProps<TFieldValues, TContext, TMetadata>
): ReactElement {
  const {
    mode = 'onSubmit',
    resolver,
    defaultValues,
    shouldFocusError,
    // validateAfterFirstSubmit,
    onValuesChange,
    onValidationChange,
    onSubmit,
    onInputRenderError,
    // validate,
    // validateDebounceInterval,
    // validationConfig,
    metadata,
    children,
    // fixedValues
    autoFocusPath,
    readonly
  } = props

  const methods = useForm<TFieldValues>({
    mode,
    reValidateMode: 'onChange',
    defaultValues,
    shouldFocusError,
    resolver
  })

  const submittedRef = useRef(false)
  // Track the serialized defaultValues to detect reset-originated watch callbacks
  const serializedDefaultValuesRef = useRef<string>(JSON.stringify(defaultValues ?? {}))

  useEffect(() => {
    // Update the tracked defaultValues and reset the form
    // This prevents infinite loops when onValuesChange updates state that feeds back into defaultValues
    serializedDefaultValuesRef.current = JSON.stringify(defaultValues ?? {})
    methods.reset(defaultValues, {})
  }, [methods.reset, defaultValues])

  // reset defaultValues to prevent default on recreated (deleted then created) array/list items
  useEffect(() => {
    const requestIdleCallback = requestIdleCallbackPolyfill()
    const cancelIdleCallback = cancelIdleCallbackPolyfill()

    const handle = requestIdleCallback(() => {
      methods.reset({} as TFieldValues, {
        keepErrors: true,
        keepDirty: true,
        keepDirtyValues: true,
        keepValues: true,
        keepDefaultValues: false, // RESET default values
        keepIsSubmitted: true,
        keepTouched: true,
        keepIsValid: true,
        keepSubmitCount: true
      })
    })
    return () => cancelIdleCallback(handle)
  }, [])

  const { handleSubmit } = methods

  // Store onValuesChange in ref to avoid recreating subscription
  const onValuesChangeRef = useRef(onValuesChange)
  useEffect(() => {
    onValuesChangeRef.current = onValuesChange
  }, [onValuesChange])

  // Store onValidationChange in ref to avoid recreating subscription
  const onValidationChangeRef = useRef(onValidationChange)
  useEffect(() => {
    onValidationChangeRef.current = onValidationChange
  }, [onValidationChange])

  const isValidatingRef = useRef(false)

  useEffect(() => {
    const subscription = methods.watch(values => {
      // Skip if we're currently validating to prevent infinite loop
      if (isValidatingRef.current) {
        return
      }

      // Skip if values equal defaultValues (prevents infinite loop when
      // onValuesChange updates state that feeds back into defaultValues)
      if (JSON.stringify(values ?? {}) === serializedDefaultValuesRef.current) {
        return
      }

      onValuesChangeRef.current?.({ ...(values as any) })

      // NOTE: required for validating dependent fields
      if (submittedRef.current === true) {
        // trigger validation on value change
        isValidatingRef.current = true
        methods.trigger().finally(() => {
          isValidatingRef.current = false
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [methods])

  const skipInitialValidationChangeRef = useRef(true)
  useEffect(() => {
    if (skipInitialValidationChangeRef.current) {
      skipInitialValidationChangeRef.current = false
      return
    }

    onValidationChangeRef.current?.({ isValid: methods.formState.isValid, isSubmitted: methods.formState.isSubmitted })
  }, [methods.formState.isValid, methods.formState.isSubmitted])

  // auto focus
  useEffect(() => {
    if (autoFocusPath) {
      const requestIdleCallback = requestIdleCallbackPolyfill()
      const cancelIdleCallback = cancelIdleCallbackPolyfill()

      const handle = requestIdleCallback(() => {
        methods.setFocus(autoFocusPath)
      })
      return () => cancelIdleCallback(handle)
    }
  }, [methods, autoFocusPath])

  return (
    <RootFormProvider metadata={metadata} readonly={readonly} inputErrorHandler={onInputRenderError}>
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
    </RootFormProvider>
  )
}
