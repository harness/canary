import {
  FieldPath,
  FieldValues,
  useController as useControllerDefault,
  UseControllerProps,
  UseControllerReturn
} from 'react-hook-form'

/**
 * !!!
 * Since useController from react-hook-form has an onBlur handler that triggers updates in useForm,
 * it causes child components to re-render.
 * As a result, in places with a focus trap (such as a dialog or a Drawer), the focus is lost.
 *
 * This code solves the issue by deferring the onBlur call to the next frame.
 *
 * PERFORMANCE OPTIMIZATION:
 * We only defer onBlur when we detect potential focus trap scenarios.
 * For normal forms, we use direct onBlur for maximum performance.
 */
export function useController<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: UseControllerProps<TFieldValues, TName>
): UseControllerReturn<TFieldValues, TName> {
  const {
    field: { onBlur, ...fieldRest },
    ...rest
  } = useControllerDefault(props)

  // Smart onBlur: optimized for Vaul Drawer focus management
  const handleBlur = (_event?: React.FocusEvent) => {
    // All forms are in drawers, so we always defer to preserve TAB navigation
    // But we use a single frame instead of 2 for better performance
    requestAnimationFrame(() => onBlur())
  }

  return {
    ...rest,
    field: {
      ...fieldRest,
      onBlur: handleBlur
    }
  }
}

// Re-export all other functions from react-hook-form
export type {
  SubmitHandler,
  SubmitErrorHandler,
  Mode,
  DefaultValues,
  FieldValues as RHFFieldValues
} from 'react-hook-form'

export {
  useForm,
  Controller,
  FormProvider,
  Form,
  useWatch,
  useFormState,
  get,
  set,
  useFieldArray,
  useFormContext
} from 'react-hook-form'
