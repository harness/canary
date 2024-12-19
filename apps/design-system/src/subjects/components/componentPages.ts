import type { RouteProps } from 'react-router-dom'

import AlertComponent from '@subjects/components/alert.tsx'
import BadgeComponent from '@subjects/components/badge.tsx'
import ButtonComponent from '@subjects/components/button.tsx'

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
