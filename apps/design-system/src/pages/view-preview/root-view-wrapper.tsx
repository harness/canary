import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { NavbarItemType } from '@harnessio/ui/components'
import { SandboxRoot } from '@harnessio/ui/views'

import { mockT, noop } from '../../utils.ts'

const recentMenu: NavbarItemType[] = []

const RootViewWrapper: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Routes>
    <Route
      path="*"
      element={
        <SandboxRoot
          currentUser={undefined}
          pinnedMenu={[]}
          recentMenu={recentMenu}
          logout={noop}
          setPinned={noop}
          setRecent={noop}
          setNavLinks={noop}
          t={mockT as any}
        />
      }
    >
      <Route path="*" element={children} />
    </Route>
  </Routes>
)

export default RootViewWrapper
