import './AppMFE.css'

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import App from './App'
import { AppProvider } from './framework/context/AppContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import ConfigMFE from './MFE'
import ReposListPage from './pages-v2/repo/repo-list'
import { SignIn } from './pages/signin'
import { SignUp } from './pages/signup'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function AppMFE({ basePath }: { basePath: string }) {
  // new CodeServiceAPIClient({
  //   urlInterceptor: (url: string) => `${BASE_URL_PREFIX}${url}`,
  //   responseInterceptor: (response: Response) => {
  //     // switch (response.status) {
  //     //   case 401:
  //     //     window.location.href = '/signin'
  //     //     break
  //     // }
  //     return response
  //   }
  // })

  return (
    <BrowserRouter basename={basePath}>
      <Routes>
        <Route path="test" element={<h1 className="bg-background p-5 text-white">Test route</h1>} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="repos" element={<ReposListPage />} />
        <Route path="/" element={<ConfigMFE />} />
        <Route path="*" element={<h1>Wildcard</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
