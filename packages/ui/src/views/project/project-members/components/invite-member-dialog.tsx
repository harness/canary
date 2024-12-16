import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  ButtonGroup,
  ControlGroup,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Fieldset,
  FormWrapper,
  Select,
  SelectContent,
  SelectItem,
  Spacer
} from '@/components'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { InviteMemberDialogProps, InviteMemberFormFields } from '../types'

export const inviteMemberFormSchema = z.object({
  member: z.string().min(1, { message: 'Member name is required' }),
  role: z.string().min(1, { message: 'Role is required' })
})

export function InviteMemberDialog({
  open,
  onClose,
  onSubmit,
  useTranslationStore,
  isInvitingMember,
  principals,
  error
}: InviteMemberDialogProps) {
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<InviteMemberFormFields>({
    resolver: zodResolver(inviteMemberFormSchema),
    mode: 'onChange',
    defaultValues: {
      member: '',
      role: ''
    }
  })

  const invitedMember = watch('member')

  const memberRole = watch('role')

  const handleSelectChange = (fieldName: keyof InviteMemberFormFields, value: string) => {
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] border-border bg-background-1">
        <DialogHeader>
          <DialogTitle>{t('views:projectSettings.newMember')}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Spacer size={6} />
          <FormWrapper className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Fieldset>
              <ControlGroup>
                <Select
                  {...register('member')}
                  name="member"
                  value={invitedMember}
                  onValueChange={value => handleSelectChange('member', value)}
                  placeholder={t('views:forms.selectMember')}
                  label={t('views:projectSettings.member')}
                  error={
                    errors.member?.message
                      ? t('views:forms.selectMemberError', errors.member?.message?.toString())
                      : undefined
                  }
                  disabled={!principals?.length}
                >
                  <SelectContent>
                    {principals
                      ?.filter(item => item?.display_name)
                      ?.map(({ display_name, uid }) => (
                        <SelectItem key={uid} value={uid}>
                          {display_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </ControlGroup>
              <ControlGroup>
                <Select
                  {...register('role')}
                  name="role"
                  value={memberRole}
                  onValueChange={value => handleSelectChange('role', value)}
                  placeholder={t('views:forms.selectRole')}
                  label={t('views:projectSettings.role')}
                  error={
                    errors.role?.message
                      ? t('views:forms.selectRoleError', errors.role?.message?.toString())
                      : undefined
                  }
                >
                  <SelectContent>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="reader">Reader</SelectItem>
                    <SelectItem value="executor">Executor</SelectItem>
                    <SelectItem value="space_owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </ControlGroup>
            </Fieldset>
            {error ? (
              <Alert.Container variant="destructive">
                <Alert.Title>
                  {t('views:repos.error', 'Error:')} {error}
                </Alert.Title>
              </Alert.Container>
            ) : null}
            <ButtonGroup className="flex justify-end">
              <Button onClick={onClose} className="text-primary" variant="outline" loading={isInvitingMember}>
                {t('views:repos.cancel', 'Cancel')}
              </Button>
              <Button type="submit">{t('views:projectSettings.addMember')}</Button>
            </ButtonGroup>
          </FormWrapper>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
