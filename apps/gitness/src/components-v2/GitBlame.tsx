import { useEffect, useState } from 'react'

import { uniqWith } from 'lodash-es'

import { useGetBlameQuery } from '@harnessio/code-service-client'
import { Layout } from '@harnessio/ui/components'
import { getInitials } from '@harnessio/ui/utils'
import { Contributors } from '@harnessio/ui/views'
import { BlameEditor, BlameEditorProps, ThemeDefinition } from '@harnessio/yaml-editor'
import { BlameItem } from '@harnessio/yaml-editor/dist/types/blame'

import { useThemeStore } from '../framework/context/ThemeContext'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
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

  const [contributors, setContributors] = useState<{ name: string; email: string }[]>([])

  const { data: { body: gitBlame } = {}, isFetching } = useGetBlameQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef) }
  })

  useEffect(() => {
    if (gitBlame) {
      let fromLineNumber = 1
      const blameData: BlameItem[] = []
      const authors: { name: string; email: string }[] = []

      gitBlame?.forEach(({ commit, lines }) => {
        const toLineNumber = fromLineNumber + (lines?.length || 0) - 1

        const authorInfo = {
          identity: { ...commit?.author?.identity },
          when: commit?.author?.when ?? '',
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

        if (commit?.author?.identity?.name) {
          authors.push({ name: commit.author.identity.name ?? '', email: commit.author.identity.email ?? '' })
        }
      })

      setBlameBlocks(blameData)
      setContributors(uniqWith(authors, (a, b) => a.email === b.email))
    }
  }, [gitBlame])

  const { theme } = useThemeStore()
  const monacoTheme = (theme ?? '').startsWith('dark') ? 'dark' : 'light'

  return !isFetching && blameBlocks.length ? (
    <Layout.Vertical className="h-full" gap="none">
      <div className="flex items-center border-x border-b px-cn-md py-cn-sm">
        <Contributors contributors={contributors} />
      </div>
      <BlameEditor
        code={codeContent}
        language={language}
        themeConfig={themeConfig}
        lineNumbersPosition="center"
        blameData={blameBlocks}
        height={height ? height : undefined}
        theme={monacoTheme}
        className="flex h-full grow"
      />
    </Layout.Vertical>
  ) : (
    <></>
  )
}
