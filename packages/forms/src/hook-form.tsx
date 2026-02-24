import { useRef } from 'react'
import {
  FieldPath,
  FieldValues,
  useController as useControllerDefault,
  UseControllerProps,
  UseControllerReturn
} from 'react-hook-form'

import { afterFrames } from './utils'

/**
 * !!!
 * Since useController from react-hook-form has an onBlur handler that triggers updates in useForm,
 * it causes child components to re-render.
 * As a result, in places with a focus trap (such as a dialog or a Drawer), the focus is lost.
 *
 * This code solves the issue by deferring the onBlur call to the next frame.
 */
export function useController<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: UseControllerProps<TFieldValues, TName>
): UseControllerReturn<TFieldValues, TName> {
  const {
    field: { onBlur, ...fieldRest },
    ...rest
  } = useControllerDefault(props)

  const mountTimeRef = useRef<number>(Date.now())

  return {
    ...rest,
    field: {
      ...fieldRest,
      onBlur: afterFrames(onBlur, 2, mountTimeRef.current)
    }
  }
}

// Re-export all other functions from react-hook-form
export type { SubmitHandler, SubmitErrorHandler, Mode, DefaultValues, FieldValues } from 'react-hook-form'

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
