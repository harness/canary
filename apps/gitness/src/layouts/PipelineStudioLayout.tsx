import { Outlet } from 'react-router-dom'

import { SandboxLayout } from '@harnessio/views'

import Breadcrumbs from '../components/breadcrumbs/breadcrumbs'

const PipelineLayout: React.FC = () => {
  return (
    <>
      <SandboxLayout.Header>
        <Breadcrumbs />
      </SandboxLayout.Header>
      <Outlet />
    </>
  )
}

export default PipelineLayout
