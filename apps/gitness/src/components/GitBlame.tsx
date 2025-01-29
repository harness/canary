import { useEffect, useState } from 'react'

import { useGetBlameQuery } from '@harnessio/code-service-client'
import { getInitials } from '@harnessio/views'
import { BlameEditor, BlameEditorProps, ThemeDefinition } from '@harnessio/yaml-editor'
import { BlameItem } from '@harnessio/yaml-editor/dist/types/blame'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { timeAgoFromISOTime } from '../pages/pipeline-edit/utils/time-utils'
import { normalizeGitRef } from '../utils/git-utils'

interface GitBlameProps {
  themeConfig: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  codeContent: string
  language: string
  height?: BlameEditorProps['height']
}

export default function GitBlame({ themeConfig, codeContent, language, height }: GitBlameProps) {
  const repoRef = useGetRepoRef()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const [blameBlocks, setBlameBlocks] = useState<BlameItem[]>([])

  const { data: { body: gitBlame } = {}, isFetching } = useGetBlameQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef) }
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
      height={height ? height : undefined}
    />
  ) : (
    <></>
  )
}
