import { Outlet } from 'react-router-dom'

import { SandboxLayout } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'

const RepoHeader: React.FC = () => {
  return (
    <>
      <SandboxLayout.Header>
        {/* The Breadcrumbs component need to be replaced with the new component that the PP team provides */}
        {/* Breadcrumbs is USING IMPORTS FROM CANARY & VIEWS, so ideally we should not have it in V2 */}
        {/* It is being included here as a TEMP solution until we get the new Breadcrumb component */}
        <Breadcrumbs />
      </SandboxLayout.Header>
      <Outlet />
    </>
  )
}

export { RepoHeader }
