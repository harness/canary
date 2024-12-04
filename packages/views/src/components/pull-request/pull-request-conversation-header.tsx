/*
 * Copyright 2023 Harness, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Badge, Button, Icon, Text } from '@harnessio/canary'

import { timeAgo } from '../../utils/utils'
import { Layout } from '../layout/layout'
import { IconType } from './interfaces'
import { getPrState } from './utils'

interface PullRequestTitleProps {
  data: {
    title?: string
    number?: number
    merged?: number | null | undefined
    author?: { display_name?: string; email?: string }
    stats?: { commits?: number | null }
    target_branch?: string
    source_branch?: string
    created?: number
    is_draft?: boolean
    state?: string
    spaceId?: string
    repoId?: string
  }
}

export const PullRequestHeader: React.FC<PullRequestTitleProps> = ({
  data: {
    title,
    number,
    merged,
    author,
    stats,
    target_branch,
    source_branch,
    created,
    is_draft,
    state,
    spaceId,
    repoId
  }
}) => {
  const [original] = useMemo(() => [title], [title])

  // Format the parsed date as relative time from now
  const formattedTime = timeAgo(created || 0)

  const stateObject = getPrState(is_draft, merged, state)
  return (
    <div className="flex flex-col gap-2 pb-8">
      <div className="flex items-center py-1">
        <Text size={5} weight={'medium'} className="text-primary">
          {original}
          &nbsp;&nbsp;
          <span className="text-tertiary-background font-normal">#{number}</span>
        </Text>
      </div>
      <div className="">
        <div className="text-tertiary-background flex space-x-2">
          <div className="flex items-center gap-2.5 text-center align-middle">
            <Badge disableHover borderRadius="full" className={`select-none justify-center`}>
              <Layout.Horizontal gap="space-x-1" className="flex items-center align-middle">
                <Icon name={stateObject.icon as IconType} size={13} />
                &nbsp;{stateObject.text}
              </Layout.Horizontal>
            </Badge>
            <div className="flex gap-2">
              <Text
                size={2}
                className="text-tertiary-background inline-flex flex-wrap items-center gap-1"
                weight="normal"
              >
                <span className="text-primary">{author?.display_name || author?.email || ''}</span>
                <span>{merged ? 'merged' : ' wants to merge'}</span>
                <span className="text-primary">
                  {stats?.commits} {stats?.commits === 1 ? 'commit' : 'commits'}
                </span>
                <span>into</span>
                <Button variant="secondary" size="xs" asChild>
                  <Link to={`/spaces/${spaceId}/repos/${repoId}/code/${target_branch}`}>
                    <Icon name="branch" size={12} className="text-tertiary-background mr-1" />
                    {target_branch}
                  </Link>
                </Button>
                <span>from</span>
                <Button asChild variant="secondary" size="xs">
                  <Link to={`/spaces/${spaceId}/repos/${repoId}/code/${source_branch}`}>
                    <Icon name="branch" size={12} className="text-tertiary-background mr-1" />
                    {source_branch}
                  </Link>
                </Button>
                <span>&nbsp;|&nbsp;</span>
                <span className="time">{formattedTime}</span>
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
