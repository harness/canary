import { useFormContext } from 'react-hook-form'

import { FormCaption } from '@harnessio/ui/components'

export interface InputCommonCaptionProps {
  path: string
  customError?: string
  warning?: string
  helper?: string
}

export const InputCommonCaption = ({ path, customError, warning, helper }: InputCommonCaptionProps) => {
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(path, formState)
  const { error } = fieldState

  if (error?.message || customError) {
    return <FormCaption theme="danger">{error?.message || customError}</FormCaption>
  }

  if (warning) {
    return <FormCaption theme="warning">{warning}</FormCaption>
  }

  if (helper) {
    return <FormCaption>{helper}</FormCaption>
  }

  return null
}

InputCommonCaption.displayName = 'InputCommonCaption'
