import type { RouteProps } from 'react-router-dom'

import AlertComponent from './alert'
import BadgeComponent from './badge'
import BreadcrumbComponent from './breadcrumb'
import ButtonComponent from './button'

interface ComponentPage {
  name: string
  path: string
  Component: RouteProps['Component']
}

export const componentPages: ComponentPage[] = [
  { name: 'Alert', path: 'alert', Component: AlertComponent },
  { name: 'Badge', path: 'badge', Component: BadgeComponent },
  { name: 'Breadcrumb', path: 'breadcrumb', Component: BreadcrumbComponent },
  { name: 'Button', path: 'button', Component: ButtonComponent }
]
