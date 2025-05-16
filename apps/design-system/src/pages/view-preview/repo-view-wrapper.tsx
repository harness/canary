import { FC, PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { useTranslationStore } from '@utils/viewUtils'

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
          <RepoHeader name="Ipsum" isPublic useTranslationStore={useTranslationStore} />
          <SubHeaderWrapper>
            <RepoSubheader useTranslationStore={useTranslationStore} />
          </SubHeaderWrapper>
          {children}
        </>
      }
    />
  </RootViewWrapper>
)

export default RepoViewWrapper
