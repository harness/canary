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
import { SandboxLayout } from '@harnessio/playground'
import { useGetContentQuery } from '@harnessio/code-service-client'
import { useGetRepoRef } from '../framework/hooks/useGetRepoPath'
import {
  decodeGitContent,
  filenameToLanguage,
  normalizeGitRef,
  GitCommitAction,
  FILE_SEPERATOR,
  PLAIN_TEXT
} from '../utils/git-utils'
import { PathParams } from '../RouteDefinitions'
import { PathParts, splitPathWithParents } from '../utils/path-utils'
import { CodeDiffEditor, CodeEditor } from '@harnessio/yaml-editor'
import { themes } from '../pages/pipeline-edit/theme/monaco-theme'
import GitCommitDialog from './GitCommitDialog'

export type ViewTypeValue = 'contents' | 'changes'

export const FileEditor: React.FC = () => {
  const repoRef = useGetRepoRef()
  const { spaceId, repoId, gitRef, resourcePath } = useParams<PathParams>()
  const subResourcePath = useParams()['*'] || ''
  const repoPath = `/${spaceId}/repos/${repoId}/code/${gitRef}`
  const fullResourcePath = subResourcePath ? resourcePath + '/' + subResourcePath : resourcePath
  const [fileName, setFileName] = useState<string>()
  const [language, setLanguage] = useState('')
  const [originalFileContent, setOriginalFileContent] = useState('')
  const [content, setContent] = useState(originalFileContent)
  const [view, setView] = useState<ViewTypeValue>('contents')
  const [dirty, setDirty] = useState(false)
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const navigate = useNavigate()

  const { data: repoDetails } = useGetContentQuery({
    path: fullResourcePath || '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(gitRef || '') }
  })

  const themeConfig = useMemo(
    () => ({
      defaultTheme: 'dark',
      themes
    }),
    []
  )

  const isNew = useMemo(() => repoDetails && (!repoDetails?.content?.data || repoDetails.type === 'dir'), [repoDetails])
  const [parentPath, setParentPath] = useState(
    isNew ? fullResourcePath : fullResourcePath?.split(FILE_SEPERATOR).slice(0, -1).join(FILE_SEPERATOR)
  )
  const pathParts = useMemo(() => (parentPath?.length ? splitPathWithParents(parentPath) : []), [parentPath])
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

  return (
    <>
      <GitCommitDialog
        open={isCommitDialogOpen}
        onClose={closeDialog}
        commitAction={commitAction}
        gitRef={gitRef || ''}
        oldResourcePath={commitAction === GitCommitAction.MOVE ? fullResourcePath : undefined}
        resourcePath={fileResourcePath || ''}
        payload={content}
        sha={repoDetails?.sha}
        onSuccess={(_commitInfo, isNewBranch) => {
          if (!isNewBranch) navigate(`/${spaceId}/repos/${repoId}/code/${gitRef}/~/${fileResourcePath}`)
        }}
      />
      <SandboxLayout.Main fullWidth hasLeftSubPanel>
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
                              })}>
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
                  />
                </BreadcrumbItem>
              </ButtonGroup.Root>
            </ListActions.Left>
            <ListActions.Right>
              <Button variant="default" size="sm" disabled={!dirty} onClick={() => setIsCommitDialogOpen(true)}>
                Commit Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/${spaceId}/repos/${repoId}/code/${gitRef}/~/${fullResourcePath}`)}>
                Cancel
              </Button>
            </ListActions.Right>
          </ListActions.Root>
          <Spacer size={5} />
          <StackedList.Root onlyTopRounded borderBackground>
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
                <ToggleGroupItem
                  value={'contents'}
                  className="h-7 border border-transparent text-xs font-medium data-[state=on]:border-primary/10 rounded-md disabled:opacity-100">
                  Contents
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={'changes'}
                  className="h-7 border border-transparent text-xs font-medium data-[state=on]:border-primary/10 rounded-md disabled:opacity-100">
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
      </SandboxLayout.Main>
    </>
  )
}
