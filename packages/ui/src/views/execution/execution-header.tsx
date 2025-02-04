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
}

export const ExecutionHeader: React.FC<ExecutionHeaderProps> = ({
  title,
  storage,
  storageAverage,
  simpleOperation,
  advancedOperations,
  dataTransfer
}) => {
  return (
    <div className="px-6 py-4 space-y-4">
      <div className="flex flex-col gap-2">
        {/* Breadcrumbs */}
        <Breadcrumb.Root className="select-none mb-4">
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="#">Pipeline list</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Page>build scan push test - k8s - Clone 2</Breadcrumb.Page>
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
          branch="master"
          commit="b8bruh99h"
          status={ExecutionState.RUNNING}
          buildTime="1h 30m"
          createdTime="10 mins ago"
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
