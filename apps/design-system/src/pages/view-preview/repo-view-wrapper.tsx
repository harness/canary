import { FC, PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { useTranslationsStore } from '@utils/viewUtils'

import { RepoSubheader } from '@harnessio/ui/components'

import RootViewWrapper from './root-view-wrapper'

const RepoViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => (
  <RootViewWrapper asChild>
    <Route
      path="*"
      element={
        <>
          <div className="layer-high bg-background-1 sticky top-[55px]">
            <RepoSubheader useTranslationStore={useTranslationsStore} />
          </div>
          {children}
        </>
      }
    />
  </RootViewWrapper>
)

export default RepoViewWrapper
