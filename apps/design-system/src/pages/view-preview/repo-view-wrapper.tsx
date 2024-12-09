import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { NavbarItemType } from '@harnessio/ui/components'
import { RepoLayout, SandboxRoot } from '@harnessio/ui/views'

import { mockT, noop, useTranslationsStore } from '../../utils.ts'

const recentMenu: NavbarItemType[] = []

const RepoViewWrapper: FC<PropsWithChildren<unknown>> = ({ children }) => (
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
      <Route path="*" element={<RepoLayout useTranslationStore={useTranslationsStore} />}>
        <Route path="*" element={children} />
      </Route>
    </Route>
  </Routes>
)

export default RepoViewWrapper
