import { useNavigate, useParams } from 'react-router-dom'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@harnessio/ui/components'

import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { PathParams } from '../../RouteDefinitions'

function ProjectDropdown(): JSX.Element {
  const routes = useRoutes()
  const { spaceId } = useParams<PathParams>()
  const navigate = useNavigate()
  const { spaces } = useAppContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-x-1.5" disabled={!spaces.length}>
        {spaceId ?? 'Select project'}
        <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        {spaces.map(({ identifier }) => (
          <DropdownMenuItem
            className="flex flex-col"
            key={identifier}
            onClick={() => {
              if (identifier) {
                navigate(routes.toRepositories({ spaceId: identifier }))
              }
            }}
          >
            <Text className="inline-block w-full text-left">{identifier}</Text>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { ProjectDropdown }
