import { FC } from 'react'

import { IconV2, Layout, ScopeTag, Tag, Text } from '@/components'
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
    <Layout.Horizontal gap="xs" align="center" justify="start">
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

      <Layout.Flex gap="xs" align="center">
        {repoId && <Tag value={repoId} showIcon icon="repository" theme="gray" />}
        <Text variant="heading-base">{name}</Text>
        {showScope && scopeType ? <ScopeTag scopeType={scopeType} scopedPath={scopedPath} /> : null}
      </Layout.Flex>

      {!!labels.length && (
        <LabelsList
          labels={labels}
          className="max-h-5 overflow-hidden"
          onClick={label => onLabelClick?.(label.id || 0)}
        />
      )}
      {!!comments && (
        <Layout.Horizontal gap="2xs" className="ml-auto" align="center">
          <IconV2 className="text-icons-7" name="message" />
          <Text variant="body-single-line-normal">{comments}</Text>
        </Layout.Horizontal>
      )}
    </Layout.Horizontal>
  )
}
