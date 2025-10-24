import { useEffect, useState } from 'react'

import { uniqWith } from 'lodash-es'

import { useGetBlameQuery } from '@harnessio/code-service-client'
import { Avatar, Layout, Text } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'
import { formatDistanceToNow, getInitials } from '@harnessio/ui/utils'
import { Contributors } from '@harnessio/ui/views'
import { BlameEditorV2, BlameEditorV2Props, ThemeDefinition } from '@harnessio/yaml-editor'
import { BlameItem } from '@harnessio/yaml-editor/dist/types/blame'

import { useThemeStore } from '../framework/context/ThemeContext'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { normalizeGitRef } from '../utils/git-utils'

interface GitBlameProps {
  themeConfig: { rootElementSelector?: string; defaultTheme?: string; themes?: ThemeDefinition[] }
  codeContent: string
  language: string
  height?: BlameEditorV2Props['height']
  toCommitDetails: ({ sha }: { sha: string }) => string
}

export default function GitBlame({ themeConfig, codeContent, language, height, toCommitDetails }: GitBlameProps) {
  const repoRef = useGetRepoRef()
  const { navigate } = useRouterContext()

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

        const { name, email } = commitInfo.author?.identity || { name: '', email: '' }

        blameData.push({
          fromLineNumber,
          toLineNumber,
          commitInfo: commitInfo,
          infoContent: (
            /* IMPORTANT: itemContent accepts only atomic component that are not depends on external state (e.g. context provider) */
            <Layout.Flex align="center" gapX="lg" className="pl-4">
              <Text style={{ width: '125px' }} truncate>
                {formatDistanceToNow(commitInfo.author?.when)}
              </Text>
              <Layout.Flex align="center" gapX="xs">
                <Avatar name={name} rounded title={name + '\n' + email} />
                <Text
                  style={{ width: '250px' }}
                  className="cursor-pointer hover:underline"
                  truncate
                  title={commitInfo.title}
                  onClick={() => {
                    navigate(toCommitDetails({ sha: commitInfo.sha }))
                  }}
                >
                  {commitInfo.title}
                </Text>
              </Layout.Flex>
            </Layout.Flex>
          )
        })

        fromLineNumber = toLineNumber + 1

        if (commit?.author?.identity?.name) {
          authors.push({ name: commit.author.identity.name ?? '', email: commit.author.identity.email ?? '' })
        }
      })

      setBlameBlocks(blameData)
      setContributors(uniqWith(authors, (a, b) => a.email === b.email))
    }
  }, [gitBlame, toCommitDetails, navigate])

  const { theme } = useThemeStore()
  const monacoTheme = (theme ?? '').startsWith('dark') ? 'dark' : 'light'

  if (isFetching || !blameBlocks.length) return null

  return (
    <Layout.Vertical className="h-full" gap="none">
      <Layout.Flex align="center" className="px-cn-md py-cn-sm border-x border-b">
        <Contributors contributors={contributors} />
      </Layout.Flex>
      <BlameEditorV2
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
  )
}
