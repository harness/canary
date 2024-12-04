import { useState } from 'react'

import {
  Button,
  ButtonGroup,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  SpotlightsBG,
  Text
} from '@harnessio/canary'

export interface Project {
  id?: number
  name?: string
}

interface HomeProps {
  title: string
  isAuthed: boolean
  projects?: Project[]
  onSelectProject?: (projectName: string) => void
  handleSignIn?: () => void
  handleSignUp?: () => void
}

export const Home: React.FC<HomeProps> = ({
  title,
  isAuthed,
  projects,
  onSelectProject,
  handleSignIn,
  handleSignUp
}) => {
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')

  const handleSelectProject = (projectName: string) => {
    setSelectedProject(projectName)
    setOpen(false)
    onSelectProject?.(projectName)
  }

  if (isAuthed) {
    return (
      <SpotlightsBG.Root>
        <SpotlightsBG.Content>
          <Text size={6} weight="medium" align="center" className="text-primary">
            {title}
          </Text>
          <Spacer size={2} />
          <Text size={3} weight="normal" align="center" className="text-tertiary-background">
            Welcome back
          </Text>
          <Spacer size={6} />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="self-center" asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                {selectedProject
                  ? projects?.find(project => project.name === selectedProject)?.name
                  : 'Select your project...'}
                <Icon name="chevron-down" size={12} className="chevron-down" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search projects..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects?.map(project => (
                      <CommandItem
                        key={project.id}
                        value={project.name}
                        onSelect={() => {
                          if (project.name) {
                            handleSelectProject(project.name)
                          }
                        }}
                      >
                        {project.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </SpotlightsBG.Content>
      </SpotlightsBG.Root>
    )
  }

  return (
    <SpotlightsBG.Root>
      <SpotlightsBG.Content>
        <Text size={6} weight="medium" align="center" className="text-primary">
          Canary Playground
        </Text>
        <Spacer size={2} />
        <Text size={3} weight="normal" align="center" className="text-tertiary-background">
          The next generation of design at Harness
        </Text>
        <Spacer size={9} />
        <ButtonGroup.Root direction="vertical" className="w-full self-center">
          <Button variant="default" onClick={handleSignUp}>
            Sign up
          </Button>
          <Button variant="outline" onClick={handleSignIn}>
            Sign in
          </Button>
        </ButtonGroup.Root>
      </SpotlightsBG.Content>
    </SpotlightsBG.Root>
  )
}
