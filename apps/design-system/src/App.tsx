import { FC } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import ComponentPage from '@/pages/component-page.tsx'
import ViewPreview from '@/pages/view-preview/view-preview.tsx'
import DocsLayout from '@components/docs-layout/docs-layout.tsx'

const router = createBrowserRouter([
  { path: '/view-preview/*', element: <ViewPreview /> },
  { path: '/docs/*', element: <DocsLayout />, children: [{ path: 'components/*', element: <ComponentPage /> }] },
  { path: '/*', element: <Navigate to="/docs" /> } // temp redirect to view preview
])

const App: FC = () => {
  return <RouterProvider router={router} />
}

export default App
