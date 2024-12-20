import { TypesSpace } from '@harnessio/code-service-client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@harnessio/ui/components'

interface ProjectSelectorProps {
  projects: TypesSpace[]
  onSelectProject: (projectId: string) => void
  preselectedProject?: string
}

function ProjectSelector({ preselectedProject, onSelectProject, projects }: ProjectSelectorProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-x-1.5">
        {preselectedProject ?? 'Project'}
        <Icon className="chevron-down text-icons-4" name="chevron-fill-down" size={6} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]">
        {projects.map(({ identifier }) => (
          <DropdownMenuItem
            className="flex flex-col"
            key={identifier}
            onClick={() => {
              if (identifier) {
                onSelectProject(identifier)
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

export default ProjectSelector
