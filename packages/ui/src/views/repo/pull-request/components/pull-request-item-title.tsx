import { FC, useMemo } from 'react'

import { IconV2, Layout, ScopeTag, Separator, Tag, Text } from '@/components'
import { cn } from '@/utils'
import { PullRequest, Scope } from '@/views'
import { determineScope, getScopedPath } from '@components/scope/utils'
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

  const iconColor = useMemo(() => {
    if (state === 'open' && !isDraft) {
      return 'success'
    } else if (state === 'open' && isDraft) {
      return 'inherit'
    } else if (state === 'closed') {
      return 'danger'
    } else if (isSuccess) {
      return 'merged'
    }
  }, [state, isDraft, isSuccess])

  return (
    <Layout.Horizontal gap="xs" justify="start" align="baseline">
      <IconV2 color={iconColor} className={cn('translate-y-0.5', {})} name={getPrState(isDraft, merged, state).icon} />

      <div className="[&>*:not(:last-child)]:mr-cn-xs">
        {repoId && <Tag className="align-bottom" value={repoId} icon="repository" theme="gray" />}
        {name && (
          <Text as="span" variant="heading-base" className="break-all">
            {name}
          </Text>
        )}
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
        <Layout.Horizontal className="ml-auto translate-y-0.5" as="span" gap="3xs">
          <IconV2 className="text-cn-foreground-2" name="pr-comment" />
          <Text variant="body-single-line-normal" color="foreground-1">
            {comments}
          </Text>
        </Layout.Horizontal>
      )}
    </Layout.Horizontal>
  )
}
