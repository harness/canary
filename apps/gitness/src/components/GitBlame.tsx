import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useGetBlameQuery } from '@harnessio/code-service-client'
import { getInitials } from '@harnessio/views'
import { BlameEditor, ThemeDefinition } from '@harnessio/yaml-editor'
import { BlameItem } from '@harnessio/yaml-editor/dist/types/blame'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { timeAgoFromISOTime } from '../pages/pipeline-edit/utils/time-utils'
import { PathParams } from '../RouteDefinitions'
import { normalizeGitRef } from '../utils/git-utils'

interface GitBlameProps {
  selectedBranch: string
  themeConfig: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  codeContent: string
  language: string
}

export default function GitBlame({ selectedBranch, themeConfig, codeContent, language }: GitBlameProps) {
  const repoRef = useGetRepoRef()
  const { resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? resourcePath + '/' + subResourcePath : resourcePath
  const [blameBlocks, setBlameBlocks] = useState<BlameItem[]>([])

  const { data: { body: gitBlame } = {}, isFetching } = useGetBlameQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(selectedBranch) }
  })

  useEffect(() => {
    if (gitBlame) {
      let fromLineNumber = 1
      const blameData: BlameItem[] = []

      gitBlame?.forEach(({ commit, lines }) => {
        const toLineNumber = fromLineNumber + (lines?.length || 0) - 1

        const authorInfo = {
          identity: { ...commit?.author?.identity },
          when: timeAgoFromISOTime(commit?.author?.when || ''),
          initials: getInitials(commit?.author?.identity?.name || commit?.author?.identity?.email || '')
        }

        const commitInfo = {
          sha: commit?.sha || '',
          title: commit?.title || '',
          author: authorInfo || {}
        }

        blameData.push({
          fromLineNumber,
          toLineNumber,
          commitInfo: commitInfo
        })

        fromLineNumber = toLineNumber + 1
      })

      setBlameBlocks(blameData)
    }
  }, [gitBlame])

  return !isFetching && blameBlocks.length ? (
    <BlameEditor
      code={codeContent}
      language={language}
      themeConfig={themeConfig}
      lineNumbersPosition="center"
      blameData={blameBlocks}
    />
  ) : (
    <></>
  )
}
