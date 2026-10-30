import { FC } from 'react'
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import {
  Button,
  MoreActionsTooltip,
  RbacButtonProps,
  rbacTooltip,
  SplitButton,
  Tooltip
} from '@harnessio/ui/components'
import { ComponentProvider, RouterContextProvider } from '@harnessio/ui/context'

const RbacButton = ({ rbac: _, tooltip, ...rest }: RbacButtonProps) => {
  const hasPermission = true

  const button = <Button {...rest} ignoreIconOnlyTooltip disabled={!hasPermission} />

  return !hasPermission ? (
    <Tooltip title={tooltip?.title ?? rbacTooltip} content={tooltip?.content}>
      {button}
    </Tooltip>
  ) : (
    button
  )
}

const AppRouterProvider: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <RouterContextProvider
      Link={Link}
      NavLink={NavLink}
      Outlet={Outlet}
      location={location}
      navigate={navigate}
      useSearchParams={useSearchParams}
      useMatches={useMatches}
      useParams={useParams}
    >
      <ComponentProvider
        components={{ RbacButton, RbacSplitButton: SplitButton, RbacMoreActionsTooltip: MoreActionsTooltip }}
      >
        <Outlet />
      </ComponentProvider>
    </RouterContextProvider>
  )
}

export default AppRouterProvider
