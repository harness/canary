import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ExecutionGraphView } from '@subjects/views/execution/execution-graph'

export const ExecutionGraphViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route path="*" element={<ExecutionGraphView />}>
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
