import { useNavigate } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

import { useAppContext } from '../framework/context/AppContext'

export const LandingPage = () => {
  const { spaces } = useAppContext()
  const navigate = useNavigate()

  return (
    <SandboxLayout.Main hasLeftPanel>
      <div className="flex h-full w-full flex-col place-content-center place-items-center gap-4 justify-center items-center">
        <div className="flex flex-col place-content-center place-items-center gap-2.5">
          <Text size={5} weight="medium">
            Select a project to get started
          </Text>
          <div className="flex flex-col">
            <Text size={2} weight="normal" align="center" color="tertiaryBackground">
              Projects contain your repositories and pipelines. To start using Gitness, select a project or create a new
              one.
            </Text>
          </div>
          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size={'lg'}>
                  <Text color="tertiary" className="mr-5">
                    Select Project
                  </Text>
                  <Icon name="chevron-down" size={15} className="chevron-down" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[180px]">
                {spaces?.length ? (
                  spaces.map(space => (
                    <DropdownMenuItem key={space.id} onClick={() => navigate(`${space.path}/repos`)}>
                      {space.identifier}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No projects available</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </SandboxLayout.Main>
  )
}
