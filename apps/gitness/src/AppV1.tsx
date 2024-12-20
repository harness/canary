import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, Navigate, Outlet, RouteObject, RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { NuqsAdapter } from 'nuqs/adapters/react-router'

import { TooltipProvider } from '@harnessio/canary'
import { CodeServiceAPIClient } from '@harnessio/code-service-client'
import { Text } from '@harnessio/ui/components'

import BreadcrumbsV1 from './components/breadcrumbsV1/breadcrumbs'
import { ProjectDropdown } from './components/breadcrumbsV1/project-dropdown'
// import RootWrapper from './components/RootWrapper'
// import RepoListing from './components/breadcrumbsV1/repo-listing'
// import RepoSummary from './components/breadcrumbsV1/repo-summary'
import { AppProvider } from './framework/context/AppContext'
import { ExitConfirmProvider } from './framework/context/ExitConfirmContext'
import { ThemeProvider } from './framework/context/ThemeContext'
import { queryClient } from './framework/queryClient'
import i18n from './i18n/i18n'
import { ProjectMemberListPage } from './pages-v2/project/project-member-list'
import { SettingsLayout } from './pages-v2/project/settings-layout'
import { RepoBranchesListPage } from './pages-v2/repo/repo-branch-list'
import RepoCommitsPage from './pages-v2/repo/repo-commits'
import RepoLayout from './pages-v2/repo/repo-layout'
import ReposListPage from './pages-v2/repo/repo-list'
import RepoSummaryPage from './pages-v2/repo/repo-summary'

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
          {/* <RootWrapper /> */}
        </>
      ),
      handle: {
        breadcrumb: () => <ProjectDropdown />
      },
      children: [
        {
          path: ':spaceId/repos',
          handle: {
            breadcrumb: () => <Text>Repositories</Text>
          },
          children: [
            { index: true, element: <ReposListPage /> },
            {
              path: ':repoId',
              element: <RepoLayout />,
              handle: {
                breadcrumb: ({ repoId }: { repoId: string }) => <Text>{repoId}</Text>
              },
              children: [
                {
                  index: true,
                  element: <Navigate to="summary" replace />
                },
                {
                  path: 'summary',
                  element: <RepoSummaryPage />,
                  handle: {
                    breadcrumb: () => <Text>Summary</Text>
                  }
                },
                {
                  path: 'commits',
                  element: <RepoCommitsPage />,
                  handle: {
                    breadcrumb: () => <Text>Commits</Text>
                  }
                },
                {
                  path: 'branches',
                  element: <RepoBranchesListPage />,
                  handle: {
                    breadcrumb: () => <Text>Branches</Text>
                  }
                }
              ]
            }
          ]
        },
        {
          path: ':spaceId/settings',
          element: <SettingsLayout />,
          handle: {
            breadcrumb: () => <Text>Settings</Text>
          },
          children: [
            {
              index: true,
              element: <Navigate to="general" replace />
            },
            {
              path: 'general',
              element: <>General</>,
              handle: {
                breadcrumb: () => <Text>General</Text>
              }
            },
            {
              path: 'members',
              element: <ProjectMemberListPage />,
              handle: {
                breadcrumb: () => <Text>Members</Text>
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
