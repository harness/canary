import { cn } from '@utils/cn'

import { Icon } from '../../components/icon'
import { Text } from '../../components/text'

export const PullRequestListHeaderTitle = ({
  onCloseClick,
  onOpenClick,
  headerFilter,
  closedPRs,
  openPRs
}: {
  onOpenClick: () => void
  onCloseClick: () => void
  headerFilter: string
  closedPRs?: number
  openPRs?: number
}) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onOpenClick}
        className={cn('flex items-center gap-2', {
          'text-white': headerFilter === 'open',
          'text-tertiary-background': headerFilter === 'closed'
        })}
      >
        <Icon size={16} name="pr-open" />
        <Text
          color={headerFilter === 'open' ? 'primary' : headerFilter === 'closed' ? 'tertiaryBackground' : undefined}
          className={cn({
            'text-white': headerFilter === 'open',
            '!text-tertiary-background': headerFilter === 'closed'
          })}
          size={2}
          truncate
        >
          {openPRs} Open
        </Text>
      </button>
      <button
        onClick={onCloseClick}
        className={cn('flex items-center gap-2', {
          'text-white': headerFilter === 'closed',
          'text-tertiary-background': headerFilter === 'open'
        })}
      >
        <Icon size={12} name="tick" />
        <Text
          className={cn('flex items-center gap-2', {
            'text-white': headerFilter === 'closed',
            'text-tertiary-background': headerFilter === 'open'
          })}
          size={2}
          truncate
        >
          {closedPRs} Closed
        </Text>
      </button>
    </div>
  )
}
