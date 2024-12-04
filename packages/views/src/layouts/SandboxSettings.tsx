import { Outlet, useMatch } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Text
} from '@harnessio/canary'

import { SandboxLayout } from '../index'

const SandboxSettings: React.FC = () => {
  const isAccountRoute = useMatch('/sandbox/settings/profile/*')
  const isProjectRoute = useMatch('/sandbox/settings/project/*')

  // Set the breadcrumb label based on the route
  const breadcrumbLabel = isAccountRoute ? 'Profile' : isProjectRoute ? 'Project' : ''

  return (
    <SandboxLayout.Root>
      <SandboxLayout.Header>
        <div className="border-border-background flex h-full items-center border-b px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/sandbox/settings">
                  <Text size={2} color={isAccountRoute || isProjectRoute ? 'tertiaryBackground' : 'primary'}>
                    Settings
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {(isAccountRoute || isProjectRoute) && (
                <BreadcrumbSeparator className="font-thin">&nbsp;/&nbsp;</BreadcrumbSeparator>
              )}
              {breadcrumbLabel && (
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">
                    <Text size={2} color="primary">
                      {breadcrumbLabel}
                    </Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </SandboxLayout.Header>
      <Outlet />
    </SandboxLayout.Root>
  )
}

export { SandboxSettings }
