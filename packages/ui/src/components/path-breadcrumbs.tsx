import { ChangeEvent, Fragment, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)

  useEffect(() => {
    if (cursorPosition === null || inputRef.current === null) {
      return
    }
    inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
    setCursorPosition(null)
  }, [cursorPosition])

  return (
    <Layout.Flex align="center" gap="2xs">
      <TextInput
        ref={inputRef}
        className="w-[200px]"
        id="fileName"
        value={path}
        placeholder="Add a file name"
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          const value = event.currentTarget.value

          // we only care in case backspace was pressed and cursor was at the beginning of the input.
          if (
            event.key !== 'Backspace' ||
            event.currentTarget.selectionStart !== 0 ||
            event.currentTarget.selectionEnd !== 0
          ) {
            return
          }

          event.preventDefault()

          // no parentpath, nothing to do
          if (!parentPath) {
            return
          }

          // get last segment from parent path
          const lastParentSeparatorIdx = parentPath.lastIndexOf('/')

          // path is only one segment
          if (lastParentSeparatorIdx === -1) {
            setParentPath?.('')
            changeFileName(parentPath + value)
            setCursorPosition(parentPath.length) // cursor after the merged content
            return
          }

          const newParentPath = parentPath.substring(0, lastParentSeparatorIdx)
          const newFileName = parentPath.substring(lastParentSeparatorIdx + 1) + value

          setParentPath?.(newParentPath)
          changeFileName(newFileName)
          setCursorPosition(newFileName.length - value.length) // cursor after the merged segment
        }}
        onInput={(event: ChangeEvent<HTMLInputElement>) => {
          const value = event.currentTarget.value
          const cursorPos = event.currentTarget.selectionStart || 0

          // if there's no path separator, keep value as is
          const lastSeparatorIdx = value.lastIndexOf('/')
          if (lastSeparatorIdx === -1) {
            changeFileName(value)
            return
          }

          // otherwise, add any leading path segments to parentPath instead of file path
          const newParentPath = (parentPath ? parentPath + '/' : '') + value.substring(0, lastSeparatorIdx)
          const newFileName = value.substring(lastSeparatorIdx + 1)

          setParentPath?.(newParentPath)
          changeFileName(newFileName)
          setCursorPosition(Math.max(0, cursorPos - (lastSeparatorIdx + 1)))
        }}
        onBlur={handleOnBlur}
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
  const { Link, navigate } = useRouterContext()

  // in case of edit or new, last item is rendered as input and not as breadcrumb
  const filteredItems = useMemo(
    () => ((isEdit || isNew) && (props.fileName?.length || 0) > 0 ? items.slice(0, -1) : items),
    [items, isEdit, isNew, props.fileName]
  )

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
  const shouldTruncate = filteredItems.length > MAX_VISIBLE_ITEMS

  // Memoize hidden items for the ellipsis dropdown
  const hiddenItems = useMemo(() => {
    if (!shouldTruncate) return []
    // Hidden items are from index 1 to items.length - 2 (exclusive of last two)
    return filteredItems.slice(1, filteredItems.length - 2).map(item => ({
      label: decodeURIComponentIfValid(decodeURIComponentIfValid(item.path)),
      href: item.parentPath
    }))
  }, [filteredItems, shouldTruncate])

  // Memoize visible items
  const visibleItems = useMemo(() => {
    if (!shouldTruncate) return filteredItems

    // Show: first item, ellipsis, second-to-last, last
    return [
      filteredItems[0], // root
      null, // placeholder for ellipsis
      filteredItems[filteredItems.length - 2], // second-to-last
      filteredItems[filteredItems.length - 1] // last
    ]
  }, [filteredItems, shouldTruncate])

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
                      navigate(selectedItem.href)
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

      {filteredItems.length > 1 && !isRenderInput && (
        <CopyButton
          className="mt-cn-3xs"
          size="xs"
          name={filteredItems
            .slice(1)
            .map(item => decodeURIComponentIfValid(decodeURIComponentIfValid(item.path)))
            .join('/')}
        />
      )}
    </Layout.Flex>
  )
}

PathBreadcrumbs.displayName = 'PathBreadcrumbs'
