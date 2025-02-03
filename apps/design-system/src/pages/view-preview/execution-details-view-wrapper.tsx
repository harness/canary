import { FC, PropsWithChildren } from 'react'
import { Route, Routes } from 'react-router-dom'

export const ExecutionDetailsViewWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({ children }) => {
  return (
    <Routes>
      <Route path="*" element={<>Execution Details View Wrapper</>}>
        <Route path="*" element={children} />
      </Route>
    </Routes>
  )
}
