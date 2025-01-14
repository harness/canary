import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Breadcrumb, Icon, Input } from '@/components'
import { debounce } from 'lodash-es'

interface InputPathBreadcrumbItemProps {
  path: string
  changeFileName: (value: string) => void
  gitRefName: string
  isNew?: boolean
  handleOnBlur: () => void
}

const InputPathBreadcrumbItem = ({
  path,
  changeFileName,
  gitRefName,
  isNew = false,
  handleOnBlur
}: InputPathBreadcrumbItemProps) => {
  const [fileName, setFileName] = useState('')

  const debouncedChangeFileNameRef = useRef(debounce((value: string) => changeFileName(value), 300))

  useEffect(() => {
    const debouncedChangeFileName = debouncedChangeFileNameRef.current

    return () => {
      debouncedChangeFileName.cancel()
    }
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFileName(value)
    debouncedChangeFileNameRef.current(value)
  }

  useEffect(() => {
    setFileName(path)
  }, [path])

  return (
    <div className="flex items-center gap-1.5 text-foreground-4">
      <Input
        className="w-[200px]"
        id="fileName"
        value={fileName}
        placeholder="Add a file name"
        onChange={handleInputChange}
        onBlur={handleOnBlur}
        autoFocus={!!isNew}
      />
      <span>in</span>
      <span className="flex h-6 items-center gap-1 rounded bg-background-8 px-2.5 text-foreground-8">
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
}

export type PathBreadcrumbsProps = PathBreadcrumbsBaseProps & Partial<PathBreadcrumbsInputProps>

export const PathBreadcrumbs = ({ items, isEdit, isNew, ...props }: PathBreadcrumbsProps) => {
  const length = items.length

  const renderInput = () => {
    const { changeFileName, gitRefName, fileName, handleOnBlur } = props

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
                {isEdit ? renderInput() : <Breadcrumb.Page>{path}</Breadcrumb.Page>}
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
