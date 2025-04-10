import { useSidebar } from '@harnessio/ui/components'

import { Breadcrumbs, BreadcrumbsProps } from './breadcrumbs'

export const AppBreadcrumbs = (props: Omit<BreadcrumbsProps, 'isMobile'>) => {
  const { isMobile } = useSidebar()

  return <Breadcrumbs isMobile={isMobile} {...props} />
}
