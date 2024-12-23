import { Outlet } from 'react-router-dom'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'

const PipelineLayout = () => {
  return (
    <>
      <div className="sticky top-0 z-40 bg-background-1">
        <Breadcrumbs />
      </div>
      <Outlet />
    </>
  )
}

export default PipelineLayout
