import { FC } from 'react'

import { IconV2, Layout, ScopeTag, Tag } from '@/components'
import { PullRequest, Scope } from '@/views'
import { determineScope, getScopedPath } from '@components/scope/utils'
import { cn } from '@utils/cn'
import { LabelsList } from '@views/repo/pull-request/components/labels'

import { getPrState } from '../utils'

interface PullRequestItemTitleProps {
  pullRequest: PullRequest
  onLabelClick?: (labelId: number) => void
  scope: Scope
  showScope?: boolean
}

export const PullRequestItemTitle: FC<PullRequestItemTitleProps> = ({
  pullRequest,
  onLabelClick,
  scope,
  showScope
}) => {
  const { name, labels, state, is_draft: isDraft, comments, merged, repo } = pullRequest
  const { identifier: repoId, path: repoPath } = repo || {}
  const isSuccess = !!merged
  const repoScopeParams = { ...scope, repoIdentifier: repoId || '', repoPath: repoPath || '' }
  const scopeType = determineScope(repoScopeParams)
  const scopedPath = getScopedPath(repoScopeParams)

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full max-w-[calc(100%-82px)] items-center justify-start gap-1.5">
        <IconV2
          size="xs"
          className={cn({
            'text-icons-success': state === 'open' && !isDraft,
            'text-icons-1': state === 'open' && isDraft,
            'text-icons-danger': state === 'closed',
            'text-icons-merged': isSuccess
          })}
          name={getPrState(isDraft, merged, state).icon}
        />

        {repoId ? (
          <Layout.Flex gap="xs" align="center">
            <Tag value={repoId} showIcon icon="repository" />
            <p className="mr-1 truncate text-3 font-medium leading-snug">{name}</p>
            {showScope && scopeType ? <ScopeTag scopeType={scopeType} scopedPath={scopedPath} /> : null}
          </Layout.Flex>
        ) : (
          <p className="ml-0.5 mr-1 truncate text-3 font-medium leading-snug">{name}</p>
        )}

        {!!labels.length && (
          <LabelsList
            labels={labels}
            className="max-h-5 w-[max(400px,60%)] overflow-hidden"
            onClick={label => onLabelClick?.(label.id || 0)}
          />
        )}
      </div>

      {!!comments && (
        <div className="ml-auto flex items-center gap-1">
          <IconV2 className="text-icons-7" name="message" />
          <span className="text-1 leading-none text-cn-foreground-1">{comments}</span>
        </div>
      )}
    </div>
  )
}
