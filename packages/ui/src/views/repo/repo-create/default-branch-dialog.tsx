import { FC, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { Button, Dialog, FormInput, IconV2, Layout, Radio, Text } from '@/components'
import { useTranslation } from '@/context'

import { FormFields } from '.'

type DefaultBranchDialogProps = {
  formMethods: UseFormReturn<FormFields>
}

export const DefaultBranchDialog: FC<DefaultBranchDialogProps> = ({ formMethods }) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const { register, watch, setValue } = formMethods
  const branchValue = watch('defaultBranch')
  const customBranchRadio = watch('customBranchRadio')
  const customBranchInput = watch('customBranchInput')

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      handleOpen()
    } else {
      handleClose()
    }
  }

  const handleConfirm = () => {
    const value = (customBranchRadio === 'custom' ? customBranchInput : customBranchRadio) || 'main'
    setValue('defaultBranch', value)
    setValue('customBranchInput', customBranchRadio === 'custom' ? value : '')
    handleClose()
  }

  return (
    <Layout.Horizontal gap="xs" align="center" wrap="wrap">
      <Text wrap="nowrap">
        {t('views:repos.createNewRepo.defaultBranchDialog.startLabel', 'Your repository will be initialized with a')}
      </Text>

      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          <Button variant="outline">
            <IconV2 name="git-branch" />
            {branchValue}
            <IconV2 name="nav-arrow-down" />
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Change branch</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Layout.Vertical gap="xl">
              <FormInput.Radio label="Select branch" id="default-branch-radio" {...register('customBranchRadio')}>
                <Radio.Item id="default-branch-main" value="main" label="main" />
                <Radio.Item id="default-branch-master" value="master" label="master" />
                <Radio.Item id="default-branch-custom" value="custom" label="custom" />
              </FormInput.Radio>

              {customBranchRadio === 'custom' && (
                <FormInput.Text
                  id="default-branch-text"
                  label="Branch name"
                  {...register('customBranchInput')}
                  placeholder="Enter name to initialize default branch"
                  autoFocus
                />
              )}
            </Layout.Vertical>
          </Dialog.Body>

          <Dialog.Footer>
            <Layout.Horizontal gap="sm" justify="end">
              <Dialog.Close>Cancel</Dialog.Close>
              <Button variant="primary" onClick={handleConfirm}>
                Save
              </Button>
            </Layout.Horizontal>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Text wrap="nowrap">{t('views:repos.createNewRepo.defaultBranchDialog.endLabel', 'branch.')}</Text>
    </Layout.Horizontal>
  )
}
