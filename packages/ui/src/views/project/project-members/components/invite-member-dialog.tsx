import { FC, forwardRef, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, Avatar, Button, ControlGroup, Dialog, Fieldset, FormWrapper, Select } from '@/components'
import { PrincipalType } from '@/types'
import { InviteMemberDialogProps, InviteMemberFormFields } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitials } from '@utils/stringUtils'
import { getRolesData } from '@views/project/project-members/constants'
import { z } from 'zod'

export const inviteMemberFormSchema = z.object({
  member: z.string().min(1, { message: 'Member name is required' }),
  role: z.string().min(1, { message: 'Role is required' })
})

interface PrincipalOptionProps {
  principal: PrincipalType
  isShortView?: boolean
}

const PrincipalOption = forwardRef<HTMLDivElement, PrincipalOptionProps>(({ principal, isShortView = false }, ref) => {
  return (
    <div ref={ref} className={`flex w-full ${isShortView ? 'gap-x-2' : 'gap-x-2.5 pl-1'} cursor-pointer items-center`}>
      <Avatar.Root size={isShortView ? '6' : '8'}>
        {!!principal.avatar_url && <Avatar.Image src={principal.avatar_url} alt={principal.display_name} />}
        <Avatar.Fallback>{getInitials(principal.display_name)}</Avatar.Fallback>
      </Avatar.Root>
      <span className="flex flex-col overflow-hidden leading-tight">
        <span className={`truncate ${isShortView ? 'text-cn-foreground-1' : 'text-cn-foreground-1'}`}>
          {principal.display_name}
        </span>
        {!isShortView && <span className="truncate text-1 text-cn-foreground-2">{principal.email}</span>}
      </span>
    </div>
  )
})

PrincipalOption.displayName = 'PrincipalOption'

export const InviteMemberDialog: FC<InviteMemberDialogProps> = ({
  open,
  onClose,
  onSubmit,
  useTranslationStore,
  isInvitingMember,
  principals,
  error,
  setPrincipalsSearchQuery,
  principalsSearchQuery
}) => {
  const { t } = useTranslationStore()
  /**
   * Since the select component works only with strings,
   * we need to construct the full data model based on the selected item.
   */
  const [invitedMemberFullModel, setInvitedMemberFullModel] = useState<PrincipalType | null>(null)

  const roleOptions = useMemo(() => getRolesData(t), [t])

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<InviteMemberFormFields>({
    resolver: zodResolver(inviteMemberFormSchema),
    mode: 'onChange',
    defaultValues: {
      member: '',
      role: roleOptions[3].uid
    }
  })

  const invitedMember = watch('member')
  const memberRole = watch('role')

  const handleSelectChange = (fieldName: keyof InviteMemberFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  const handleMemberChange = (value: string) => {
    const data = principals.find(principal => principal.uid === value)
    if (!data) return

    setInvitedMemberFullModel(data)
    setValue('member' as keyof InviteMemberFormFields, value, { shouldValidate: true })
  }

  const selectedRoleFullModel = useMemo(() => {
    return roleOptions.find(it => it.uid === memberRole)
  }, [roleOptions, memberRole])

  /**
   * Reset form data and state on dialog close
   */
  useEffect(() => {
    if (!open) {
      reset()
      setInvitedMemberFullModel(null)
    }
  }, [open, reset])

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-[420px]">
        <Dialog.Header>
          <Dialog.Title>{t('views:projectSettings.newMember', 'New member')}</Dialog.Title>
        </Dialog.Header>
        <FormWrapper className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <ControlGroup>
              <Select.Root
                name="member"
                value={invitedMember}
                onValueChange={handleMemberChange}
                placeholder={t('views:forms.selectMember', 'Select member')}
                label={t('views:projectSettings.member', 'Member')}
                error={errors.member?.message?.toString()}
                selectValueChildren={
                  !!invitedMemberFullModel && <PrincipalOption isShortView principal={invitedMemberFullModel} />
                }
              >
                <Select.Content
                  withSearch
                  searchProps={{
                    placeholder: t('views:repos.search', 'Search'),
                    handleChangeSearchValue: setPrincipalsSearchQuery,
                    searchValue: principalsSearchQuery
                  }}
                >
                  {principals.map(principal => (
                    <Select.Item key={principal.uid} value={principal.uid} isItemTextAsChild>
                      <PrincipalOption principal={principal} />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
            <ControlGroup>
              <Select.Root
                name="role"
                value={memberRole}
                onValueChange={value => handleSelectChange('role', value)}
                placeholder={t('views:forms.selectRole', 'Select role')}
                label={t('views:projectSettings.role', 'Role')}
                error={errors.role?.message?.toString()}
                selectValueChildren={
                  !!selectedRoleFullModel && <span className="text-cn-foreground-1">{selectedRoleFullModel.label}</span>
                }
              >
                <Select.Content>
                  {roleOptions.map(option => (
                    <Select.Item key={option.uid} value={option.uid} isItemTextAsChild>
                      <div className="flex cursor-pointer flex-col gap-y-1.5">
                        <span className="leading-none text-cn-foreground-1">{option.label}</span>
                        <span className="leading-tight text-cn-foreground-2">{option.description}</span>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </ControlGroup>
          </Fieldset>

          {!!error && (
            <Alert.Container className="!mt-0" variant="destructive">
              <Alert.Title>
                {t('views:repos.error', 'Error:')} {error}
              </Alert.Title>
            </Alert.Container>
          )}
        </FormWrapper>

        <Dialog.Footer>
          <Button type="button" variant="surface" theme="muted" onClick={onClose} loading={isInvitingMember}>
            {t('views:repos.cancel', 'Cancel')}
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isInvitingMember || !isValid}>
            {t('views:projectSettings.addMember', 'Add member to this project')}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
