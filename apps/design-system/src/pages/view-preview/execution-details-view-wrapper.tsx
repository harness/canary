import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ExecutionDetailsView } from '@subjects/views/execution-details'

export const ExecutionDetailsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route path="*" element={<ExecutionDetailsView />}>
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
