import { Link } from 'react-router-dom'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, cn, Icon, Text } from '@harnessio/canary'

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
        className={cn('group w-full p-0', 'text-tertiary-background')}
        leftChevron
        rotateChevron
        chevronClass={chevronClass || 'text-tertiary-background group-hover:text-primary'}
      >
        <div
          className={cn('flex w-full justify-start overflow-hidden transition-colors duration-200', {
            'text-primary': isActive
          })}
        >
          <div className="flex w-full items-center gap-2 py-1">
            <Icon name="folder" size={12} className="min-w-[12px] duration-100 ease-in-out group-hover:text-primary" />
            <Link to={link}>
              <Text as="p" size={2} className="truncate text-inherit duration-100 ease-in-out group-hover:text-primary">
                {children}
              </Text>
            </Link>
          </div>
        </div>
      </AccordionTrigger>
      {content && (
        <AccordionContent className="flex w-full items-center gap-2 overflow-hidden pb-0 pl-3">
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
        'text-tertiary-background group flex items-center justify-start gap-2 overflow-hidden py-1 pl-[22px]',
        {
          'text-primary': isActive
        }
      )}
    >
      <Icon name="file" size={12} className="min-w-[12px] duration-100 ease-in-out group-hover:text-primary" />
      <Text size={2} className="truncate text-inherit duration-100 ease-in-out group-hover:text-primary">
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

/**
 * @deprecated
 */
export { Root, FileItem, FolderItem }
