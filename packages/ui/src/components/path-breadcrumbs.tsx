import { ChangeEvent, Fragment } from 'react'

import { Breadcrumb, CopyButton, Layout, Tag, Text, TextInput } from '@/components'
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
    <Layout.Flex align="center" gap="2xs">
      <TextInput
        className="w-[200px]"
        size="sm"
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
      <Text variant="body-single-line-normal" color="foreground-3">
        in
      </Text>
      <Tag value={gitRefName} icon="git-branch" showIcon />
    </Layout.Flex>
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
  fullResourcePath?: string
}

export type PathBreadcrumbsProps = PathBreadcrumbsBaseProps & Partial<PathBreadcrumbsInputProps>

export const PathBreadcrumbs = ({ items, isEdit, isNew, fullResourcePath, ...props }: PathBreadcrumbsProps) => {
  const { Link } = useRouterContext()

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
    <Layout.Flex gap="2xs" align="center" wrap="wrap">
      <Breadcrumb.Root>
        <Breadcrumb.List>
          {items.map(({ parentPath, path }, idx) => (
            <Fragment key={idx}>
              <Breadcrumb.Item>
                <Breadcrumb.Link asChild>
                  <Link to={parentPath}>{path}</Link>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              {idx < items.length - 1 && <Breadcrumb.Separator />}
            </Fragment>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Layout.Flex gap="2xs" align="center">
        {(isNew || isEdit) && renderInput()}

        <CopyButton name={fullResourcePath || 'Copy path'} />
      </Layout.Flex>
    </Layout.Flex>
  )
}

PathBreadcrumbs.displayName = 'PathBreadcrumbs'
