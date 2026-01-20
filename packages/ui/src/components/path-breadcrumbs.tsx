import { ChangeEvent, Fragment, useMemo } from 'react'

import { Breadcrumb, CopyButton, Layout, Tag, Text, TextInput } from '@/components'
import { useRouterContext } from '@/context'
import { decodeURIComponentIfValid } from '@utils/utils'

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
        id="fileName"
        value={path}
        placeholder="Add a file name"
        onInput={(event: ChangeEvent<HTMLInputElement>) => {
          changeFileName(event.currentTarget.value)
        }}
        onBlur={handleOnBlur}
        onFocus={({ target }) => {
          const value = (parentPath ? parentPath + '/' : '') + path
          changeFileName(value)
          setParentPath?.('')
          setTimeout(() => {
            target.setSelectionRange(value.length, value.length)
            target.scrollLeft = Number.MAX_SAFE_INTEGER
          }, 0)
        }}
        autoFocus={!!isNew}
      />
      <Text variant="body-single-line-normal" color="foreground-3">
        in
      </Text>
      <Tag variant="secondary" theme="gray" value={gitRefName} icon="git-branch" />
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

export const PathBreadcrumbs = ({ items, isEdit, isNew, ...props }: PathBreadcrumbsProps) => {
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

  const isRenderInput = isNew || isEdit

  // Truncation logic: max 4 items visible
  // If more than 4: root / ... / second-to-last / last
  const MAX_VISIBLE_ITEMS = 4
  const shouldTruncate = items.length > MAX_VISIBLE_ITEMS

  // Memoize hidden items for the ellipsis dropdown
  const hiddenItems = useMemo(() => {
    if (!shouldTruncate) return []
    // Hidden items are from index 1 to items.length - 2 (exclusive of last two)
    return items.slice(1, items.length - 2).map(item => ({
      label: decodeURIComponentIfValid(decodeURIComponentIfValid(item.path)),
      href: item.parentPath
    }))
  }, [items, shouldTruncate])

  // Memoize visible items
  const visibleItems = useMemo(() => {
    if (!shouldTruncate) return items

    // Show: first item, ellipsis, second-to-last, last
    return [
      items[0], // root
      null, // placeholder for ellipsis
      items[items.length - 2], // second-to-last
      items[items.length - 1] // last
    ]
  }, [items, shouldTruncate])

  return (
    <Layout.Flex gap="sm" wrap={isRenderInput ? 'wrap' : 'nowrap'} align="start">
      <Breadcrumb.Root className="mt-cn-xs">
        <Breadcrumb.List>
          {visibleItems.map((item, idx) => {
            // Render ellipsis with hidden items dropdown
            if (item === null) {
              return (
                <Fragment key="ellipsis">
                  <Breadcrumb.Ellipsis
                    items={hiddenItems}
                    onItemSelect={selectedItem => {
                      window.location.href = selectedItem.href
                    }}
                  />
                  <Breadcrumb.Separator />
                </Fragment>
              )
            }

            const { parentPath, path } = item
            const isLast = idx === visibleItems.length - 1

            return (
              <Fragment key={idx}>
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild>
                    <Link to={parentPath}>{decodeURIComponentIfValid(decodeURIComponentIfValid(path))}</Link>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                {!isLast && <Breadcrumb.Separator />}
              </Fragment>
            )
          })}
          {isRenderInput && <Breadcrumb.Separator />}
        </Breadcrumb.List>
      </Breadcrumb.Root>

      {isRenderInput && renderInput()}

      {items.length > 1 && !isRenderInput && (
        <CopyButton
          className="mt-cn-3xs"
          size="xs"
          name={items
            .slice(1)
            .map(item => decodeURIComponentIfValid(decodeURIComponentIfValid(item.path)))
            .join('/')}
        />
      )}
    </Layout.Flex>
  )
}

PathBreadcrumbs.displayName = 'PathBreadcrumbs'
