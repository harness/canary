import { ReactNode } from 'react'

import { Accordion, GridProps, IconPropsV2, IconV2, Layout, Text } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

interface ItemProps extends GridProps {
  icon: NonNullable<IconPropsV2['name']>
}

const Item = ({ className, children, icon, ...props }: ItemProps) => {
  return (
    <Layout.Grid
      align="center"
      gap="2xs"
      flow="column"
      justify="start"
      className={cn('py-layout-2xs pr-1.5 rounded', className)}
      {...props}
    >
      <IconV2 className="text-cn-foreground-2" name={icon} />
      <Text truncate>{children}</Text>
    </Layout.Grid>
  )
}

interface FolderItemProps {
  children: ReactNode
  value?: string
  isActive?: boolean
  content?: ReactNode
  link: string
}

function FolderItem({ children, value = '', content, link }: FolderItemProps) {
  const { Link } = useRouterContext()

  return (
    <Accordion.Item value={value} className="border-none">
      <Accordion.Trigger
        className="p-0 [&>.cn-accordion-trigger-indicator]:mt-0 [&>.cn-accordion-trigger-indicator]:-rotate-90 [&>.cn-accordion-trigger-indicator]:self-center [&>.cn-accordion-trigger-indicator]:data-[state=open]:-rotate-0"
        indicatorProps={{ size: '2xs' }}
      >
        <Link to={link}>
          <Item icon="folder">{children}</Item>
        </Link>
      </Accordion.Trigger>

      {!!content && (
        <Accordion.Content
          containerClassName="overflow-visible data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          className="pl-layout-md pb-0"
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
}

function FileItem({ children, isActive, level, link }: FileItemProps) {
  const { Link } = useRouterContext()
  const comp = (
    <Item
      icon="page"
      className={cn({ 'bg-cn-background-hover': isActive })}
      style={{ marginLeft: `calc(-16px * ${level})`, paddingLeft: level ? `calc(16px * ${level} + 2px)` : '16px' }}
    >
      {children}
    </Item>
  )

  return link ? <Link to={link}>{comp}</Link> : comp
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
