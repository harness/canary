import { FC, PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { useTranslationsStore } from '@utils/viewUtils'

import { RepoSubheader } from '@harnessio/ui/components'

import RootViewWrapper from './root-view-wrapper'

const RepoViewWrapper: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <RootViewWrapper asChild>
    <Route
      path="*"
      element={
        <>
          <div className="layer-high sticky top-[55px] bg-background-1">
            <RepoSubheader useTranslationStore={useTranslationsStore} />
          </div>
          {children}
        </>
      }
    />
  </RootViewWrapper>
)

export default RepoViewWrapper
