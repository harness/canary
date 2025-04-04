import { FC, PropsWithChildren } from 'react'

import { AppViewWrapper, AppViewWrapperProps } from './app-view-wrapper'

export const mockedBreadcrumbs = [
  {
    data: undefined,
    handle: {
      asLink: true,
      breadcrumb: () => <span>Lorem</span>
    },
    id: '1',
    params: { spaceId: 'Lorem' },
    pathname: '/Lorem'
  },
  {
    data: undefined,
    handle: {
      asLink: true,
      breadcrumb: () => <span>Ipsum</span>
    },
    id: '2',
    params: { spaceId: 'Lorem' },
    pathname: '/Ipsum'
  },
  {
    data: undefined,
    handle: {
      asLink: false,
      breadcrumb: () => <span>Dolor</span>
    },
    id: '3',
    params: { spaceId: 'Lorem' },
    pathname: '/Dolor'
  }
]

const RootViewWrapper: FC<PropsWithChildren<Omit<AppViewWrapperProps, 'breadcrumbs'>>> = ({ children, asChild }) => {
  return (
    <AppViewWrapper asChild={asChild} breadcrumbs={mockedBreadcrumbs}>
      {children}
    </AppViewWrapper>
  )
}

export default RootViewWrapper
