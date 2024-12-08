import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'

import Account from './account'
import SignIn from './signin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>
  },
  {
    path: 'signin',
    element: <SignIn />
  },
  {
    path: 'dashboard',
    element: <Account />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
