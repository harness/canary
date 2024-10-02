import React from 'react'
import { Outlet } from 'react-router-dom'
import { SandboxLayout } from '@harnessio/playground'
import { Topbar, Text } from '@harnessio/canary'
import { TopBarWidget, Project } from '@harnessio/playground'
import { useNavigate } from 'react-router-dom'
import { TypesMembershipSpace } from '@harnessio/code-service-client'
import { useAppContext } from '../../framework/context/AppContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'

const SandboxRepoHeader: React.FC = () => {
  const navigate = useNavigate()
  const space = useGetSpaceURLParam()
  const { spaces } = useAppContext()

  const projectsItem =
    spaces?.map((space: TypesMembershipSpace) => ({
      id: space?.space?.id,
      name: space?.space?.path
    })) || []

  if (projectsItem.length === 0) {
    return (
      <SandboxLayout.Header>
        <Topbar.Root>
          <Topbar.Left>
            <Text size={2} weight="medium" className="text-primary">
              Please create a new project
            </Text>
          </Topbar.Left>
        </Topbar.Root>
      </SandboxLayout.Header>
    )
  }

  return (
    <>
      <SandboxLayout.Header>
        <TopBarWidget
          projects={projectsItem}
          onSelectProject={(selectedProject: Project) => {
            if (selectedProject?.name) {
              navigate(`/sandbox/spaces/${selectedProject.name}/repos`)
            }
          }}
          preselectedProject={projectsItem.find(item => item.name === space)}
        />
      </SandboxLayout.Header>
      <Outlet />
    </>
  )
}

export { SandboxRepoHeader }
