import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { usePublicAccess } from '../breadcrumbs/usePublicAccess'
import PageNotPublic from './PageNotPublic'

interface PublicAccessGuardProps {
  children?: ReactNode
}

export const PublicAccessGuard: React.FC<PublicAccessGuardProps> = ({ children }) => {
  const { shouldShowPageNotPublic, currentPath } = usePublicAccess()

  if (shouldShowPageNotPublic) {
    return <PageNotPublic currentPath={currentPath} />
  }

  return children ? <>{children}</> : <Outlet />
}

export default PublicAccessGuard

