import { ForwardedRef, forwardRef, ReactNode } from 'react'

import { Accordion, GridProps, IconPropsV2, IconV2, Layout, Text, Tooltip, TooltipProps } from '@/components'
import { LinkProps, useRouterContext } from '@/context'
import { cn } from '@utils/cn'

interface BaseItemProps {
  icon: NonNullable<IconPropsV2['name']>
  isActive?: boolean
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
  ({ className, children, icon, isActive, link, isFolder, ...props }: ItemProps, ref) => {
    const { Link } = useRouterContext()

    const commonClassnames = cn(
      'w-[fill-available] py-cn-2xs pr-1.5 rounded text-cn-2 hover:text-cn-1 focus-visible:text-cn-1 focus-visible:bg-cn-hover focus-visible:outline-none',
      {
        'text-cn-1': isActive,
        'grid items-center justify-start gap-cn-2xs grid-flow-col': !!link,
        'bg-cn-selected': !isFolder && isActive,
        'hover:bg-cn-hover': !isFolder
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
        <IconV2 className="text-inherit" name={icon} size="md" />
        <Text className="text-inherit" truncate>
          {children}
        </Text>
      </Link>
    ) : (
      <Layout.Grid
        ref={ref}
        align="center"
        gap="2xs"
        flow="column"
        justify="start"
        className={commonClassnames}
        as="button"
        {...(props as DefaultItemProps)}
      >
        <IconV2 className="text-inherit" name={icon} size="md" />
        <Text className="text-inherit" truncate>
          {children}
        </Text>
      </Layout.Grid>
    )
  }
)
Item.displayName = 'FileExplorerItem'

interface FolderItemProps {
  children: ReactNode
  level: number
  value?: string
  isActive?: boolean
  content?: ReactNode
  link?: string
}

function FolderItem({ children, value = '', isActive, content, link, level }: FolderItemProps) {
  const itemElement = (
    <Item
      icon="folder"
      isActive={isActive}
      style={{ marginLeft: `calc(-16px * ${level + 1} - 8px)`, paddingLeft: `calc(16px * ${level + 1} + 8px)` }}
      link={link}
      isFolder
    >
      {children}
    </Item>
  )

  return (
    <Accordion.Item value={value} className="border-none ">
      <Layout.Flex
        className={cn('file-explorer-header', {
          'bg-cn-selected': isActive
        })}
      >
        <Accordion.Trigger
          className="hover:bg-cn-separator pl-cn-2xs relative z-[1] h-full rounded-l p-0 [&>.cn-accordion-trigger-indicator]:mt-0 [&>.cn-accordion-trigger-indicator]:-rotate-90 [&>.cn-accordion-trigger-indicator]:self-center [&>.cn-accordion-trigger-indicator]:data-[state=open]:-rotate-0"
          indicatorProps={{ size: '2xs', className: 'flex' }}
          asChild
        ></Accordion.Trigger>
        {itemElement}
      </Layout.Flex>

      {!!content && (
        <Accordion.Content
          containerClassName="overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 relative after:absolute after:left-3 after:top-0 after:block after:h-full after:w-px after:bg-cn-separator-subtle after:-translate-x-1/2"
          className="pl-cn-md pb-0"
        >
          {content}
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
  onClick?: () => void
  tooltip?: TooltipProps['content']
  [key: `data-${string}`]: any
}

function FileItem({ children, isActive, level, link, onClick, tooltip, ...dataProps }: FileItemProps) {
  const comp = (
    <Item
      icon="empty-page"
      isActive={isActive}
      className="mb-cn-4xs"
      style={{ marginLeft: `calc(-16px * ${level})`, paddingLeft: level ? `calc(16px * ${level} + 8px)` : '24px' }}
      onClick={onClick}
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

export { Root, FileItem, FolderItem }
