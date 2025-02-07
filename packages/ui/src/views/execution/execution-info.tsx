import { StepExecution } from './step-execution'
import { ExecutionInfoProps } from './types'

export const ExecutionInfo: React.FC<ExecutionInfoProps> = ({
  useLogsStore,
  onEdit,
  onDownload,
  onCopy
}): React.ReactElement => {
  const { logs } = useLogsStore()

  return <StepExecution logs={logs} onEdit={onEdit} onDownload={onDownload} onCopy={onCopy} />
}
