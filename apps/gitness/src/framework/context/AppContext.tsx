import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { noop } from 'lodash-es'

import { getUser, membershipSpaces, TypesSpace, TypesUser } from '@harnessio/code-service-client'

import useLocalStorage from '../hooks/useLocalStorage'

interface AppContextType {
  spaces: TypesSpace[]
  setSpaces: (value: TypesSpace[]) => void
  addSpaces: (newSpaces: TypesSpace[]) => void
  currentUser?: TypesUser
  setCurrentUser: (value: TypesUser) => void
}

const AppContext = createContext<AppContextType>({
  spaces: [],
  setSpaces: noop,
  addSpaces: noop,
  currentUser: undefined,
  setCurrentUser: noop
})

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<TypesSpace[]>([])
  const [currentUser, setCurrentUser] = useLocalStorage<TypesUser>('currentUser', {})

  useEffect(() => {
    Promise.all([
      membershipSpaces({
        queryParams: { page: 1, limit: 100, sort: 'identifier', order: 'asc' }
      }),
      getUser({})
    ])
      .then(([membershipResponse, userResponse]) => {
        setSpaces(membershipResponse.body.filter(item => item?.space).map(item => item.space as TypesSpace))
        setCurrentUser(userResponse.body)
      })
      .catch(() => {
        // Optionally handle error or show toast
      })
  }, [])

  const addSpaces = (newSpaces: TypesSpace[]): void => {
    setSpaces([...spaces, ...newSpaces])
  }

  return (
    <AppContext.Provider
      value={{
        spaces,
        setSpaces,
        addSpaces,
        currentUser,
        setCurrentUser
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
