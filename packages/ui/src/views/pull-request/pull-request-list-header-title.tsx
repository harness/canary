import { cn } from '@utils/cn'

import { Icon } from '../../components/icon'
import { Text } from '../../components/text'

export const PullRequestListHeaderTitle = ({
  setHeaderFilter,
  headerFilter,
  closed_prs,
  open_prs
}: {
  setHeaderFilter: (state: string) => void
  headerFilter: string
  closed_prs?: number
  open_prs?: number
}) => {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setHeaderFilter('open')}
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
          {open_prs} Open
        </Text>
      </button>
      <button
        onClick={() => setHeaderFilter('closed')}
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
          {closed_prs} Closed
        </Text>
      </button>
    </div>
  )
}
