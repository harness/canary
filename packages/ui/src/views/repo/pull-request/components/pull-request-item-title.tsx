import { FC } from 'react'

import { IconV2, Layout, ScopeTag, Separator, Tag, Text } from '@/components'
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
    <Layout.Horizontal gap="xs" justify="start" align="baseline">
      <IconV2
        className={cn('translate-y-0.5', {
          'text-icons-success': state === 'open' && !isDraft,
          'text-icons-1': state === 'open' && isDraft,
          'text-icons-danger': state === 'closed',
          'text-icons-merged': isSuccess
        })}
        name={getPrState(isDraft, merged, state).icon}
      />

      <div className="[&>*:not(:last-child)]:mr-cn-xs">
        {repoId && <Tag className="align-bottom" value={repoId} icon="repository" theme="gray" />}

        <Text as="span" variant="heading-base" className="break-all">
          {name}
        </Text>

        {!!showScope && !!scopeType && (
          <>
            <ScopeTag className="align-bottom" scopeType={scopeType} scopedPath={scopedPath} />
            {!!labels.length && <Separator className="h-3.5 inline-flex align-middle" orientation="vertical" />}
          </>
        )}

        {!!labels.length && (
          <LabelsList labels={labels} className="!inline-flex" onClick={label => onLabelClick?.(label.id || 0)} />
        )}
      </div>

      {!!comments && (
        <Layout.Horizontal gap="3xs" className="ml-auto translate-y-0.5">
          <IconV2 className="text-cn-foreground-2" name="pr-comment" />
          <Text variant="body-single-line-normal" color="foreground-1">
            {comments}
          </Text>
        </Layout.Horizontal>
      )}
    </Layout.Horizontal>
  )
}
