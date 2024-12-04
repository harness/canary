import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spacer,
  Text
} from '@harnessio/canary'
import { EnumMembershipRole, useListPrincipalsQuery, useMembershipAddMutation } from '@harnessio/code-service-client'
import { FormFieldSet, SandboxLayout } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

// Define form schema for new member
const newMemberSchema = z.object({
  memberName: z.string().min(1, { message: 'Please provide a member name' }),
  role: z.string().min(1, { message: 'Please select a role for the new member' })
})

type NewMemberFields = z.infer<typeof newMemberSchema>

const roleOptions = [
  { label: 'Owner', value: 'space_owner' },
  { label: 'Reader', value: 'reader' },
  { label: 'Executor', value: 'executor' },
  { label: 'Contributor', value: 'contributor' }
]

export const CreateNewMemberPage = () => {
  const space_ref = useGetSpaceURLParam()
  const navigate = useNavigate()
  const [selectedMember, setSelectedMember] = useState<string>('') // State to hold selected member UID
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    setValue,
    reset: resetNewMemberForm,
    formState: { errors },
    reset
  } = useForm<NewMemberFields>({
    resolver: zodResolver(newMemberSchema),
    mode: 'onChange',
    defaultValues: {
      memberName: '',
      role: ''
    }
  })

  const { data: { body: usersData } = {} } = useListPrincipalsQuery({
    // @ts-expect-error - api call shows the array type but if we dont use the string type it will throw error
    queryParams: { page: 1, limit: 20, type: 'user' }
  })

  const { mutate: addMember, isLoading: isSubmitting } = useMembershipAddMutation(
    { space_ref },
    {
      onSuccess: () => {
        setApiError(null)
        resetNewMemberForm()
        navigate(`/spaces/${space_ref}/settings/members`, { replace: true })
      },
      onError: error => setApiError(error.message ?? null)
    }
  )

  const onSubmit: SubmitHandler<NewMemberFields> = data => {
    addMember({ body: { user_uid: data.memberName, role: data.role as EnumMembershipRole } })
  }

  const handleMemberSelect = (uid: string) => {
    setSelectedMember(uid)
    setValue('memberName', uid, { shouldValidate: true })
  }

  const handleCancel = () => {
    resetNewMemberForm()
    navigate(`/spaces/${space_ref}/settings/members`, { replace: true })
  }

  useEffect(() => {
    reset() // Reset form on page load
  }, [reset])

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="2xl">
        <Spacer size={10} />
        <Text size={5} weight="medium">
          Add a new member to {space_ref}
        </Text>
        <Spacer size={6} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFieldSet.Root>
            {/* New Member Name */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="memberName" required>
                New Member Name
              </FormFieldSet.Label>
              <Controller
                control={control}
                name="memberName"
                render={({ field }) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="flex items-center justify-between rounded-md border">
                        <Button variant="ghost">
                          <Text>
                            {selectedMember
                              ? usersData?.find(user => user.uid === selectedMember)?.display_name
                              : 'Select New Member'}
                          </Text>
                        </Button>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                      <DropdownMenuLabel>
                        {usersData?.length ? (
                          'Available users'
                        ) : (
                          <Text color="tertiaryBackground">No available users</Text>
                        )}
                      </DropdownMenuLabel>
                      {usersData && <DropdownMenuSeparator />}
                      {usersData?.map(user => (
                        <DropdownMenuItem
                          className="flex justify-between"
                          key={user.uid}
                          onSelect={() => {
                            field.onChange(user.uid)
                            handleMemberSelect(user.uid ?? '')
                          }}
                        >
                          {user.display_name}
                          {selectedMember === user.uid && <Icon name="tick" size={12} className="ml-2" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
              {errors.memberName && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {errors.memberName.message}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>

            {/* Role Selection */}
            <FormFieldSet.ControlGroup>
              <FormFieldSet.Label htmlFor="role" required>
                Role
              </FormFieldSet.Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>
                  {errors.role.message}
                </FormFieldSet.Message>
              )}
            </FormFieldSet.ControlGroup>
            {apiError && (
              <FormFieldSet.Message theme={FormFieldSet.MessageTheme.ERROR}>{apiError}</FormFieldSet.Message>
            )}
            {/* Action Buttons */}
            <FormFieldSet.ControlGroup>
              <ButtonGroup.Root>
                <>
                  <Button size="sm" type="submit" loading={isSubmitting}>
                    {isSubmitting ? 'Inviting...' : 'Invite New Member'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                    Cancel
                  </Button>
                </>
              </ButtonGroup.Root>
            </FormFieldSet.ControlGroup>
          </FormFieldSet.Root>
        </form>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
