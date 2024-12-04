import { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ViewPreview from './pages/view-preview/view-preview.tsx'

const router = createBrowserRouter([{ path: '/view-preview/*', element: <ViewPreview /> }])

const App: FC = () => {
  return <RouterProvider router={router} />
}

export default App
