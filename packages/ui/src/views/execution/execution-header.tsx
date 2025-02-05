import { Breadcrumb, Text } from '@/components'
import { ExecutionState } from '@views/repo/pull-request'

import { PipelineStatus } from './pipeline-status'

interface ExecutionHeaderProps {
  commitName: string
  branchName: string
  title: { number: string; title: string }
  storage: string
  storageAverage: string
  simpleOperation: string
  advancedOperations: string
  dataTransfer: string
  branch: string
  commit: string
  status: ExecutionState
  buildTime: string
  createdTime: string
  pipelineName: string
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({
  title,
  storage,
  storageAverage,
  simpleOperation,
  advancedOperations,
  dataTransfer,
  branch,
  commit,
  status,
  buildTime,
  createdTime,
  pipelineName
}) => {
  return (
    <div className="space-y-4 px-6 py-4">
      <div className="flex flex-col gap-2">
        {/* Breadcrumbs */}
        <Breadcrumb.Root className="mb-4 select-none">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/pipelines">Pipeline list</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Page>{pipelineName}</Breadcrumb.Page>
          </Breadcrumb.List>
        </Breadcrumb.Root>

        {/* <div className="flex gap-2">
          <Button variant="secondary" size="xs" asChild>
            <Link to="/">
              <Icon name="tube-sign" size={12} className="mr-1 text-tertiary-background" />
              {commitName}
            </Link>
          </Button>
          <span className="text-foreground-1"> to </span>
          <Button variant="secondary" size="xs" asChild>
            <Link to="/">
              <Icon name="branch" size={12} className="mr-1 text-tertiary-background" />
              {branchName}
            </Link>
          </Button>
        </div> */}
        <Text size={5}>
          <span className="text-foreground-5">#{title.number} </span>
          <span className="text-primary">{title.title}</span>
        </Text>
      </div>

      <div className="flex w-full items-center justify-between ">
        <PipelineStatus
          branch={branch}
          commit={commit}
          status={status}
          buildTime={buildTime}
          createdTime={createdTime}
        />
        <div className="flex h-full items-end gap-12">
          <div className="flex flex-col">
            <span className="text-foreground-5">Storage</span>
            <span className="text-primary">{storage}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground-5">Storage (average)</span>
            <span className="text-primary">{storageAverage}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground-5">Simple Operation</span>
            <span className="text-primary">{simpleOperation}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground-5">Advanced Operations</span>
            <span className="text-primary">{advancedOperations}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground-5">Data Transfer</span>
            <span className="text-primary">{dataTransfer}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
