import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { Text } from '@harnessio/ui/components'

import BreadcrumbsV1 from './components/breadcrumbsV1/breadcrumbs'
import ProjectSelector from './components/breadcrumbsV1/project-selector'
import RepoListing from './components/breadcrumbsV1/repo-listing'
import RepoSummary from './components/breadcrumbsV1/repo-summary'
import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'

const BASE_URL_PREFIX = `${window.apiUrl || ''}/api/v1`

export default function AppV1() {
  new CodeServiceAPIClient({
    urlInterceptor: (url: string) => `${BASE_URL_PREFIX}${url}`,
    responseInterceptor: (response: Response) => {
      switch (response.status) {
        case 401:
          window.location.href = '/signin'
          break
      }
      return response
    }
  })

  // Define a custom handle with the breadcrumb property
  interface CustomHandle {
    breadcrumb?: (params: Record<string, string>) => string
  }

  // Create a new type by intersecting RouteObject with the custom handle
  type CustomRouteObject = RouteObject & {
    handle?: CustomHandle
  }

  const routes: CustomRouteObject[] = [
    {
      path: '/',
      element: (
        <>
          <BreadcrumbsV1 />
          <Outlet />
        </>
      ),
      handle: {
        breadcrumb: () => 'Landing Page'
      },
      children: [
        {
          path: '',
          handle: {
            breadcrumb: () => <ProjectSelector />
          }
        },
        {
          path: 'projects/:projectId/repos',
          element: <Outlet />, // Placeholder for nested routes
          handle: {
            breadcrumb: ({ projectId }: { projectId: string }) => <Text>{projectId}</Text>
          },
          children: [
            {
              path: '',
              element: <RepoListing />,
              handle: {
                breadcrumb: () => <Text>Repositories</Text>
              }
            },
            {
              path: ':repoId',
              element: <RepoSummary />,
              handle: {
                breadcrumb: ({ repoId }: { projectId: string; repoId: string }) => `${repoId}`
              }
            }
          ]
        }
      ]
    }
  ]

  // Router Configuration
  const router = createBrowserRouter(routes)

  return (
    <AppProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider defaultTheme="dark-std-std">
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <ExitConfirmProvider>
                <NuqsAdapter>
                  <RouterProvider router={router} />
                </NuqsAdapter>
              </ExitConfirmProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </AppProvider>
  )
}
