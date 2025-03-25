import { FC, HTMLAttributes, PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { useTranslationStore } from '@utils/viewUtils'

import { ProjectSettingsTabNav, SubHeaderWrapper } from '@harnessio/ui/views'

import RootViewWrapper from './root-view-wrapper'

const Layout = () => {
  return (
    <SubHeaderWrapper>
      <ProjectSettingsTabNav useTranslationStore={useTranslationStore} />
    </SubHeaderWrapper>
  )
}

export const ProjectSettingsWrapper: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <>
      <RootViewWrapper asChild>
        <Route
          path="*"
          element={
            <>
              <Layout />
              {children}
            </>
          }
        />
      </RootViewWrapper>
    </>
  )
}
