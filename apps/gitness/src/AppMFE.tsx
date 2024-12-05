import './AppMFE.css'

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { CodeServiceAPIClient } from '@harnessio/code-service-client'

import { AppProvider } from './framework/context/AppContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import ConfigMFE from './MFE'
import ReposListPage from './pages-v2/repo/repo-list'
import { SignIn } from './pages/signin'
import { SignUp } from './pages/signup'

// export default function AppMFE() {
//   return <div>AppMFE</div>
// }

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function AppMFE({ ...props }) {
  new CodeServiceAPIClient({
    urlInterceptor: (url: string) => `${BASE_URL_PREFIX}${url}`,
    responseInterceptor: (response: Response) => {
      // switch (response.status) {
      //   case 401:
      //     window.location.href = '/signin'
      //     break
      // }
      return response
    }
  })

  console.log('/ng/${props.renderUrl', `/ng${props.renderUrl}`)

  const basePath = `/ng${props.renderUrl}`

  return (
    <AppProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <NuqsAdapter>
            <BrowserRouter basename={basePath}>
              <Routes>
                <Route path="test" element={<h1 className="bg-background p-5 text-white">Test route</h1>} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="repo-list" element={<ReposListPage />} />
                <Route path="/" element={<ConfigMFE />} />
              </Routes>
            </BrowserRouter>
          </NuqsAdapter>
        </QueryClientProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
