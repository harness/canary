import { createContext, FC, memo, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import { noop } from 'lodash-es'

import {
  getUser,
  GetUserErrorResponse,
  membershipSpaces,
  TypesSpace,
  TypesUser,
  updateUser,
  UpdateUserErrorResponse
} from '@harnessio/code-service-client'
import { ProfileSettingsErrorType } from '@harnessio/ui/views'

import { useIsMFE } from '../hooks/useIsMFE'
import useLocalStorage from '../hooks/useLocalStorage'
import usePageTitle from '../hooks/usePageTitle'

interface AppContextType {
  spaces: TypesSpace[]
  isSpacesLoading: boolean
  setSpaces: (value: TypesSpace[]) => void
  addSpaces: (newSpaces: TypesSpace[]) => void
  currentUser?: TypesUser
  setCurrentUser: (value: TypesUser) => void
  fetchUser: () => Promise<void>
  updateUserProfile: (data: { display_name?: string; email?: string }) => Promise<void>
  isUpdatingUser: boolean
  isLoadingUser: boolean
  updateUserError: {
    type: ProfileSettingsErrorType
    message: string
  } | null
}

const AppContext = createContext<AppContextType>({
  spaces: [],
  isSpacesLoading: false,
  setSpaces: noop,
  addSpaces: noop,
  currentUser: undefined,
  setCurrentUser: noop,
  fetchUser: async () => {},
  updateUserProfile: async () => {},
  isUpdatingUser: false,
  isLoadingUser: false,
  updateUserError: null
})

export const AppProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  const isMFE = useIsMFE()
  usePageTitle()
  const [spaces, setSpaces] = useState<TypesSpace[]>([])
  const [isSpacesLoading, setSpacesIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useLocalStorage<TypesUser>('currentUser', {})
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [updateUserError, setUpdateUserError] = useState<{
    type: ProfileSettingsErrorType
    message: string
  } | null>(null)

  const fetchUser = async (): Promise<void> => {
    setIsLoadingUser(true)
    setUpdateUserError(null)
    try {
      const userResponse = await getUser({})
      setCurrentUser(userResponse.body)
    } catch (error) {
      const typedError = error as GetUserErrorResponse
      setUpdateUserError({
        type: ProfileSettingsErrorType.PROFILE,
        message: typedError.message || 'An unknown fetch user error occurred.'
      })
    } finally {
      setIsLoadingUser(false)
    }
  }

  const updateUserProfile = async (data: { display_name?: string; email?: string }): Promise<void> => {
    setIsUpdatingUser(true)
    setUpdateUserError(null)
    try {
      const response = await updateUser({ body: data })
      setCurrentUser(response.body)
    } catch (error) {
      const typedError = error as UpdateUserErrorResponse
      setUpdateUserError({
        type: ProfileSettingsErrorType.PROFILE,
        message: typedError.message || 'An unknown update user error occurred.'
      })
    } finally {
      setIsUpdatingUser(false)
    }
  }

  useEffect(() => {
    if (isMFE) return
    setSpacesIsLoading(true)
    Promise.allSettled([
      membershipSpaces({
        queryParams: { page: 1, limit: 100, sort: 'identifier', order: 'asc' }
      }),
      fetchUser()
    ])
      .then(results => {
        const [membershipResult] = results

        if (membershipResult.status === 'fulfilled') {
          setSpaces(membershipResult.value.body.filter(item => item?.space).map(item => item.space as TypesSpace))
        }
      })
      .catch(() => {
        // Optionally handle error or show toast
      })
      .finally(() => {
        setSpacesIsLoading(false)
      })
  }, [isMFE])

  const addSpaces = (newSpaces: TypesSpace[]): void => {
    setSpaces(prevSpaces => [...prevSpaces, ...newSpaces])
  }

  const contextValue = useMemo(
    () => ({
      spaces,
      setSpaces,
      addSpaces,
      currentUser,
      setCurrentUser,
      fetchUser,
      updateUserProfile,
      isLoadingUser,
      isUpdatingUser,
      updateUserError,
      isSpacesLoading
    }),
    [spaces, currentUser, isLoadingUser, isUpdatingUser, updateUserError, isSpacesLoading]
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
})

AppProvider.displayName = 'AppProvider'

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
