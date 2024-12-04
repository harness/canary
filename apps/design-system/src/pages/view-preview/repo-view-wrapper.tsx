import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { NavbarItemIdType } from '@harnessio/ui/components'
import { RepoLayout, SandboxRoot } from '@harnessio/ui/views'

import { mockT, noop, useTranslationsStore } from '../../utils.ts'

const recentMenu: NavbarItemIdType[] = []

const RepoViewWrapper: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Routes>
    <Route
      path="*"
      element={
        <SandboxRoot
          currentUser={undefined}
          pinnedMenu={null}
          recentMenu={recentMenu}
          changeRecentMenu={noop}
          logout={noop}
          changePinnedMenu={noop}
          t={mockT as any}
        />
      }
    >
      <Route path="*" element={<RepoLayout useTranslationStore={useTranslationsStore} />}>
        <Route path="*" element={children} />
      </Route>
    </Route>
  </Routes>
)

export default RepoViewWrapper
