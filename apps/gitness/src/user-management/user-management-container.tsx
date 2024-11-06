import { useState } from 'react'
import { SandboxSettingsUserManagementPage } from '@harnessio/playground'
import {
  useAdminListUsersQuery,
  AdminListUsersOkResponse,
  useAdminUpdateUserMutation,
  useAdminDeleteUserMutation,
  useUpdateUserAdminMutation
} from '@harnessio/code-service-client'
import { useQueryClient } from '@tanstack/react-query'

export const UserManagementPageContainer = () => {
  const queryClient = useQueryClient()

  const [userData, setUserData] = useState<AdminListUsersOkResponse | null>(null)

  useAdminListUsersQuery(
    {
      queryParams: {
        page: 1,
        limit: 30
      }
    },
    {
      onSuccess: ({ body: data }) => {
        setUserData(data)
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutate: updateUser } = useAdminUpdateUserMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutate: deleteUser } = useAdminDeleteUserMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const { mutate: updateUserAdmin } = useUpdateUserAdminMutation(
    {},
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['adminListUsers'] })
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const handleUpdateUser = (data: { email: string; displayName: string; userID: string }) => {
    updateUser({
      user_uid: data.userID,
      body: {
        email: data.email,
        display_name: data.displayName
      }
    })
  }

  const handleDeleteUser = (userUid: string) => {
    deleteUser({
      user_uid: userUid
    })
  }

  const handleUpdateUserAdmin = (userUid: string, isAdmin: boolean) => {
    updateUserAdmin({
      user_uid: userUid,
      body: {
        admin: isAdmin
      }
    })
  }

  const handleUpdatePassword = (userId: string, password: string) => {
    updateUser({
      user_uid: userId,
      body: {
        password: password
      }
    })
  }
  return (
    <SandboxSettingsUserManagementPage
      userData={userData}
      handleUpdateUser={handleUpdateUser}
      handleDeleteUser={handleDeleteUser}
      handleUpdatePassword={handleUpdatePassword}
      updateUserAdmin={handleUpdateUserAdmin}
    />
  )
}
