import { Icon, NoData, SkeletonList, StackedList } from '../../../components'
import { Meter } from '../../../components/meter'
import { PipelineExecutionStatus } from '../common/execution-types'
import { ExecutionStatusIcon } from '../components/execution-status-icon'
import { IPipelineListProps } from './types'

const Title = ({ status, title }: { status?: PipelineExecutionStatus; title: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <ExecutionStatusIcon status={status} />
      <span className="truncate text-16 font-medium leading-snug">{title}</span>
    </div>
  )
}

const Description = ({ sha, description, version }: { sha: string; description: string; version: string }) => {
  return (
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px] text-14 leading-tight">
      {description && <span className="w-full overflow-hidden break-words text-foreground-3">{description || ''}</span>}
      {version && (
        <div className="flex items-center gap-1">
          <Icon size={11} name={'signpost'} />
          {version}
        </div>
      )}
      {sha && (
        <div className="flex h-4 items-center gap-1 rounded bg-background-8 px-1.5 text-12 text-foreground-8">
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
      <StackedList.Root>
        <div className="flex min-h-[50vh] items-center justify-center py-20">
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
      <div className="flex min-h-[70vh] items-center justify-center py-20">
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
                <Description
                  sha={pipeline.sha || ''}
                  description={pipeline.description || ''}
                  version={pipeline.version || ''}
                />
              }
            />
            <StackedList.Field title={<Meter data={pipeline.meter} />} label secondary right />
          </StackedList.Item>
        </LinkComponent>
      ))}
    </StackedList.Root>
  )
}
