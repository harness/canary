import { FC, PropsWithChildren } from 'react'
import { Route } from 'react-router-dom'

import { RepoLayout } from '@harnessio/ui/views'

import { useTranslationsStore } from '../../utils.ts'
import RootViewWrapper from './root-view-wrapper.tsx'

const RepoViewWrapper: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <RootViewWrapper asChild>
    <Route path="*" element={<RepoLayout useTranslationStore={useTranslationsStore} />}>
      <Route path="*" element={children} />
    </Route>
  </RootViewWrapper>
)

export default RepoViewWrapper
