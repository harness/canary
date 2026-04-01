import { type FC } from 'react'

import { cn } from '@harnessio/ui/utils'

import type { AppShellHeaderProps } from '../types/app-shell-types'

/** Optional full-width region above the shell body (nav + main). Omit children to render nothing. */
export const AppShellHeader: FC<AppShellHeaderProps> = ({ children, className }) => {
  if (children == null) {
    return null
  }
  return <header className={cn('app-shell-header flex-shrink-0', className)}>{children}</header>
}
