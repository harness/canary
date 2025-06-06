import { ReactNode } from 'react'

import { Accordion, IconV2, Text } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

interface FolderItemProps {
  children: ReactNode
  value?: string
  isActive?: boolean
  content?: ReactNode
  link: string
}

function FolderItem({ children, value = '', isActive, content, link }: FolderItemProps) {
  const { Link } = useRouterContext()
  return (
    <Accordion.Item value={value} className="border-none">
      <Accordion.Trigger
        className="relative w-full p-0 pr-1.5 [&>.cn-accordion-trigger-indicator]:mt-0 [&>.cn-accordion-trigger-indicator]:-rotate-90 [&>.cn-accordion-trigger-indicator]:self-center [&>.cn-accordion-trigger-indicator]:data-[state=open]:-rotate-0"
        indicatorProps={{ size: 12 }}
      >
        <div
          className={cn(
            `flex w-full justify-start overflow-hidden transition-colors duration-200 text-cn-foreground-2
            group-hover:text-cn-foreground-1
            group-data-[state=open]:text-cn-foreground-1`,
            {
              'text-cn-foreground-1 ': isActive
            }
          )}
        >
          <div className="flex w-full items-center gap-1.5 py-1.5">
            <IconV2
              className={cn(
                'min-w-4 text-icons-9 duration-100 ease-in-out group-hover:text-icons-2 group-data-[state=open]:text-icons-2',
                { 'text-icons-2': isActive }
              )}
              name="folder"
              size={16}
            />
            <Link to={link} className="overflow-hidden">
              <Text variant="body-strong" className="duration-100 ease-in-out" color="inherit" as="p" truncate>
                {children}
              </Text>
            </Link>
          </div>
        </div>
      </Accordion.Trigger>
      {!!content && (
        <Accordion.Content className="flex w-full items-center gap-2 pb-0 pl-4">{content}</Accordion.Content>
      )}
    </Accordion.Item>
  )
}

interface FileItemProps {
  children: ReactNode
  isActive?: boolean
  link?: string
}

function FileItem({ children, isActive, link }: FileItemProps) {
  const { Link } = useRouterContext()
  const comp = (
    <div
      className={cn(
        `relative group flex items-center justify-start gap-1.5 py-1.5 pr-1.5 pl-4 text-cn-foreground-2
        hover:text-cn-foreground-1
        before:absolute before:z-[-1] before:top-0 before:left-2.5 before:right-0 before:h-full before:rounded`,
        {
          'text-cn-foreground-1 before:bg-cn-background-hover': isActive
        }
      )}
    >
      <IconV2
        className={cn('min-w-4 text-icons-9 duration-100 ease-in-out group-hover:text-icons-2', {
          'text-icons-2': isActive
        })}
        name="page"
      />
      <Text variant="body-strong" className="duration-100 ease-in-out" color="inherit" truncate>
        {children}
      </Text>
    </div>
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
      className="w-full min-w-0"
      onValueChange={onValueChange}
      value={value}
      indicatorPosition="left"
    >
      {children}
    </Accordion.Root>
  )
}

export { Root, FileItem, FolderItem }
