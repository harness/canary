import { FC, PropsWithChildren } from 'react'

import { Breadcrumb, Topbar } from '@harnessio/ui/components'

import { AppViewWrapper, AppViewWrapperProps } from './app-view-wrapper'

const RootViewWrapper: FC<PropsWithChildren<Omit<AppViewWrapperProps, 'breadcrumbs'>>> = ({
  children,
  asChild,
  childrenWrapperClassName
}) => {
  return (
    <AppViewWrapper
      asChild={asChild}
      childrenWrapperClassName={childrenWrapperClassName}
      breadcrumbs={
        <Topbar.Root className="bg-cn-background-0 sticky top-0 z-20">
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
      }
    >
      {children}
    </AppViewWrapper>
  )
}

export default RootViewWrapper
