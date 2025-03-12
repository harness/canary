import { useNavigate } from 'react-router-dom'

import { DropdownMenu, Icon, Text } from '@harnessio/ui/components'

import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

function ProjectDropdown(): JSX.Element {
  const routes = useRoutes()
  const spaceId = useGetSpaceURLParam()
  const navigate = useNavigate()
  const { spaces } = useAppContext()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-x-1.5" disabled={!spaces.length}>
        {spaceId ?? 'Select project'}
        <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[300px]">
        {spaces.map(({ identifier }) => (
          <DropdownMenu.Item
            className="flex flex-col"
            key={identifier}
            onClick={() => {
              if (identifier) {
                navigate(routes.toRepositories({ spaceId: identifier }))
              }
            }}
          >
            <Text className="inline-block w-full text-left">{identifier}</Text>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { ProjectDropdown }
