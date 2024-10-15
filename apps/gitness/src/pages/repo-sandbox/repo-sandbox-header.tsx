import React, { useState, useEffect } from 'react'
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
  const [projects, setProjects] = useState<Project[]>([{ id: 'create-project', name: 'Create project' }])
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined)

  useEffect(() => {
    if (spaces.length > 0) {
      setProjects((existingProjects: Project[]) =>
        /* dedupe items */
        Array.from(
          new Map(
            [...spaces.map(space => ({ id: space.id, name: space.path })), ...existingProjects].map(project => [
              project.id,
              project
            ])
          ).values()
        )
      )
    }
  }, [spaces])

  useEffect(() => setSelectedProject(projects.find(item => item.name === space)), [space, projects])

  return (
    <>
      <SandboxLayout.Header>
        <TopBarWidget
          projects={projects}
          onSelectProject={(project: Project) => {
            setSelectedProject(project)
            if (project?.id === 'create-project') {
              navigate('/create-project')
            } else if (project?.name) {
              navigate(`/${project.name}/repos`)
            }
          }}
          selectedProject={selectedProject}
          preselectedProject={selectedProject}
        />
      </SandboxLayout.Header>
      <Outlet />
    </>
  )
}

export { SandboxRepoHeader }
