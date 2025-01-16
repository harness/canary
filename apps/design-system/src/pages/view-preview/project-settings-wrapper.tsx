import { PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import RootViewWrapper from './root-view-wrapper'

export const ProjectSettingsWrapper: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <RootViewWrapper asChild>
        <Route path="*" element={children}></Route>
      </RootViewWrapper>
    </>
  )
}
