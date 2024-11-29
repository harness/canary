import { Icon } from '../../components/icon'
import { Text } from '../../components/text'

export const PullRequestListDescription = ({
  reviewRequired,
  number,
  // tasks,
  author,
  sourceBranch,
  timestamp
}: {
  number: number
  reviewRequired?: boolean
  tasks?: number
  author: string
  sourceBranch: string
  timestamp: string
}) => {
  return (
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px]">
      {!!number && <div className="flex items-center gap-1">#{number}</div>}

      <Text size={1} color="tertiaryBackground">
        opened {timestamp} by {author}
      </Text>

      <Text size={1} color="tertiaryBackground">
        {reviewRequired ? 'Review required' : 'Draft'}
      </Text>

      {/* TODO: where did tasks go?}
      {/* {typeof tasks !== 'undefined' && tasks > 0 && (
        <div className="flex gap-1 items-center">
          <Icon size={11} name={'tasks'} />
          <Text size={1} color="tertiaryBackground">
            {tasks} task{tasks === 1 ? '' : 's'}
          </Text>
        </div>
      )} */}
      {sourceBranch && (
        <div className="flex items-center gap-1">
          <Icon size={11} name="signpost" />
          <Text size={1} color="tertiaryBackground">
            {sourceBranch}
          </Text>
        </div>
      )}
    </div>
  )
}
