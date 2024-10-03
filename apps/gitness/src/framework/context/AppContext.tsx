import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  CodeServiceAPIClient,
  TypesMembershipSpace,
  membershipSpaces,
  TypesSpace
} from '@harnessio/code-service-client'

interface AppContextType {
  spaces: TypesMembershipSpace[]
  setSpaces: (spaces: TypesMembershipSpace[]) => void
  addSpaces: (newSpaces: TypesSpace[]) => void
}

const BASE_URL_PREFIX = '/api/v1'

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<TypesMembershipSpace[]>([])

  React.useLayoutEffect(() => {
    new CodeServiceAPIClient({
      urlInterceptor: (url: string) => `${BASE_URL_PREFIX}${url}`,
      requestInterceptor: (request: Request): Request => {
        // Retrieve the token from storage and add to headers if available
        const token = localStorage.getItem('token')
        if (token) {
          const newRequest = request.clone()
          newRequest.headers.set('Authorization', `Bearer ${token}`)
          return newRequest
        }
        return request
      },
      responseInterceptor: (response: Response) => {
        switch (response.status) {
          case 401:
            localStorage.removeItem('token')
            window.location.href = '/signin'
        }
        return response
      }
    })
    membershipSpaces({
      queryParams: { page: 1, limit: 10, sort: 'identifier', order: 'asc' }
    }).then(response => {
      setSpaces(response)
    })
  }, [])

  const addSpaces = (newSpaces: TypesSpace[]) => {
    setSpaces(prevSpaces => [...prevSpaces, ...newSpaces])
  }

  return <AppContext.Provider value={{ spaces, setSpaces, addSpaces }}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
