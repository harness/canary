import { FC, PropsWithChildren } from 'react'

import { Breadcrumb, Topbar } from '@harnessio/ui/components'

import { AppViewWrapper, AppViewWrapperProps } from './app-view-wrapper'

const RootViewWrapper: FC<PropsWithChildren<Omit<AppViewWrapperProps, 'breadcrumbs'>>> = ({ children, asChild }) => {
  return (
    <AppViewWrapper
      asChild={asChild}
      breadcrumbs={
        <div className="bg-background-1 sticky top-0 z-40">
          <Topbar.Root>
            <Topbar.Left>
              <Breadcrumb.Root className="select-none">
                <Breadcrumb.List>
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Lorem</Breadcrumb.Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Separator />
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href="#">Ipsum</Breadcrumb.Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Separator />
                  <Breadcrumb.Item>Dolor</Breadcrumb.Item>
                </Breadcrumb.List>
              </Breadcrumb.Root>
            </Topbar.Left>
          </Topbar.Root>
        </div>
      }
    >
      {children}
    </AppViewWrapper>
  )
}

export default RootViewWrapper
