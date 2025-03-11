import { Outlet } from 'react-router-dom'

import { cn } from '@harnessio/canary'

import { Toaster } from '../../components-v2/toaster'
import { useRepoImportEvents } from '../../framework/hooks/useRepoImportEvent'
import Breadcrumbs from './breadcrumbs'

export const AppShell = ({ children }: { children?: React.ReactNode }) => {
  useRepoImportEvents()

  return (
    <>
      <BreadcrumbsAndOutlet className="min-h-screen text-foreground-2">{children}</BreadcrumbsAndOutlet>
      <Toaster />
    </>
  )
}

function BreadcrumbsAndOutlet({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn('h-full flex flex-col', className)}>
      <div className="layer-high sticky top-0 bg-background-1">
        <Breadcrumbs />
      </div>
      {/* Render Outlet for v6, or children for v5 */}
      {children ? children : <Outlet />}
    </div>
  )
}
