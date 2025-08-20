import { Navigate } from 'react-router-dom'

import { Breadcrumb } from '@harnessio/ui/components'
import { ComponentProvider } from '@harnessio/ui/context'
import { ProfileSettingsLayout } from '@harnessio/ui/views'

import { AppShellMFE } from '../../components-v2/mfe/app-shell'
import { AppProvider } from '../../framework/context/AppContext'
import { AppRouterProvider } from '../../framework/context/AppRouterProvider'
import { PageTitleProvider } from '../../framework/context/PageTitleContext'
import { RbacButton } from '../../framework/rbac/rbac-button'
import { RbacSplitButton } from '../../framework/rbac/rbac-split-button'
import { CustomRouteObject, RouteConstants } from '../../framework/routing/types'
import { SettingsProfileGeneralPage } from '../../pages-v2/profile-settings/profile-settings-general-container'
import { SettingsProfileKeysPage } from '../../pages-v2/profile-settings/profile-settings-keys-container'
import { Page, repoRoutes } from '../common-routes'

export const getMFERoutes = (mfeProjectId = '', mfeRouteRenderer: JSX.Element | null = null): CustomRouteObject[] => [
  {
    path: '/',
    element: (
      <AppRouterProvider>
        <PageTitleProvider>
          <AppProvider>
            <ComponentProvider components={{ RbacButton, RbacSplitButton }}>
              {mfeRouteRenderer}
              <AppShellMFE />
            </ComponentProvider>
          </AppProvider>
        </PageTitleProvider>
      </AppRouterProvider>
    ),
    handle: { routeName: RouteConstants.toHome },
    children: [
      {
        path: '',
        handle: {
          ...(mfeProjectId && {
            breadcrumb: () => <span>{mfeProjectId}</span>
          })
        },
        children: repoRoutes
      },
      {
        path: 'profile-settings',
        element: <ProfileSettingsLayout />,
        handle: {
          breadcrumb: () => (
            <>
              <span>User</span>
              <Breadcrumb.Separator className="mx-2.5" />
              <span>{Page.Settings}</span>
            </>
          ),
          pageTitle: Page.Settings
        },
        children: [
          {
            index: true,
            element: <Navigate to="general" replace />,
            handle: {
              breadcrumb: () => <span>{Page.General}</span>
            }
          },
          {
            path: 'general',
            element: <SettingsProfileGeneralPage />,
            handle: {
              breadcrumb: () => <span>{Page.General}</span>,
              routeName: RouteConstants.toProfileGeneral,
              pageTitle: Page.General
            }
          },
          {
            path: 'keys',
            element: <SettingsProfileKeysPage />,
            handle: {
              breadcrumb: () => <span>{Page.Keys}</span>,
              routeName: RouteConstants.toProfileKeys,
              pageTitle: Page.Keys
            }
          }
        ]
      }
    ]
  }
]
