import { FC } from 'react'

import { Icon } from '@/components'
import { PullRequestType } from '@/views'
import { cn } from '@utils/cn'
import { LabelsList } from '@views/repo/pull-request/components/labels'

import { getPrState } from '../utils'

interface PullRequestItemTitleProps {
  pullRequest: PullRequestType
}

export const PullRequestItemTitle: FC<PullRequestItemTitleProps> = ({ pullRequest }) => {
  const { name, labels, state, is_draft: isDraft, comments, merged } = pullRequest
  const isSuccess = !!merged

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full max-w-[calc(100%-82px)] items-center justify-start gap-1.5">
        <Icon
          size={14}
          className={cn({
            'text-icons-success': state === 'open' && !isDraft,
            'text-icons-1': state === 'open' && isDraft,
            'text-icons-danger': state === 'closed',
            'text-icons-merged': isSuccess
          })}
          name={getPrState(isDraft, merged, state).icon}
        />

        <p className="ml-0.5 mr-1 truncate text-3 font-medium leading-snug">{name}</p>

        {!!labels.length && <LabelsList labels={labels} className="max-h-5 w-[max(400px,60%)] overflow-hidden" />}
      </div>

      {!!comments && (
        <div className="ml-auto flex items-center gap-1">
          <Icon className="text-icons-7" size={16} name="comments" />
          <span className="text-1 leading-none text-cn-foreground-1">{comments}</span>
        </div>
      )}
    </div>
  )
}
