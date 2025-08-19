import { createContext, useContext, useState } from 'react'

export const PageTitleContext = createContext<{
  dynamicTitle?: string
  setDynamicTitle: (title?: string) => void
}>({
  dynamicTitle: undefined,
  setDynamicTitle: () => {}
})

export const PageTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dynamicTitle, setDynamicTitle] = useState<string | undefined>()

  return <PageTitleContext.Provider value={{ dynamicTitle, setDynamicTitle }}>{children}</PageTitleContext.Provider>
}

export const usePageTitleContext = () => useContext(PageTitleContext)
