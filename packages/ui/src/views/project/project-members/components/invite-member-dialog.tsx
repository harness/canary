import { FC, forwardRef, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ControlGroup,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Fieldset,
  FormWrapper,
  Select,
  SelectContent,
  SelectItem
} from '@/components'
import { InviteMemberDialogProps, InviteMemberFormFields, PrincipalData } from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitials } from '@utils/stringUtils'
import { getRolesData } from '@views/project/project-members/constants'
import { z } from 'zod'

export const inviteMemberFormSchema = z.object({
  member: z.string().min(1, { message: 'Member name is required' }),
  role: z.string().min(1, { message: 'Role is required' })
})

interface PrincipalOptionProps {
  principal: PrincipalData
  isShortView?: boolean
}

const PrincipalOption = forwardRef<HTMLDivElement, PrincipalOptionProps>(({ principal, isShortView = false }, ref) => {
  return (
    <div ref={ref} className={`flex w-full ${isShortView ? 'gap-x-2' : 'gap-x-2.5 pl-1'} cursor-pointer items-center`}>
      <Avatar size={isShortView ? '6' : '8'}>
        {!!principal.avatar_url && <AvatarImage src={principal.avatar_url} alt={principal.display_name} />}
        <AvatarFallback>{getInitials(principal.display_name)}</AvatarFallback>
      </Avatar>
      <span className="flex flex-col overflow-hidden leading-tight">
        <span className={`truncate ${isShortView ? 'text-foreground-1' : 'text-foreground-8'}`}>
          {principal.display_name}
        </span>
        {!isShortView && <span className="truncate text-12 text-foreground-4">{principal.email}</span>}
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
  const [invitedMemberFullModel, setInvitedMemberFullModel] = useState<PrincipalData | null>(null)

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{t('views:projectSettings.newMember', 'New member')}</DialogTitle>
        </DialogHeader>
        <FormWrapper className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <ControlGroup>
              <Select
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
                <SelectContent
                  withSearch
                  searchProps={{
                    placeholder: t('views:repos.search', 'Search'),
                    handleChangeSearchValue: setPrincipalsSearchQuery,
                    searchValue: principalsSearchQuery
                  }}
                >
                  {principals.map(principal => (
                    <SelectItem key={principal.uid} value={principal.uid} isItemTextAsChild>
                      <PrincipalOption principal={principal} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlGroup>
            <ControlGroup>
              <Select
                name="role"
                value={memberRole}
                onValueChange={value => handleSelectChange('role', value)}
                placeholder={t('views:forms.selectRole', 'Select role')}
                label={t('views:projectSettings.role', 'Role')}
                error={errors.role?.message?.toString()}
                selectValueChildren={
                  !!selectedRoleFullModel && <span className="text-foreground-1">{selectedRoleFullModel.label}</span>
                }
              >
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.uid} value={option.uid} isItemTextAsChild>
                      <div className="flex cursor-pointer flex-col gap-y-1.5">
                        <span className="leading-none text-foreground-8">{option.label}</span>
                        <span className="leading-tight text-foreground-4">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} loading={isInvitingMember}>
            {t('views:repos.cancel', 'Cancel')}
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isInvitingMember || !isValid}>
            {t('views:projectSettings.addMember', 'Add member to this project')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
