import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { CommitDetailsView } from '@subjects/views/commit-details'

const CommitDetailsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => (
  <Routes>
    <Route path="*" element={<CommitDetailsView />}>
      <Route path="*" element={children} />
    </Route>
  </Routes>
)

export default CommitDetailsViewWrapper
