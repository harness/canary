import React from 'react'

import useDocumentTitle from '../hooks/useDocumentTitle'

export const DocumentTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useDocumentTitle()
  return <>{children}</>
}
