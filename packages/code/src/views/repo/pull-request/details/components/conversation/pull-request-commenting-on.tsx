import { SideWithBoth } from '@views/repo/pull-request/components/extended-diff-view/extended-diff-view-types'

import { Text } from '@harnessio/ui/components'

export interface PullRequestCommentingOnProps {
  from?: number
  to?: number
  fromSide?: SideWithBoth
  toSide?: SideWithBoth
}

export const PullRequestCommentingOn = ({ from, to, fromSide, toSide }: PullRequestCommentingOnProps) => {
  if (!from || !to) {
    return null
  }

  return (
    <Text className="text-cn-3">
      Commenting on lines <LineNumberColored line={from} side={fromSide} /> to{' '}
      <LineNumberColored line={to} side={toSide} />
    </Text>
  )
}

function LineNumberColored({ line, side }: { line: number; side?: SideWithBoth }) {
  let className

  switch (side) {
    case 'new':
      className = 'text-cn-success'
      break
    case 'old':
      className = 'text-cn-warning'
      break
    case 'both':
    default:
      className = 'text-cn-3'
  }

  return (
    <Text className={className} as="span">
      {line}
    </Text>
  )
}
