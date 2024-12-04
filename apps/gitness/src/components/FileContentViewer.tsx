import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { noop } from 'lodash-es'

import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Spacer,
  StackedList,
  Text,
  ToggleGroup,
  ToggleGroupItem
} from '@harnessio/canary'
import { OpenapiGetContentOutput, useFindRepositoryQuery } from '@harnessio/code-service-client'
import { MarkdownViewer, PipelineStudioToolbarActions, TopDetails, TopTitle } from '@harnessio/views'
import { CodeEditor } from '@harnessio/yaml-editor'

import { useDownloadRawFile } from '../framework/hooks/useDownloadRawFile'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import { themes } from '../pages/pipeline-edit/theme/monaco-theme'
import { timeAgoFromISOTime } from '../pages/pipeline-edit/utils/time-utils'
import { PathParams } from '../RouteDefinitions'
import { decodeGitContent, filenameToLanguage, formatBytes, getTrimmedSha, GitCommitAction } from '../utils/git-utils'
import GitBlame from './GitBlame'
import GitCommitDialog from './GitCommitDialog'

interface FileContentViewerProps {
  repoContent?: OpenapiGetContentOutput
}

export type ViewTypeValue = 'preview' | 'code' | 'blame'

const getDefaultView = (language?: string): ViewTypeValue => {
  return language && language === 'markdown' ? 'preview' : 'code'
}

export default function FileContentViewer({ repoContent }: FileContentViewerProps) {
  const fileName = repoContent?.name || ''
  const language = filenameToLanguage(fileName) || ''
  const fileContent = decodeGitContent(repoContent?.content?.data)
  const [view, setView] = useState<ViewTypeValue>(getDefaultView(language))
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false)
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const fullResourcePath = subResourcePath ? resourcePath + '/' + subResourcePath : resourcePath
  const downloadFile = useDownloadRawFile()
  const navigate = useNavigate()
  const rawURL = `/api/v1/repos/${repoRef}/raw/${fullResourcePath}?git_ref=${gitRef}`
  const latestFile = {
    user: {
      name: repoContent?.latest_commit?.author?.identity?.name || ''
    },
    lastCommitMessage: repoContent?.latest_commit?.message || '',
    timestamp: repoContent?.latest_commit?.author?.when
      ? timeAgoFromISOTime(repoContent?.latest_commit?.author.when)
      : '',
    sha: repoContent?.sha && getTrimmedSha(repoContent?.sha)
  }

  const themeConfig = useMemo(
    () => ({
      defaultTheme: 'dark',
      themes
    }),
    []
  )

  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const closeDialog = () => {
    setIsDeleteFileDialogOpen(false)
  }

  useEffect(() => {
    setView(getDefaultView(language))
  }, [language])

  const RightDetails = () => {
    return (
      <ButtonGroup.Root verticalAlign="center" spacing="2">
        <Text size={2} weight="normal" color="tertiaryBackground">
          {`${fileContent?.split('\n').length || 0} lines`}
        </Text>
        <Text size={2} weight="normal" color="tertiaryBackground">
          |
        </Text>
        <Text size={2} weight="normal" color="tertiaryBackground" className="pr-3">
          {formatBytes(repoContent?.content?.size || 0)}
        </Text>
        <PipelineStudioToolbarActions
          copyContent={fileContent}
          showEdit
          onDownloadClick={() => downloadFile({ repoRef, resourcePath: fullResourcePath || '', gitRef: gitRef || '' })}
          onEditClick={() => navigate(`/spaces/${spaceId}/repos/${repoId}/code/edit/${gitRef}/~/${fullResourcePath}`)}
          onCopyClick={noop}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm_icon">
              <Icon name="ellipsis" size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="flex items-center gap-1.5"
              onSelect={() => {
                const url = rawURL.replace('//', '/')
                window.open(url, '_blank')
              }}
            >
              <Icon name="arrow-long" size={12} className="text-tertiary-background" />
              <Text>View Raw</Text>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-1.5"
              onSelect={() => {
                setIsDeleteFileDialogOpen(true)
              }}
            >
              <Icon name="trash" size={12} className="text-primary" />
              <Text>Delete</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup.Root>
    )
  }

  const CodeView = () => {
    return useMemo(
      () => (
        <CodeEditor
          language={language}
          codeRevision={{ code: fileContent }}
          onCodeRevisionChange={() => {}}
          themeConfig={themeConfig}
          options={{
            readOnly: true
          }}
        />
      ),
      [language, fileContent, themeConfig]
    )
  }

  return (
    <>
      <GitCommitDialog
        open={isDeleteFileDialogOpen}
        onClose={closeDialog}
        commitAction={GitCommitAction.DELETE}
        gitRef={gitRef || ''}
        resourcePath={fullResourcePath || ''}
        onSuccess={(_commitInfo, isNewBranch, newBranchName) => {
          if (!isNewBranch) {
            navigate(`/spaces/${spaceId}/repos/${repoId}/code`)
          } else {
            navigate(
              `/spaces/${spaceId}/repos/${repoId}/pull-requests/compare/${repoMetadata?.default_branch}...${newBranchName}`
            )
          }
        }}
        defaultBranch={repoMetadata?.default_branch || ''}
        isNew={false}
      />
      <StackedList.Root>
        <StackedList.Item disableHover isHeader className="px-3 py-2.5">
          {latestFile ? (
            <>
              <StackedList.Field title={<TopTitle file={latestFile} />} />
              <StackedList.Field right title={<TopDetails file={latestFile} />} />
            </>
          ) : (
            <Text>No files available</Text>
          )}
        </StackedList.Item>
      </StackedList.Root>
      <Spacer size={5} />
      <StackedList.Root onlyTopRounded borderBackground>
        <StackedList.Item disableHover isHeader className="px-3 py-2.5">
          <ToggleGroup
            onValueChange={(value: ViewTypeValue) => {
              if (value) {
                setView(value)
              }
            }}
            value={view}
            type="single"
            unselectable={'on'}
            className={'bg-primary-foreground border-primary/10 rounded-lg border p-0.5'}
          >
            {language === 'markdown' && (
              <ToggleGroupItem
                value={'preview'}
                className="data-[state=on]:border-primary/10 h-7 rounded-md border border-transparent text-xs font-medium disabled:opacity-100"
              >
                Preview
              </ToggleGroupItem>
            )}
            <ToggleGroupItem
              value={'code'}
              className="data-[state=on]:border-primary/10 h-7 rounded-md border border-transparent text-xs font-medium disabled:opacity-100"
            >
              Code
            </ToggleGroupItem>
            <ToggleGroupItem
              value={'blame'}
              className="text-tertiary-background data-[state=on]:text-primary h-7 rounded-md border border-transparent text-xs font-medium data-[state=on]:border-white/10"
            >
              Blame
            </ToggleGroupItem>
          </ToggleGroup>
          <StackedList.Field right title={<RightDetails />} />
        </StackedList.Item>
      </StackedList.Root>
      {language === 'markdown' && view === 'preview' ? (
        <div className="border-border-background border-b border-l border-r px-2 py-2">
          <MarkdownViewer source={fileContent} />
        </div>
      ) : view === 'code' ? (
        <CodeView />
      ) : (
        <GitBlame
          selectedBranch={gitRef || ''}
          themeConfig={themeConfig}
          codeContent={fileContent}
          language={language}
        />
      )}
    </>
  )
}
