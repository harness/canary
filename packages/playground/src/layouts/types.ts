import { IconProps } from '@harnessio/canary'

export interface PlaygroundProps {
  isPlayground?: boolean
}

export interface ScopeProps {
  /**
   * Optional project id
   */
  projectId?: string
}

export interface UserInfoProps {
  username?: string
  isAdmin?: boolean
}

export interface NavbarItem {
  id: number
  title: string
  iconName: IconProps['name']
  description: string
  to?: string
}
