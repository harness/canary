import { useEffect, useMemo, useState } from 'react'
import { CodeEditor } from '@harnessio/yaml-editor'
import { themes } from '../pages/pipeline-edit/theme/monaco-theme'
import copy from 'clipboard-copy'
import { decodeGitContent, filenameToLanguage, formatBytes, getTrimmedSha } from '../utils/git-utils'
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
import { timeAgoFromISOTime } from '../pages/pipeline-edit/utils/time-utils'
import { MarkdownViewer, PipelineStudioToolbarActions, TopDetails, TopTitle } from '@harnessio/playground'
import { OpenapiGetContentOutput } from '@harnessio/code-service-client'

interface FileContentViewerProps {
  repoContent: OpenapiGetContentOutput
}

export type ViewTypeValue = 'preview' | 'code' | 'blame'

const setDefaultView = (language: string): ViewTypeValue => {
  return language === 'markdown' ? 'preview' : 'code'
}

export default function FileContentViewer({ repoContent }: FileContentViewerProps) {
  const fileName = repoContent?.name || ''
  const language = filenameToLanguage(fileName) || ''
  const fileContent = decodeGitContent(repoContent?.content?.data)
  const [view, setView] = useState<ViewTypeValue>(setDefaultView(language))
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
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

  useEffect(() => {
    setView(setDefaultView(language))
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
          onCopyClick={() => copy(fileContent)}
          onDownloadClick={() => undefined}
          onEditClick={() => setIsEditMode(true)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm_icon">
              <Icon name="ellipsis" size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex gap-1.5 items-center">
              <Icon name="arrow-long" size={12} className="text-tertiary-background" />
              <Text>View Raw</Text>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-1.5 items-center">
              <Icon name="trash" size={12} className="text-tertiary-background" />
              <Text>Delete</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup.Root>
    )
  }

  return (
    <>
      <StackedList.Root>
        <StackedList.Item disableHover isHeader className="py-2.5 px-3">
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
      <StackedList.Root>
        <StackedList.Item disableHover isHeader className="py-2.5 px-3">
          <ToggleGroup
            onValueChange={(value: ViewTypeValue) => {
              if (value) {
                setView(value)
              }
            }}
            value={view}
            type="single"
            unselectable={'on'}
            className={'bg-primary-foreground p-0.5 border border-primary/10 rounded-lg'}>
            {language === 'markdown' && (
              <ToggleGroupItem
                value={'preview'}
                className="h-7 border border-transparent text-xs font-medium data-[state=on]:border-primary/10 rounded-md disabled:opacity-100">
                Preview
              </ToggleGroupItem>
            )}
            <ToggleGroupItem
              value={'code'}
              className="h-7 border border-transparent text-xs font-medium data-[state=on]:border-primary/10 rounded-md disabled:opacity-100">
              Code
            </ToggleGroupItem>
            <ToggleGroupItem
              value={'blame'}
              className="h-7 border text-xs font-medium border-transparent data-[state=on]:border-white/10 text-tertiary-background data-[state=on]:text-primary rounded-md">
              Blame
            </ToggleGroupItem>
          </ToggleGroup>
          <StackedList.Field right title={<RightDetails />} />
        </StackedList.Item>
      </StackedList.Root>
      <Spacer size={1} />
      {language === 'markdown' && view === 'preview' ? (
        <MarkdownViewer source={fileContent} />
      ) : (
        view === 'code' && (
          <CodeEditor
            language={language}
            codeRevision={{ code: fileContent }}
            onCodeRevisionChange={() => {}}
            themeConfig={themeConfig}
            options={{
              readOnly: !isEditMode
            }}
          />
        )
      )}
    </>
  )
}
