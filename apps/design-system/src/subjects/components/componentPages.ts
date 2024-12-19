import type { RouteProps } from 'react-router-dom'

import AlertComponent from '@subjects/components/alert'
import BadgeComponent from '@subjects/components/badge'
import ButtonComponent from '@subjects/components/button'

interface ComponentPage {
  name: string
  path: string
  Component: RouteProps['Component']
}

export const componentPages: ComponentPage[] = [
  { name: 'Alert', path: 'alert', Component: AlertComponent },
  { name: 'Badge', path: 'badge', Component: BadgeComponent },
  { name: 'Button', path: 'button', Component: ButtonComponent }
]
