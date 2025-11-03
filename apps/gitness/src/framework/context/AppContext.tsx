import { createContext, FC, memo, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

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
import { useLocalStorage, UserPreference } from '@harnessio/ui/hooks'
import { ProfileSettingsErrorType } from '@harnessio/ui/views'

import { useIsMFE } from '../hooks/useIsMFE'
import usePageTitle from '../hooks/usePageTitle'

declare global {
  interface Window {
    publicAccessOnAccount?: boolean
  }
}

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
  isCurrentSessionPublic: boolean | undefined
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
  updateUserError: null,
  isCurrentSessionPublic: undefined
})

export const AppProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  usePageTitle()
  const isMFE = useIsMFE()
  const [currentUser, setCurrentUser] = useLocalStorage<TypesUser>(UserPreference.CURRENT_USER, {})
  const [spaces, setSpaces] = useState<TypesSpace[]>([])
  const [isSpacesLoading, setSpacesIsLoading] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [updateUserError, setUpdateUserError] = useState<{
    type: ProfileSettingsErrorType
    message: string
  } | null>(null)

  // Calculate isCurrentSessionPublic from window object
  const isCurrentSessionPublic = useMemo(() => {
    return window.publicAccessOnAccount
  }, [])

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setIsLoadingUser(true)
      setUpdateUserError(null)
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
  }, [setCurrentUser])

  const updateUserProfile = useCallback(
    async (data: { display_name?: string; email?: string }): Promise<void> => {
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
    },
    [setCurrentUser]
  )

  const fetchSpaces = useCallback(async () => {
    setSpacesIsLoading(true)

    try {
      const fetchSpacesAPI = () =>
        membershipSpaces({
          queryParams: { page: 1, limit: 100, sort: 'identifier', order: 'asc' }
        })

      const results = await fetchSpacesAPI()
      if (results?.body) {
        const spaces = results.body
          .filter((item: { space?: TypesSpace }) => item.space)
          .map((item: { space?: TypesSpace }) => item.space as TypesSpace)

        setSpaces(spaces)
      }
    } catch (e) {
      // Optionally handle error or show toast
    } finally {
      setSpacesIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
    if (!isMFE) {
      fetchSpaces()
    }
  }, [isMFE, fetchUser, fetchSpaces])

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
      isSpacesLoading,
      isCurrentSessionPublic
    }),
    [
      spaces,
      currentUser,
      isLoadingUser,
      isUpdatingUser,
      updateUserError,
      isSpacesLoading,
      isCurrentSessionPublic,
      fetchUser,
      setCurrentUser,
      updateUserProfile
    ]
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
