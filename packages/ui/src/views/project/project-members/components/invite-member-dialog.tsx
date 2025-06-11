import { FC, useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Button, ButtonLayout, Dialog, DropdownMenu, FormWrapper, Select, SelectValueOption } from '@/components'
import { useTranslation } from '@/context'
import { PrincipalType } from '@/types'
import { InviteMemberDialogProps, InviteMemberFormFields } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRolesData } from '@views/project/project-members/constants'
import { z } from 'zod'

export const inviteMemberFormSchema = z.object({
  member: z.string().min(1, { message: 'Member name is required' }),
  role: z.string().min(1, { message: 'Role is required' })
})

export const InviteMemberDialog: FC<InviteMemberDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isInvitingMember,
  principals,
  error,
  setPrincipalsSearchQuery,
  principalsSearchQuery
}) => {
  const { t } = useTranslation()

  const roleOptions = useMemo(() => getRolesData(t).map(option => ({ label: option.label, value: option.uid })), [t])

  const formMethods = useForm<InviteMemberFormFields>({
    resolver: zodResolver(inviteMemberFormSchema),
    mode: 'onChange',
    defaultValues: {
      member: '',
      role: roleOptions[3].value
    }
  })

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = formMethods

  const invitedMember = watch('member')
  const memberRole = watch('role')

  const principalDataToIdMap = useMemo(
    () =>
      principals.reduce(
        (acc, principal) => ({ ...acc, [principal.uid]: principal }),
        {} as Record<string, PrincipalType>
      ),
    [principals]
  )
  const memberOptions: SelectValueOption[] = useMemo(
    () => principals.map(principal => ({ label: principal.display_name, value: principal.uid })),
    [principals]
  )

  const handleSelectChange = (fieldName: keyof InviteMemberFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleMemberChange = (value: string) => {
    const data = principals.find(principal => principal.uid === value)
    if (!data) return

    setValue('member' as keyof InviteMemberFormFields, value, { shouldValidate: true })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{t('views:projectSettings.newMember', 'New member')}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
            <Select
              options={memberOptions}
              value={invitedMember}
              placeholder={t('views:forms.selectMember', 'Select member')}
              label={t('views:projectSettings.member', 'Member')}
              error={errors.member?.message?.toString()}
              onSearch={setPrincipalsSearchQuery}
              searchValue={principalsSearchQuery}
              optionRenderer={option => (
                <DropdownMenu.AvatarItem
                  title={option.label}
                  onSelect={() => handleMemberChange(option.value)}
                  name={principalDataToIdMap[option.value].display_name}
                  description={principalDataToIdMap[option.value].email}
                  src={principalDataToIdMap[option.value].avatar_url}
                />
              )}
              allowSearch
            />

            <Select
              options={roleOptions}
              value={memberRole}
              placeholder={t('views:forms.selectRole', 'Select role')}
              label={t('views:projectSettings.role', 'Role')}
              error={errors.role?.message?.toString()}
              optionRenderer={option => (
                <DropdownMenu.Item
                  title={option.label}
                  onSelect={() => handleSelectChange('role', option.value)}
                  description={getRolesData(t).find(role => role.uid === option.value)?.description}
                />
              )}
            />

            {!!error && (
              <Alert.Root theme="danger" className="!mt-0">
                <Alert.Title>
                  {t('views:repos.error', 'Error:')} {error}
                </Alert.Title>
              </Alert.Root>
            )}
          </FormWrapper>
        </Dialog.Body>

        <Dialog.Footer>
          <ButtonLayout>
            <Dialog.Close onClick={onClose} loading={isInvitingMember}>
              {t('views:repos.cancel', 'Cancel')}
            </Dialog.Close>
            <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isInvitingMember || !isValid}>
              {t('views:projectSettings.addMember', 'Add member to this project')}
            </Button>
          </ButtonLayout>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
