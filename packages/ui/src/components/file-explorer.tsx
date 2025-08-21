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
}

interface LinkItemProps extends BaseItemProps, Omit<LinkProps, 'to'> {
  link?: LinkProps['to']
}

type ItemProps = DefaultItemProps | LinkItemProps

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, icon, isActive, link, ...props }: ItemProps, ref) => {
    const { Link } = useRouterContext()

    const commonClassnames = cn(
      'w-[fill-available] py-cn-2xs pr-1.5 rounded text-cn-foreground-2 hover:text-cn-foreground-1 hover:bg-cn-background-hover focus-visible:text-cn-foreground-1 focus-visible:bg-cn-background-hover focus-visible:outline-none',
      {
        'bg-cn-background-selected text-cn-foreground-1': isActive,
        'grid items-center justify-start gap-cn-2xs grid-flow-col': !!link
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
    >
      {children}
    </Item>
  )

  return (
    <Accordion.Item value={value} className="border-none ">
      <Accordion.Trigger
        className=" bg-cn-background-1 pl-cn-2xs mb-cn-4xs relative z-[1] p-0 [&>.cn-accordion-trigger-indicator]:mt-0 [&>.cn-accordion-trigger-indicator]:-rotate-90 [&>.cn-accordion-trigger-indicator]:self-center [&>.cn-accordion-trigger-indicator]:data-[state=open]:-rotate-0"
        indicatorProps={{ size: '2xs' }}
        asChild
      >
        {itemElement}
      </Accordion.Trigger>

      {!!content && (
        <Accordion.Content
          containerClassName="overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 relative after:absolute after:left-3 after:top-0 after:block after:h-full after:w-px after:bg-cn-borders-3 after:-translate-x-1/2"
          className="pl-cn-md pb-0"
        >
          {content}
        </Accordion.Content>
      )}
    </Accordion.Item>
  )
}

interface FileItemProps {
  level: number
  children: ReactNode
  isActive?: boolean
  link?: string
  onClick?: () => void
  tooltip?: TooltipProps['content']
}

function FileItem({ children, isActive, level, link, onClick, tooltip }: FileItemProps) {
  const comp = (
    <Item
      icon="empty-page"
      isActive={isActive}
      className="mb-cn-4xs"
      style={{ marginLeft: `calc(-16px * ${level})`, paddingLeft: level ? `calc(16px * ${level} + 8px)` : '24px' }}
      onClick={onClick}
      link={link}
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
