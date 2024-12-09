import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  cn,
  Input,
  ListActions,
  Spacer,
  StackedList,
  Text,
  ToggleGroup,
  ToggleGroupItem
} from '@harnessio/canary'
import { useFindRepositoryQuery, useGetContentQuery } from '@harnessio/code-service-client'
import { ExitConfirmDialog, PathParts } from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'

import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import useCodePathDetails from '../hooks/useCodePathDetails'
import { themes } from '../pages/pipeline-edit/theme/monaco-theme'
import { PathParams } from '../RouteDefinitions'
import {
  decodeGitContent,
  FILE_SEPERATOR,
  filenameToLanguage,
  GitCommitAction,
  normalizeGitRef,
  PLAIN_TEXT
} from '../utils/git-utils'
import { splitPathWithParents } from '../utils/path-utils'
import GitCommitDialog from './GitCommitDialog'

export type ViewTypeValue = 'contents' | 'changes'

/**
 * @deprecated
 */
export const FileEditor: React.FC = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId } = useParams<PathParams>()
  const { fullGitRef, fullResourcePath } = useCodePathDetails()
  const repoPath = `/${spaceId}/repos/${repoId}/code/${fullGitRef}`
  const [fileName, setFileName] = useState<string>()
  const [language, setLanguage] = useState('')
  const [originalFileContent, setOriginalFileContent] = useState('')
  const [content, setContent] = useState(originalFileContent)
  const [view, setView] = useState<ViewTypeValue>('contents')
  const [dirty, setDirty] = useState(false)
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const navigate = useNavigate()
  const { data: { body: repoMetadata } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: repoDetails } = {} } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(fullGitRef || '') }
  })

  const themeConfig = useMemo(
    () => ({
      defaultTheme: 'dark',
      themes
    }),
    []
  )

  const isNew = useMemo(() => repoDetails && repoDetails.type === 'dir', [repoDetails])
  const [parentPath, setParentPath] = useState(
    isNew ? fullResourcePath : fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
  )
  const pathParts = useMemo(() => (parentPath?.length ? splitPathWithParents(parentPath, repoPath) : []), [parentPath])
  const fileResourcePath = useMemo(
    () => [(parentPath || '').trim(), (fileName || '').trim()].filter(p => !!p.trim()).join(FILE_SEPERATOR),
    [parentPath, fileName]
  )
  const isUpdate = useMemo(() => fullResourcePath === fileResourcePath, [fullResourcePath, fileResourcePath])
  const commitAction = useMemo(
    () => (isNew ? GitCommitAction.CREATE : isUpdate ? GitCommitAction.UPDATE : GitCommitAction.MOVE),
    [isNew, isUpdate]
  )
  const inputRef = useRef<HTMLInputElement | null>()

  useEffect(() => {
    if (inputRef.current && fileName?.length) {
      inputRef.current.size = Math.min(Math.max(fileName?.length - 2, 20), 50)
    }
  }, [fileName, inputRef])

  useEffect(() => {
    setFileName(isNew ? '' : repoDetails?.name || '')
    setLanguage(filenameToLanguage(fileName) || '')
    setOriginalFileContent(decodeGitContent(repoDetails?.content?.data))
  }, [isNew, repoDetails])

  useEffect(() => {
    setDirty(!(!fileName || (isUpdate && content === originalFileContent)))
  }, [fileName, isUpdate, content, originalFileContent])

  useEffect(() => {
    setContent(originalFileContent)
  }, [originalFileContent])

  const closeDialog = () => {
    setIsCommitDialogOpen(false)
  }
  const rebuildPaths = useCallback(() => {
    const _tokens = fileName?.split(FILE_SEPERATOR).filter(part => !!part.trim())
    const _fileName = ((_tokens?.pop() as string) || '').trim()
    const _parentPath = parentPath
      ?.split(FILE_SEPERATOR)
      .concat(_tokens || '')
      .map(p => p.trim())
      .filter(part => !!part.trim())
      .join(FILE_SEPERATOR)

    if (_fileName) {
      const normalizedFilename = _fileName.trim()
      const newLanguage = filenameToLanguage(normalizedFilename)

      if (normalizedFilename !== fileName) {
        setFileName(normalizedFilename)
      }
      if (language !== newLanguage) {
        setLanguage(newLanguage || PLAIN_TEXT)
        setOriginalFileContent(content)
      }
    }

    setParentPath(_parentPath)
  }, [fileName, parentPath, language, content])

  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const handleCancelFileEdit = () => {
    if (dirty) {
      setIsExitConfirmOpen(true)
    } else {
      onExitConfirm()
    }
  }
  const onExitConfirm = () => {
    const navigateTo = `/${spaceId}/repos/${repoId}/code/${fullGitRef}/${fullResourcePath ? `~/${fullResourcePath}` : ''}`
    navigate(navigateTo)
  }
  const onExitCancel = () => {
    setIsExitConfirmOpen(false)
  }
  return (
    <>
      <GitCommitDialog
        open={isCommitDialogOpen}
        onClose={closeDialog}
        commitAction={commitAction}
        gitRef={fullGitRef || ''}
        oldResourcePath={commitAction === GitCommitAction.MOVE ? fullResourcePath : undefined}
        resourcePath={fileResourcePath || ''}
        payload={content}
        sha={repoDetails?.sha}
        onSuccess={(_commitInfo, isNewBranch, newBranchName, fileName) => {
          if (!isNewBranch) {
            navigate(
              `/${spaceId}/repos/${repoId}/code/${fullGitRef}/~/${isNew ? fileResourcePath + fileName : fileResourcePath}`
            )
          } else {
            navigate(
              `/${spaceId}/repos/${repoId}/pull-requests/compare/${repoMetadata?.default_branch}...${newBranchName}`
            )
          }
        }}
        defaultBranch={repoMetadata?.default_branch || ''}
        isNew={!!isNew}
      />
      <ExitConfirmDialog onCancel={onExitCancel} onConfirm={onExitConfirm} open={isExitConfirmOpen} />
      <SandboxLayout.Content>
        <ListActions.Root>
          <ListActions.Left>
            <ButtonGroup.Root spacing="2">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={repoPath}>
                    <Text size={2} color="tertiaryBackground" className="hover:text-foreground">
                      {repoId}
                    </Text>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <Text size={2} color="tertiaryBackground" className="pt-2">
                /
              </Text>
              {pathParts?.map((path: PathParts, index: number) => {
                return (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={repoPath + '/~/' + path.parentPath}>
                          <Text
                            size={2}
                            color="tertiaryBackground"
                            className={cn('hover:text-foreground', {
                              'text-primary': index === pathParts?.length - 1
                            })}
                          >
                            {path.path}
                          </Text>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <Text size={2} color="tertiaryBackground" className="pt-2">
                      /
                    </Text>
                  </>
                )
              })}
              <BreadcrumbItem>
                <Input
                  id="fileName"
                  value={fileName}
                  size={20}
                  onInput={(event: ChangeEvent<HTMLInputElement>) => {
                    setFileName(event.currentTarget.value)
                  }}
                  ref={_ref => (inputRef.current = _ref)}
                  onBlur={rebuildPaths}
                  onFocus={({ target }) => {
                    const value = (parentPath ? parentPath + FILE_SEPERATOR : '') + fileName
                    setFileName(value)
                    setParentPath('')
                    setTimeout(() => {
                      target.setSelectionRange(value.length, value.length)
                      target.scrollLeft = Number.MAX_SAFE_INTEGER
                    }, 0)
                  }}
                  placeholder="Name your file..."
                />
              </BreadcrumbItem>
            </ButtonGroup.Root>
          </ListActions.Left>
          <ListActions.Right>
            <Button variant="default" size="sm" onClick={() => setIsCommitDialogOpen(true)}>
              Commit Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleCancelFileEdit()
              }}
            >
              Cancel
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        <StackedList.Root onlyTopRounded borderBackground>
          <StackedList.Item disableHover isHeader className="px-3 py-2.5">
            <ToggleGroup
              onValueChange={(value: ViewTypeValue) => setView(value)}
              value={view}
              type="single"
              unselectable="on"
              className="rounded-lg border border-primary/10 bg-primary-foreground p-0.5"
            >
              <ToggleGroupItem
                value="contents"
                className="h-7 rounded-md border border-transparent text-xs font-medium disabled:opacity-100 data-[state=on]:border-primary/10"
              >
                Contents
              </ToggleGroupItem>
              <ToggleGroupItem
                value="changes"
                className="h-7 rounded-md border border-transparent text-xs font-medium disabled:opacity-100 data-[state=on]:border-primary/10"
              >
                Changes
              </ToggleGroupItem>
            </ToggleGroup>
          </StackedList.Item>
        </StackedList.Root>
        {view === 'contents' ? (
          <CodeEditor
            language={language}
            codeRevision={{ code: content }}
            onCodeRevisionChange={value => setContent(value?.code || '')}
            themeConfig={themeConfig}
            options={{
              readOnly: false
            }}
          />
        ) : (
          <CodeDiffEditor
            language={language}
            original={originalFileContent}
            modified={content}
            themeConfig={themeConfig}
            options={{
              readOnly: true
            }}
          />
        )}
      </SandboxLayout.Content>
    </>
  )
}
