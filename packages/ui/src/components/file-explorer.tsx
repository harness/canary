import { forwardRef, ReactNode } from 'react'

import { Accordion, GridProps, IconPropsV2, IconV2, Layout, Text, Tooltip, TooltipProps } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

interface ItemProps extends GridProps {
  icon: NonNullable<IconPropsV2['name']>
  isActive?: boolean
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, icon, isActive, ...props }: ItemProps, ref) => {
    return (
      <Layout.Grid
        ref={ref}
        align="center"
        gap="2xs"
        flow="column"
        justify="start"
        className={cn(
          'py-cn-2xs pr-1.5 rounded text-cn-foreground-2 hover:text-cn-foreground-1 hover:bg-cn-background-hover cursor-pointer',
          { 'bg-cn-background-selected text-cn-foreground-1': isActive },
          className
        )}
        {...props}
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
  const { Link } = useRouterContext()

  const itemElement = (
    <Item
      icon="folder"
      isActive={isActive}
      style={{
        marginLeft: `calc(-16px * ${level + 1} - 8px)`,
        paddingLeft: `calc(16px * ${level + 1} + 8px)`
      }}
    >
      {children}
    </Item>
  )

  return (
    <Accordion.Item value={value} className="border-none">
      <Accordion.Trigger
        className="pl-cn-2xs mb-cn-4xs p-0 [&>.cn-accordion-trigger-indicator]:mt-0 [&>.cn-accordion-trigger-indicator]:-rotate-90 [&>.cn-accordion-trigger-indicator]:self-center [&>.cn-accordion-trigger-indicator]:data-[state=open]:-rotate-0"
        indicatorProps={{ size: '2xs' }}
      >
        {link ? <Link to={link}>{itemElement}</Link> : itemElement}
      </Accordion.Trigger>

      {!!content && (
        <Accordion.Content
          containerClassName="overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
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
  const { Link } = useRouterContext()
  const comp = (
    <Item
      icon="empty-page"
      isActive={isActive}
      className="mb-cn-4xs"
      style={{
        marginLeft: `calc(-16px * ${level})`,
        paddingLeft: level ? `calc(16px * ${level} + 8px)` : '40px'
      }}
      onClick={onClick}
    >
      {children}
    </Item>
  )

  const compWithTooltip = tooltip ? <Tooltip content={tooltip}>{comp}</Tooltip> : comp

  return link ? <Link to={link}>{compWithTooltip}</Link> : compWithTooltip
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
