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
import { useMFEContext } from '../hooks/useMFEContext'
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
  usePageTitle()
  const isMFE = useIsMFE()
  const { customPromises, scope } = useMFEContext()
  const [currentUser, setCurrentUser] = useLocalStorage<TypesUser>('currentUser', {})
  const [spaces, setSpaces] = useState<TypesSpace[]>([])
  const [isSpacesLoading, setSpacesIsLoading] = useState(false)
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
      if (isMFE && customPromises?.getCurrentUser) {
        const { data } = await customPromises.getCurrentUser({
          queryParams: { accountIdentifier: scope.accountId }
        })
        setCurrentUser({
          admin: data.admin,
          created: data.createdAt,
          display_name: data.name,
          email: data.email,
          uid: data.uuid,
          updated: data.lastUpdatedAt
        })
      } else {
        const userResponse = await getUser({})
        setCurrentUser(userResponse.body)
      }
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
    const fetchSpacesAndUser = async () => {
      setSpacesIsLoading(true)

      try {
        const fetchSpaces = () =>
          membershipSpaces({
            queryParams: { page: 1, limit: 100, sort: 'identifier', order: 'asc' }
          })

        const promises = isMFE ? [fetchUser()] : [fetchSpaces(), fetchUser()]
        const [results] = await Promise.allSettled(promises)

        if (!isMFE && results.status === 'fulfilled' && results.value?.body) {
          const spaces = results.value.body
            .filter((item: { space?: TypesSpace }) => item.space)
            .map((item: { space?: TypesSpace }) => item.space as TypesSpace)

          setSpaces(spaces)
        }
      } catch (e) {
        // Optionally handle error or show toast
      } finally {
        setSpacesIsLoading(false)
      }
    }

    fetchSpacesAndUser()
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
