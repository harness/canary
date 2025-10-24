import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ExecutionLogsView } from '@subjects/views/execution/execution-logs'

export const ExecutionLogsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route path="*" element={<ExecutionLogsView />}>
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
