import { createContext, useContext, useState } from 'react'

/**
 * Provides a context for managing the application's page title dynamically.
 * This context takes precedence over titles defined in route configurations (routes.ts).
 */
export const PageTitleContext = createContext<{
  pageTitle?: string
  setPageTitle: (title?: string) => void
}>({
  pageTitle: undefined,
  setPageTitle: () => {}
})

export const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState<string | undefined>()

  return <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>{children}</PageTitleContext.Provider>
}

export const usePageTitleContext = () => useContext(PageTitleContext)
