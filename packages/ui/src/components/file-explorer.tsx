import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Accordion, Icon, Text } from '@/components'
import { cn } from '@utils/cn'

interface FolderItemProps {
  children: ReactNode
  value?: string
  isActive?: boolean
  content?: ReactNode
  chevronClassName?: string
  link: string
}

function FolderItem({ children, value = '', isActive, content, chevronClassName, link }: FolderItemProps) {
  return (
    <Accordion.Item value={value} className="border-none">
      <Accordion.Trigger
        className={cn(
          `relative w-full p-0 pr-1.5
          before:absolute before:z-[-1] before:top-0 before:-left-1.5 before:right-0 before:h-full before:rounded`,
          {
            'before:bg-background-4': isActive
          }
        )}
        leftChevron
        rotateChevron
        chevronClassName={
          chevronClassName || 'text-icons-9 group-hover:text-icons-2 group-data-[state=open]:text-icons-2'
        }
      >
        <div
          className={cn(
            `flex w-full justify-start overflow-hidden transition-colors duration-200 text-foreground-2
            group-hover:text-foreground-1
            group-data-[state=open]:text-foreground-1`,
            {
              'text-foreground-1 ': isActive
            }
          )}
        >
          <div className="flex w-full items-center gap-1.5 py-1.5">
            <Icon
              className={cn(
                'min-w-4 text-icons-9 duration-100 ease-in-out group-hover:text-icons-2 group-data-[state=open]:text-icons-2',
                { 'text-icons-2': isActive }
              )}
              name="folder"
              size={16}
            />
            <Link to={link} className="overflow-hidden">
              <Text className="duration-100 ease-in-out" color="inherit" as="p" size={2} truncate weight="medium">
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
  const comp = (
    <div
      className={cn(
        `relative group flex items-center justify-start gap-1.5 py-1.5 pr-1.5 pl-4 text-foreground-2
        hover:text-foreground-1
        before:absolute before:z-[-1] before:top-0 before:left-2.5 before:right-0 before:h-full before:rounded`,
        {
          'text-foreground-1 before:bg-background-4': isActive
        }
      )}
    >
      <Icon
        className={cn('min-w-4 text-icons-9 duration-100 ease-in-out group-hover:text-icons-2', {
          'text-icons-2': isActive
        })}
        name="file"
        size={16}
      />
      <Text className="duration-100 ease-in-out" size={2} color="inherit" weight="medium" truncate>
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
    <Accordion.Root type="multiple" className="w-full" onValueChange={onValueChange} value={value}>
      {children}
    </Accordion.Root>
  )
}

export { Root, FileItem, FolderItem }
