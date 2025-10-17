import { Avatar, Button, DropdownMenu, IconV2 } from '@/components'
import { useRouterContext } from '@/context'
import { noop } from 'lodash-es'

import { RouteDefinitions } from './types'

export default function AvatarDropdown({ routes }: { routes?: RouteDefinitions }) {
  const { Link } = useRouterContext()
  const user = {
    name: 'John Doe',
    email: 'john.doe@gmail.com'
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="sm" rounded className="pl-0 pr-cn-xs">
          <Avatar rounded name={user?.name || user?.email} size="md" />
          <IconV2 name="nav-arrow-down" size="2xs" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <Link to={routes?.toUserProfile({ accountId: 'accountId' }) ?? ''}>
          <DropdownMenu.IconItem icon="user" title="Profile" className="cursor-pointer" />
        </Link>
        <DropdownMenu.Separator />
        <DropdownMenu.IconItem
          icon="docs"
          title="Documentation"
          className="cursor-pointer"
          onClick={() => window.open('https://developer.harness.io/docs/', '_blank')}
        />
        <DropdownMenu.IconItem
          icon="shield"
          title="Privacy"
          className="cursor-pointer"
          onClick={() => window.open('https://www.harness.io/legal/privacy', '_blank')}
        />
        <DropdownMenu.Separator />

        <DropdownMenu.IconItem icon="logout" title="Logout" className="cursor-pointer" onClick={noop} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
