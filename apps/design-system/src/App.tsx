import { FC } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import ViewPreview from './pages/view-preview/view-preview.tsx'

const router = createBrowserRouter([
  { path: '/view-preview/*', element: <ViewPreview /> },
  { path: '/*', element: <Navigate to="/view-preview" /> } // temp redirect to view preview
])

const App: FC = () => {
  return <RouterProvider router={router} />
}

export default App
