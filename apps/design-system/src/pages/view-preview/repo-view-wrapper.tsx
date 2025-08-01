import { FC, PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { noop } from '@tanstack/react-table'

import { RepoSubheader } from '@harnessio/ui/components'
import { RepoHeader, SubHeaderWrapper } from '@harnessio/ui/views'

import RootViewWrapper from './root-view-wrapper'

const RepoViewWrapper: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLElement> & { childrenWrapperClassName?: string }>
> = ({ children, childrenWrapperClassName }) => (
  <RootViewWrapper asChild childrenWrapperClassName={childrenWrapperClassName}>
    <Route
      path="*"
      element={
        <>
          <RepoHeader name="Ipsum" isPublic onFavoriteToggle={noop} />
          <SubHeaderWrapper>
            <RepoSubheader />
          </SubHeaderWrapper>
          {children}
        </>
      }
    />
  </RootViewWrapper>
)

export default RepoViewWrapper
