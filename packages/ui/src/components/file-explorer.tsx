import { ForwardedRef, forwardRef, ReactNode, useMemo } from 'react'

import {
  Accordion,
  Button,
  ButtonProps,
  GridProps,
  IconPropsV2,
  IconV2,
  IconV2NamesType,
  Layout,
  Text,
  Tooltip,
  TooltipProps
} from '@/components'
import { LinkProps, useRouterContext } from '@/context'
import { cn } from '@utils/cn'

type SidebarItemActionButtonPropsType = ButtonProps & {
  title?: string
  iconName?: IconV2NamesType
  iconProps?: Omit<IconPropsV2, 'ref' | 'name' | 'fallback'>
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

interface BaseItemProps {
  icon: NonNullable<IconPropsV2['name']>
  isActive?: boolean
  actionButtons?: SidebarItemActionButtonPropsType[]
}

interface DefaultItemProps extends BaseItemProps, GridProps {
  link?: never
  isFolder?: boolean
}

interface LinkItemProps extends BaseItemProps, Omit<LinkProps, 'to'> {
  link?: LinkProps['to']
  isFolder?: boolean
}

type ItemProps = DefaultItemProps | LinkItemProps

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, icon, isActive, link, isFolder, actionButtons, ...props }: ItemProps, ref) => {
    const { Link } = useRouterContext()

    const actionButtonsContent = useMemo(() => {
      if (!actionButtons) return null

      return (
        <Layout.Horizontal gap="none">
          {actionButtons?.map((buttonProps, index) => {
            const { title, iconOnly = true, iconName, iconProps, ...rest } = buttonProps
            return (
              <Button key={index} size="2xs" variant="ghost" iconOnly={iconOnly} {...rest}>
                {iconName && <IconV2 name={iconName} {...iconProps} />}
                {title}
              </Button>
            )
          })}
        </Layout.Horizontal>
      )
    }, [actionButtons])

    const commonClassnames = cn(
      'cn-file-tree-item',
      {
        'cn-file-tree-item-wrapper cn-file-tree-item-leaf': !isFolder,
        'cn-file-tree-item-active': !isFolder && isActive,
        'cn-file-tree-item-with-action-buttons': !!actionButtonsContent
      },
      className
    )

    return link ? (
      <Link
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        to={link}
        className={commonClassnames}
        {...(props as Omit<LinkItemProps, 'to'>)}
      >
        <IconV2 name={icon} size="md" />
        <Text align="left" color="inherit" truncate>
          {children}
        </Text>
        {actionButtonsContent}
      </Link>
    ) : (
      <Layout.Grid ref={ref} className={commonClassnames} as="button" {...(props as DefaultItemProps)}>
        <IconV2 name={icon} size="md" />
        <Text align="left" color="inherit" truncate>
          {children}
        </Text>
        {actionButtonsContent}
      </Layout.Grid>
    )
  }
)
Item.displayName = 'FileExplorerItem'

interface FolderItemProps {
  children: ReactNode
  level: number
  value: string
  isActive?: boolean
  content?: ReactNode
  onClick?: (value: string) => void
  link?: string
  icon?: IconV2NamesType
}

function FolderItem({
  children,
  value = '',
  isActive,
  content,
  link,
  onClick,
  icon = 'folder',
  ...otherProps
}: FolderItemProps) {
  const itemElement = (
    <Item icon={icon} isActive={isActive} link={link} isFolder onClick={() => onClick?.(value)} {...otherProps}>
      {children}
    </Item>
  )

  return (
    <Accordion.Item value={value} className="border-none">
      <Layout.Flex
        className={cn('cn-file-tree-folder-item cn-file-tree-item-wrapper pl-0', {
          'cn-file-tree-item-active': isActive
        })}
      >
        <Accordion.Trigger
          className="cn-file-tree-folder-trigger [&>.cn-accordion-trigger-indicator]:mt-0 [&>.cn-accordion-trigger-indicator]:-rotate-90 [&>.cn-accordion-trigger-indicator]:self-center [&>.cn-accordion-trigger-indicator]:data-[state=open]:-rotate-0"
          indicatorProps={{ size: '2xs', className: 'flex' }}
        ></Accordion.Trigger>
        {itemElement}
      </Layout.Flex>

      {!!content && (
        <Accordion.Content
          containerClassName="overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 relative after:absolute after:left-cn-sm after:top-0 after:block after:h-full after:w-px after:bg-cn-separator-subtle after:-translate-x-1/2"
          className="cn-file-tree-item-content"
        >
          {content}
          {/* LOADER */}
        </Accordion.Content>
      )}
    </Accordion.Item>
  )
}

type FileItemProps = {
  level: number
  children: ReactNode
  isActive?: boolean
  link?: string
  value: string
  onClick?: (value: string) => void
  tooltip?: TooltipProps['content']
  [key: `data-${string}`]: any
  icon?: IconV2NamesType
}

function FileItem({
  children,
  isActive,
  value,
  link,
  onClick,
  tooltip,
  icon = 'empty-page',
  ...dataProps
}: FileItemProps) {
  const comp = (
    <Item
      icon={icon}
      isActive={isActive}
      className="mb-cn-4xs"
      onClick={() => onClick?.(value)}
      link={link}
      {...dataProps}
    >
      {children}
    </Item>
  )

  return tooltip ? <Tooltip content={tooltip}>{comp}</Tooltip> : comp
}

interface RootProps {
  children: ReactNode
  onValueChange: (value: string | string[]) => void
  value: string[]
}

function Root({ children, onValueChange, value }: RootProps) {
  return (
    <Accordion.Root
      type="multiple"
      className="min-w-0"
      onValueChange={onValueChange}
      value={value}
      indicatorPosition="left"
    >
      {children}
    </Accordion.Root>
  )
}

export { Root, FileItem, FolderItem, Item }
