import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Alert } from '../alert'
import { Button } from '../button'
import { ButtonLayout } from '../button-layout'
import { Dialog } from '../dialog'
import { FormInput } from '../form-input'
import { FormWrapper } from '../form-primitives'
import { Radio } from '../radio'
import { identifierSchema } from '../../utils/schema'
import { useTranslation } from '../../context/translation-context'

interface SavedFilterError {
  errMessage: string
}

function isSavedFilterError(obj: unknown): obj is SavedFilterError {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'errMessage' in obj &&
    typeof (obj as SavedFilterError).errMessage === 'string'
  )
}

export interface SaveFiltersDialogProps {
  onSubmit?: (data: FormValuesType) => Promise<void> | void
}

const formSchema = z.object({
  identifier: identifierSchema(),
  visibility: z.enum(['EveryOne', 'OnlyCreator'])
})

type FormValuesType = z.infer<typeof formSchema>

export function SaveFiltersDialog({ onSubmit }: SaveFiltersDialogProps) {
  const { t } = useTranslation()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const formMethods = useForm<FormValuesType>({
    resolver: zodResolver(formSchema)
  })

  const { register, handleSubmit, reset } = formMethods

  const onFormSubmit = async (data: FormValuesType) => {
    setIsLoading(true)
    try {
      await onSubmit?.(data)
      setIsOpen(false)
    } catch (error) {
      const errMsg = isSavedFilterError(error) ? error.errMessage : 'Failed to save filters'
      setErrorMsg(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    reset({
      identifier: '',
      visibility: 'OnlyCreator'
    })

    setErrorMsg(null)
  }, [isOpen, reset])

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
      }}
    >
      <Dialog.Trigger>
        <Button size="sm" variant="transparent">
          Save
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{t('component:filter.saveFilter', 'Save Filter')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <FormWrapper id="save-filters" {...formMethods} onSubmit={handleSubmit(onFormSubmit)}>
            <FormInput.Text {...register('identifier')} autoFocus label="Filter Id" />
            <FormInput.Radio {...register('visibility')} label="Visibility">
              <Radio.Item label="Everyone" value="EveryOne" />
              <Radio.Item label="Only Me" value="OnlyCreator" />
            </FormInput.Radio>
          </FormWrapper>
          {errorMsg && (
            <Alert.Root theme="danger">
              <Alert.Title>{errorMsg}</Alert.Title>
            </Alert.Root>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close>Close</Dialog.Close>
            <Button form="save-filters" type="submit" loading={isLoading}>
              Save
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default SaveFiltersDialog
