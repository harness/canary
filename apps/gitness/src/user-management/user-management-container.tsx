import { useState } from 'react'
import { SandboxSettingsUserManagementPage } from '@harnessio/playground'
import {
  useAdminListUsersQuery,
  AdminListUsersOkResponse,
  useAdminUpdateUserMutation
} from '@harnessio/code-service-client'
// import { useAppContext } from '../framework/context/AppContext'

export const UserManagementPageContainer = () => {
  const [userData, setUserData] = useState<AdminListUsersOkResponse | null>(null)
  // const { currentUser } = useAppContext()
  // console.log(currentUser)

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
      onSuccess: ({ body: data }) => {
        // setUserData(data)
        console.log(data)
      },
      onError: error => {
        console.error(error)
      }
    }
  )

  const handleUpdateUser = (userId: string, data: any) => {
    updateUser({
      user_uid: userId,
      body: data
    })
  }

  return <SandboxSettingsUserManagementPage userData={userData} handleUpdateUser={handleUpdateUser} />
}
