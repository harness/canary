import { Breadcrumb } from '@harnessio/ui/components'
import { Topbar } from '@harnessio/views'

import PipelineStudioHeaderActions from './pipeline-studio-header-actions'

// TODO: this component is not in use
export function PipelineStudioHeader(): JSX.Element {
  return (
    <Topbar.Root>
      <Topbar.Left>
        {/** TODO: common component */}
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/">harness-next</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Page>
              <Breadcrumb.Link href="/components">pipeline.yml</Breadcrumb.Link>
            </Breadcrumb.Page>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Topbar.Left>
      <Topbar.Right>
        <PipelineStudioHeaderActions />
      </Topbar.Right>
    </Topbar.Root>
  )
}
