import { createContext, useContext, useState } from 'react'

/**
 * Context to manage the dynamic page title for the application.
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
