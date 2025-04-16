import { Icon, NoData, SkeletonList, StackedList } from '../../../components'
import { Meter } from '../../../components/meter'
import { PipelineExecutionStatus } from '../common/execution-types'
import { ExecutionStatusIcon } from '../components/execution-status-icon'
import { IPipelineListProps } from './types'

const Title = ({ status, title }: { status?: PipelineExecutionStatus; title: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <ExecutionStatusIcon status={status} />
      <span className="text-16 truncate font-medium leading-snug">{title}</span>
    </div>
  )
}

const Description = ({ sha, description, version }: { sha?: string; description?: string; version?: string }) => {
  return (
    <div className="text-14 inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px] leading-tight">
      {description && <span className="text-cn-foreground-3 w-full overflow-hidden break-words">{description}</span>}
      {version && (
        <div className="flex items-center gap-1">
          <Icon size={11} name={'signpost'} />
          {version}
        </div>
      )}
      {sha && (
        <div className="bg-cn-background-8 text-12 text-cn-foreground-1 flex h-4 items-center gap-1 rounded px-1.5">
          <Icon className="text-icons-9" size={12} name={'tube-sign'} />
          {sha?.slice(0, 7)}
        </div>
      )}
    </div>
  )
}

export const PipelineList = ({
  pipelines,
  LinkComponent,
  handleResetQuery,
  isLoading,
  useTranslationStore,
  query,
  handleCreatePipeline,
  toPipelineDetails
}: IPipelineListProps) => {
  const noData = !pipelines || pipelines.length === 0

  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (noData) {
    return query ? (
      <StackedList.Root className="grow place-content-center">
        <div className="flex items-center justify-center">
          <NoData
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={[
              t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
              t('views:noData.changeSearch', 'or search for a different keyword.')
            ]}
            primaryButton={{
              label: t('views:noData.clearSearch', 'Clear search'),
              onClick: handleResetQuery
            }}
          />
        </div>
      </StackedList.Root>
    ) : (
      <div className="m-auto flex items-center justify-center">
        <NoData
          iconName="no-data-folder"
          title="No pipelines yet"
          description={['There are no pipelines in this project yet.', 'Create new one.']}
          primaryButton={{
            label: 'Create pipeline',
            onClick: handleCreatePipeline
          }}
        />
      </div>
    )
  }

  return (
    <StackedList.Root>
      {pipelines.map((pipeline, idx) => (
        <LinkComponent key={pipeline.id} to={toPipelineDetails?.(pipeline) || ''}>
          <StackedList.Item className="py-3" key={pipeline.name} isLast={pipelines.length - 1 === idx}>
            <StackedList.Field
              className="gap-y-1.5"
              title={<Title status={pipeline.status} title={pipeline.name || ''} />}
              description={
                <Description sha={pipeline.sha} description={pipeline.description} version={pipeline.version} />
              }
            />
            <StackedList.Field title={<Meter data={pipeline.meter} />} label secondary right />
          </StackedList.Item>
        </LinkComponent>
      ))}
    </StackedList.Root>
  )
}
