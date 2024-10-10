import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, cn, Icon, Text } from '@harnessio/canary'
import React from 'react'
import { Link } from 'react-router-dom'

interface ItemProps {
  children: React.ReactNode
  key: string
  value?: string
  isActive?: boolean
  content?: React.ReactNode
  chevronClass?: string
  link: string
}

function FolderItem({ children, key, value, isActive, content, chevronClass, link }: ItemProps) {
  return (
    <AccordionItem key={key} value={value || ''} className="border-none">
      <AccordionTrigger
        className={cn('p-0 w-full group', 'text-tertiary-background')}
        leftChevron
        rotateChevron
        chevronClass={chevronClass || 'text-tertiary-background group-hover:text-primary'}>
        <div
          className={cn(' w-full flex justify-start overflow-hidden transition-colors duration-200', {
            'text-primary': isActive
          })}>
          <div className="flex gap-2 items-center py-1 w-full">
            <Icon name="folder" size={12} className="min-w-[12px] group-hover:text-primary ease-in-out duration-100" />
            <Link to={link}>
              <Text as="p" size={2} className="text-inherit group-hover:text-primary ease-in-out duration-100 truncate">
                {children}
              </Text>
            </Link>
          </div>
        </div>
      </AccordionTrigger>
      {content && (
        <AccordionContent className="pl-3 pb-0 flex gap-2 items-center py-1 overflow-hidden w-full">
          {content}
        </AccordionContent>
      )}
    </AccordionItem>
  )
}

function FileItem({ children, key, isActive }: ItemProps) {
  return (
    <div
      key={key}
      className={cn(
        'group flex gap-2 items-center justify-start py-1 pl-[22px] text-tertiary-background overflow-hidden',
        {
          'text-primary': isActive
        }
      )}>
      <Icon name="file" size={12} className="min-w-[12px] group-hover:text-primary ease-in-out duration-100" />
      <Text size={2} className="text-inherit group-hover:text-primary ease-in-out duration-100 truncate">
        {children}
      </Text>
    </div>
  )
}

function Root({
  children,
  onValueChange,
  value
}: {
  children: React.ReactNode
  onValueChange: (value: string | string[]) => void
  value: string[]
}) {
  return (
    <Accordion type="multiple" className="w-full" onValueChange={onValueChange} value={value}>
      {children}
    </Accordion>
  )
}

export { Root, FileItem, FolderItem }
