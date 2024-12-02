import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Icon, Text } from '@/components'
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
    <AccordionItem value={value} className="border-none">
      <AccordionTrigger
        className="w-full p-0"
        leftChevron
        rotateChevron
        chevronClassName={
          chevronClassName || 'text-icons-7 group-hover:text-icons-2 group-data-[state=open]:text-icons-2'
        }
      >
        <div
          className={cn(
            'flex w-full justify-start overflow-hidden transition-colors duration-200 text-foreground-3',
            'group-hover:text-foreground-1',
            'group-data-[state=open]:text-foreground-1',
            {
              'text-foreground-1': isActive
            }
          )}
        >
          <div className="flex w-full items-center gap-1.5 py-1.5">
            <Icon
              className="min-w-4 text-icons-7 duration-100 ease-in-out group-hover:text-icons-2 group-data-[state=open]:text-icons-2"
              name="folder"
              size={16}
            />
            <Link to={link}>
              <Text className="duration-100 ease-in-out" color="inherit" as="p" size={2} truncate weight="medium">
                {children}
              </Text>
            </Link>
          </div>
        </div>
      </AccordionTrigger>
      {!!content && (
        <AccordionContent className="flex w-full items-center gap-2 overflow-hidden pb-0 pl-4">
          {content}
        </AccordionContent>
      )}
    </AccordionItem>
  )
}

interface FileItemProps {
  children: React.ReactNode
  isActive?: boolean
  link?: string
}

function FileItem({ children, isActive, link }: FileItemProps) {
  const comp = (
    <div
      className={cn(
        'group flex items-center justify-start gap-1.5 overflow-hidden py-1.5 pl-4 text-foreground-3',
        'hover:text-foreground-1',
        {
          'text-foreground-1': isActive
        }
      )}
    >
      <Icon className="min-w-4 text-icons-7 duration-100 ease-in-out group-hover:text-icons-2" name="file" size={16} />
      <Text className="duration-100 ease-in-out" size={2} color="inherit" weight="medium" truncate>
        {children}
      </Text>
    </div>
  )

  return link ? <Link to={link}>{comp}</Link> : comp
}

interface RootProps {
  children: React.ReactNode
  onValueChange: (value: string | string[]) => void
  value: string[]
}

function Root({ children, onValueChange, value }: RootProps) {
  return (
    <Accordion type="multiple" className="w-full" onValueChange={onValueChange} value={value}>
      {children}
    </Accordion>
  )
}

export { Root, FileItem, FolderItem }
