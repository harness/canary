import { Outlet } from 'react-router-dom'

import { SandboxLayout } from '@harnessio/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'

const RepoHeader: React.FC = () => {
  return (
    <>
      <SandboxLayout.Header>
        <Breadcrumbs />
      </SandboxLayout.Header>
      <Outlet />
    </>
  )
}

export { RepoHeader }
