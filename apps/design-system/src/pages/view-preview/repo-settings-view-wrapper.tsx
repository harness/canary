import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useTranslationStore } from '@utils/viewUtils'

import { RepoSettingsLayout } from '@harnessio/ui/views'

export const RepoSettingsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route path="*" element={<RepoSettingsLayout useTranslationStore={useTranslationStore} />}>
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
