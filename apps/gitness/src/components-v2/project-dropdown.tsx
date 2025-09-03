import { useNavigate, useParams } from 'react-router-dom'

import { DropdownMenu, IconV2 } from '@harnessio/ui/components'

import { useAppContext } from '../framework/context/AppContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { PathParams } from '../RouteDefinitions'

function ProjectDropdown(): JSX.Element {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const navigate = useNavigate()
  const { spaces } = useAppContext()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5" disabled={!spaces.length}>
        {spaceId ?? 'Select project'}
        <IconV2 className="text-cn-2" name="nav-arrow-down" size="xs" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[300px]">
        {spaces.map(({ identifier }) => (
          <DropdownMenu.Item
            title={identifier}
            key={identifier}
            onClick={() => {
              if (identifier) {
                navigate(routes.toRepositories({ spaceId: identifier }))
              }
            }}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { ProjectDropdown }
