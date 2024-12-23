import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@harnessio/canary'
import { Topbar } from '@harnessio/views'

import PipelineStudioHeaderActions from './pipeline-studio-header-actions'

// TODO: this component is not in use
export function PipelineStudioHeader(): JSX.Element {
  return (
    <Topbar.Root>
      <Topbar.Left>
        {/** TODO: common component */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">harness-next</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="font-thin">/</BreadcrumbSeparator>
            <BreadcrumbPage>
              <BreadcrumbLink href="/components">pipeline.yml</BreadcrumbLink>
            </BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar.Left>
      <Topbar.Right>
        <PipelineStudioHeaderActions />
      </Topbar.Right>
    </Topbar.Root>
  )
}
