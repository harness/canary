import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { NavbarItemIdType } from '@harnessio/ui/components'
import { SandboxRoot } from '@harnessio/ui/views'

import { mockT, noop } from '../../utils.ts'

const recentMenu: NavbarItemIdType[] = []

const RootViewWrapper: FC<PropsWithChildren<unknown>> = ({ children }) => (
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
      <Route path="*" element={children} />
    </Route>
  </Routes>
)

export default RootViewWrapper
