import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ButtonLayout, ControlGroup, Dialog, FormInput, FormWrapper, Label } from '@/components'
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
  isCreatingBranch = false,
  violation,
  bypassable,
  resetViolation,
  error,
  selectedBranchOrTag,
  renderProp: branchSelectorContainer,
  prefilledName
}: CreateBranchDialogProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(isCreatingBranch)

  const formMethods = useForm<CreateBranchFormFields>({
    resolver: zodResolver(createBranchFormSchema(t)),
    mode: 'onChange',
    defaultValues: INITIAL_FORM_VALUES
  })

  const { register, handleSubmit, setValue, reset, clearErrors, watch } = formMethods

  const resetForm = useCallback(() => {
    clearErrors()
    reset(INITIAL_FORM_VALUES)
  }, [clearErrors, reset])

  const handleFormSubmit = async (data: CreateBranchFormFields) => {
    try {
      await onSubmit(data)
    } catch {
      // Parent handles error display; avoid unhandled promise rejection
    }
  }

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      reset({
        name: prefilledName || '',
        target: selectedBranchOrTag?.name
      })
      resetViolation()
    }
  }, [open, prefilledName, selectedBranchOrTag, reset, resetViolation])

  useEffect(() => {
    if (isCreatingBranch) {
      setIsLoading(isCreatingBranch)
      return
    }

    const t = setTimeout(() => {
      setIsLoading(isCreatingBranch)
    }, 300)

    return () => clearTimeout(t)
  }, [isCreatingBranch])

  useEffect(() => {
    if (selectedBranchOrTag?.name) {
      setValue('target', selectedBranchOrTag.name)
    }
  }, [selectedBranchOrTag, setValue])

  const branchName = watch('name')

  useEffect(() => {
    resetViolation()
  }, [branchName, resetViolation])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content aria-describedby={undefined} className="max-w-2xl">
        <Dialog.Header>
          <Dialog.Title>{t('views:repos.createBranchTitle', 'Create a branch')}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <FormWrapper id="create-branch-form" {...formMethods} onSubmit={handleSubmit(handleFormSubmit)}>
            <FormInput.Text
              id="name"
              label="Branch name"
              {...register('name')}
              maxLength={250}
              placeholder={t('views:forms.enterBranchName', 'Enter branch name')}
              autoFocus
            />

            <ControlGroup>
              <Label htmlFor="target">{t('views:forms.basedOn', 'Based on')}</Label>
              {branchSelectorContainer}
            </ControlGroup>

            {violation && (
              <Alert.Root theme="warning">
                <Alert.Description className="break-all overflow-hidden">
                  {bypassable
                    ? t(
                        'component:branchDialog.violationMessages.bypassed',
                        'Some rules will be bypassed while creating branch'
                      )
                    : t(
                        'component:branchDialog.violationMessages.notAllow',
                        "Some rules don't allow you to create branch"
                      )}
                </Alert.Description>
              </Alert.Root>
            )}

            {error && (
              <Alert.Root theme="danger">
                <Alert.Description className="break-all overflow-hidden">
                  {t('views:repos.error', 'Error:')} {error}
                </Alert.Description>
              </Alert.Root>
            )}
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={handleClose} disabled={isLoading}>
              {t('views:repos.cancel', 'Cancel')}
            </Dialog.Close>
            {!bypassable || !violation ? (
              <Button
                type="submit"
                form="create-branch-form"
                disabled={isLoading || (!bypassable && violation)}
                loading={isLoading}
              >
                {isLoading
                  ? t('component:branchDialog.loading', 'Creating branch...')
                  : !bypassable && violation
                    ? t('component:branchDialog.notAllowed', 'Cannot create branch')
                    : t('component:branchDialog.default', 'Create branch')}
              </Button>
            ) : (
              <Button type="submit" form="create-branch-form" variant="outline" theme="danger">
                {isLoading
                  ? t('component:branchDialog.loading', 'Creating branch...')
                  : t('component:branchDialog.bypassButton', 'Bypass rules and create branch')}
              </Button>
            )}
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
