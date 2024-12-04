import { Link } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Topbar
} from '@harnessio/canary'

import { Project } from '../home'

export interface TopBarWidgetProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
}
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export const TopBarWidget = (props: TopBarWidgetProps): React.ReactElement => {
  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={'/'}>Repo</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={'/'}>Pipeline</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar.Left>
    </Topbar.Root>
  )
}
