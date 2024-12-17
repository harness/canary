import { FC } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { ExitConfirmProvider } from './context/exit-confirm-context.tsx'
import ViewPreview from './pages/view-preview/view-preview.tsx'

const router = createBrowserRouter([
  { path: '/view-preview/*', element: <ViewPreview /> },
  { path: '/*', element: <Navigate to="/view-preview" /> } // temp redirect to view preview
])

const App: FC = () => {
  return (
    <ExitConfirmProvider>
      <RouterProvider router={router} />
    </ExitConfirmProvider>
  )
}

export default App
