import { createContext, ReactNode, useContext } from 'react'
import type { Location, NavigateFunction } from 'react-router-dom'

interface RouterContextType {
  location: Location
  navigate: NavigateFunction
}

const defaultLocation: Location = { ...window.location, state: {}, key: '' }
const navigateFnDefault: NavigateFunction = to => {
  if (typeof to === 'number') {
    window.history.go(to) // Supports navigate(-1), navigate(1), etc.
  } else {
    window.location.href = to.toString()
  }
}

const RouterContext = createContext<RouterContextType>({
  location: defaultLocation,
  navigate: navigateFnDefault
})

export const useRouterContext = () => useContext(RouterContext)

export const RouterContextProvider = ({
  children,
  location,
  navigate
}: {
  children: ReactNode
} & RouterContextType) => {
  return (
    <RouterContext.Provider
      value={{
        location,
        navigate
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}
