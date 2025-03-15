import { FC, HTMLAttributes, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useThemeStore } from '@utils/theme-utils'
import { useTranslationStore } from '@utils/viewUtils'

import { ProfileSettingsLayout } from '@harnessio/ui/views'

export const ProfileSettingsViewWrapper: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={<ProfileSettingsLayout useTranslationStore={useTranslationStore} useThemeStore={useThemeStore} />}
      >
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
