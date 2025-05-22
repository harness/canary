import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ControlGroup, Fieldset, FormInput, FormWrapper, Label, ModalDialog } from '@/components'
import { TFunctionWithFallback, useTranslation } from '@/context'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { CreateBranchDialogProps, CreateBranchFormFields } from '../types'

export const createBranchFormSchema = (t: TFunctionWithFallback) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('views:repos.createBranchDialog.validation.name', 'Branch name is required') })
      .refine(data => !data.includes(' '), {
        message: t('views:repos.createBranchDialog.validation.noSpaces', 'Name cannot contain spaces')
      }),
    target: z
      .string()
      .min(1, { message: t('views:repos.createBranchDialog.validation.target', 'Base branch is required') })
  })

const INITIAL_FORM_VALUES: CreateBranchFormFields = {
  name: '',
  target: ''
}

export function CreateBranchDialog({
  open,
  onClose,
  onSubmit,
  isCreatingBranch,
  error,
  selectedBranchOrTag,
  renderProp: branchSelectorContainer,
  prefilledName
}: CreateBranchDialogProps) {
  const { t } = useTranslation()

  const formMethods = useForm<CreateBranchFormFields>({
    resolver: zodResolver(createBranchFormSchema(t)),
    mode: 'onChange',
    defaultValues: INITIAL_FORM_VALUES
  })

  const { register, handleSubmit, setValue, reset, clearErrors } = formMethods

  const resetForm = useCallback(() => {
    clearErrors()
    reset(INITIAL_FORM_VALUES)
  }, [clearErrors, reset])

  const handleFormSubmit = async (data: CreateBranchFormFields) => {
    await onSubmit(data)

    if (!error && !isCreatingBranch) {
      handleClose()
    }
  }

  useEffect(() => {
    reset({
      name: prefilledName || '',
      target: selectedBranchOrTag?.name
    })
  }, [open, prefilledName, reset])

  useEffect(() => {
    if (selectedBranchOrTag?.name) {
      setValue('target', selectedBranchOrTag.name)
    }
  }, [selectedBranchOrTag, setValue])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <ModalDialog.Root open={open} onOpenChange={handleClose}>
      <ModalDialog.Content
        className="max-w-[460px] border-cn-borders-2 bg-cn-background-1"
        aria-describedby={undefined}
      >
        <ModalDialog.Header>
          <ModalDialog.Title>{t('views:repos.createBranchTitle', 'Create a branch')}</ModalDialog.Title>
        </ModalDialog.Header>
        <FormWrapper {...formMethods} onSubmit={handleSubmit(handleFormSubmit)} className="block">
          <ModalDialog.Body>
            <div className="space-y-7 mb-7">
              <Fieldset>
                <FormInput.Text
                  id="name"
                  label="Branch name"
                  {...register('name')}
                  maxLength={250}
                  placeholder={t('views:forms.enterBranchName', 'Enter branch name')}
                />
              </Fieldset>

              <Fieldset>
                <ControlGroup>
                  <Label htmlFor="target">{t('views:forms.basedOn', 'Based on')}</Label>
                  {branchSelectorContainer}
                </ControlGroup>
              </Fieldset>

              {error ? (
                <Alert.Root theme="danger">
                  <Alert.Title>
                    {t('views:repos.error', 'Error:')} {error}
                  </Alert.Title>
                </Alert.Root>
              ) : null}
            </div>
          </ModalDialog.Body>

          <ModalDialog.Footer>
            <ModalDialog.Close onClick={handleClose} loading={isCreatingBranch} disabled={isCreatingBranch}>
              {t('views:repos.cancel', 'Cancel')}
            </ModalDialog.Close>
            <Button type="submit" disabled={isCreatingBranch}>
              {t('views:repos.createBranchButton', 'Create branch')}
            </Button>
          </ModalDialog.Footer>
        </FormWrapper>
      </ModalDialog.Content>
    </ModalDialog.Root>
  )
}
