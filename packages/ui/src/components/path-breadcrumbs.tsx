import { ChangeEvent, Fragment } from 'react'

import { Breadcrumb, Icon, Input } from '@/components'
import { useRouterContext } from '@/context'

interface InputPathBreadcrumbItemProps {
  path: string
  changeFileName: (value: string) => void
  gitRefName: string
  isNew?: boolean
  handleOnBlur: () => void
  parentPath?: string
  setParentPath?: (value: string) => void
}

const InputPathBreadcrumbItem = ({
  path,
  changeFileName,
  gitRefName,
  isNew = false,
  handleOnBlur,
  parentPath,
  setParentPath
}: InputPathBreadcrumbItemProps) => {
  return (
    <div className="flex items-center gap-1.5 text-cn-foreground-2">
      <Input
        className="w-[200px]"
        id="fileName"
        value={path}
        placeholder="Add a file name"
        onInput={(event: ChangeEvent<HTMLInputElement>) => {
          changeFileName(event.currentTarget.value)
        }}
        onBlur={handleOnBlur}
        onFocus={() => {
          const value = (parentPath ? parentPath + '/' : '') + path
          changeFileName(value)
          setParentPath?.('')
        }}
        autoFocus={!!isNew}
      />
      <span>in</span>
      <span className="flex h-6 items-center gap-1 rounded bg-cn-background-8 px-2.5 text-cn-foreground-1">
        <Icon className="text-icons-9" name="branch" size={14} />
        {gitRefName}
      </span>
    </div>
  )
}

export interface PathParts {
  path: string
  parentPath: string
}

export interface PathBreadcrumbsBaseProps {
  items: PathParts[]
  isEdit: boolean
  isNew: boolean
}

export interface PathBreadcrumbsInputProps {
  changeFileName: (value: string) => void
  gitRefName: string
  fileName: string
  handleOnBlur: () => void
  parentPath?: string
  setParentPath?: (value: string) => void
}

export type PathBreadcrumbsProps = PathBreadcrumbsBaseProps & Partial<PathBreadcrumbsInputProps>

export const PathBreadcrumbs = ({ items, isEdit, isNew, ...props }: PathBreadcrumbsProps) => {
  const { Link } = useRouterContext()
  const length = items.length

  const renderInput = () => {
    const { changeFileName, gitRefName, fileName, handleOnBlur, parentPath, setParentPath } = props

    if (!changeFileName || gitRefName === undefined || fileName === undefined || !handleOnBlur) {
      throw new Error('Invalid usage of InputComp')
    }

    return (
      <InputPathBreadcrumbItem
        path={fileName}
        changeFileName={changeFileName}
        gitRefName={gitRefName}
        handleOnBlur={handleOnBlur}
        isNew={isNew}
        parentPath={parentPath}
        setParentPath={setParentPath}
      />
    )
  }

  return (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        {items.map(({ parentPath, path }, idx) => {
          const isLast = length === idx + 1

          if (isLast) {
            return (
              <Breadcrumb.Item key={idx}>
                {isEdit && length === 1 ? (
                  <>
                    <Breadcrumb.Page>{path}</Breadcrumb.Page>
                    <Breadcrumb.Separator />
                    {renderInput()}
                  </>
                ) : isEdit ? (
                  renderInput()
                ) : (
                  <Breadcrumb.Page>{path}</Breadcrumb.Page>
                )}
              </Breadcrumb.Item>
            )
          }

          return (
            <Fragment key={idx}>
              <Breadcrumb.Item>
                <Breadcrumb.Link asChild>
                  <Link to={parentPath}>{path}</Link>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            </Fragment>
          )
        })}

        {isNew && (
          <>
            {!!items.length && <Breadcrumb.Separator />}
            <Breadcrumb.Item>{renderInput()}</Breadcrumb.Item>
          </>
        )}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
