import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useThemeStore } from '@utils/theme-utils'
import { useTranslationStore } from '@utils/viewUtils'

import { RepoSettingsLayout } from '@harnessio/ui/views'

export const RepoSettingsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={<RepoSettingsLayout useTranslationStore={useTranslationStore} useThemeStore={useThemeStore} />}
      >
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
