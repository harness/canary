import { PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { ProjectSettingsPage } from '@harnessio/ui/views'

import RootViewWrapper from './root-view-wrapper'

export const ProjectSettingsWrapper: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <RootViewWrapper asChild>
        <Route
          path="*"
          element={
            <div className="top-[55px] sticky z-40 bg-background-1">
              <ProjectSettingsPage />
            </div>
          }
        >
          <Route path="*" element={children} />
        </Route>
      </RootViewWrapper>
    </>
  )
}
