import { Outlet } from 'react-router-dom'

import { SandboxLayout } from '@harnessio/views'

import Breadcrumbs from '../components/breadcrumbs/breadcrumbs'

const ProjectLayout: React.FC = () => {
  return (
    <>
      <SandboxLayout.Header>
        <Breadcrumbs />
      </SandboxLayout.Header>
      <Outlet />
    </>
  )
}

export default ProjectLayout