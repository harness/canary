import React from 'react'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'
import { Text } from './text'

interface NavbarRootProps {
  className?: string
  children: React.ReactNode
}

function Root({ className, children }: NavbarRootProps) {
  return (
    <div
      className={cn(
        'select-none grid grid-rows-[auto_1fr_auto] w-[220px] h-screen overflow-y-auto border-r border-border-background bg-primary-background',
        className
      )}>
      {children}
    </div>
  )
}

function Header({ children }: { children: React.ReactNode }) {
  return <div className="px-5 h-[57px] items-center grid">{children}</div>
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="grid content-start">{children}</div>
}

function Group({ children, title, topBorder }: { children: React.ReactNode; title?: string; topBorder?: boolean }) {
  return (
    <div
      className={cn('w-full overflow-x-hidden p-5 py-3.5 flex flex-col gap-1.5', {
        'border-t border-border-background pt-5': topBorder
      })}>
      {title && (
        <div className="group text-primary opacity-40 mb-2">
          <p className="text-xs font-normal group-hover:text-primary ease-in-out duration-150">{title}</p>
        </div>
      )}
      {children}
    </div>
  )
}

function AccordionGroup({
  title,
  topBorder,
  children
}: {
  title: string
  topBorder?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn('w-full overflow-x-hidden p-5 py-0.5 border-t border-border-background', {
        'border-t-0 pt-0': topBorder
      })}>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="group text-primary opacity-40">
            <p className="text-xs font-normal group-hover:text-primary ease-in-out duration-150">{title}</p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1.5">{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

interface ItemProps {
  icon?: React.ReactElement<SVGSVGElement>
  text: string
  description?: string
  active?: boolean
  className?: string
  submenuItem?: boolean
  onClick?: () => void
}

function Item({ icon, text, description, active, submenuItem, className }: ItemProps) {
  if (submenuItem)
    return (
      <div
        className={cn(
          'group relative grid grid-cols-[auto_1fr] gap-3 items-center cursor-pointer group select-none py-1.5',
          { 'gap-0': !icon },
          className
        )}>
        <div
          className={cn(
            'absolute -left-2 -right-2 w-auto h-full bg-transparent group-hover:bg-primary/5 rounded-md z-0',
            { 'bg-primary/5': active }
          )}
        />
        <div
          className={cn(
            'flex z-10 col-start-1 row-span-full items-center text-secondary-muted group-hover:text-primary ease-in-out duration-100 truncate',
            { 'text-primary': active }
          )}>
          {icon ? <div className="rounded-md bg-tertiary">{icon}</div> : <div />}
        </div>
        <div className="flex flex-col items-start col-start-2">
          <Text
            size={2}
            truncate
            weight="medium"
            className={cn(
              '-tracking-[0.02em] text-primary-muted group-hover:text-primary ease-in-out duration-100 truncate z-10',
              {
                'text-primary': active
              }
            )}>
            {text}
          </Text>
          <Text
            size={1}
            truncate
            color="tertiaryBackground"
            className={cn(
              '-tracking-[0.02em] opacity-60 group-hover:opacity-100 group-hover:text-primary/80 ease-in-out duration-100 truncate z-10',
              {
                'text-primary': active
              }
            )}>
            {description}
          </Text>
        </div>
      </div>
    )

  return (
    <div
      className={cn(
        'group flex gap-2.5 items-center cursor-pointer group select-none py-1.5',
        { 'gap-0': !icon },
        className
      )}>
      {icon && (
        <div
          className={cn(
            'w-3 min-w-3 flex z-10 items-center text-secondary-muted group-hover:text-primary ease-in-out duration-100 truncate',
            { 'text-primary': active }
          )}>
          {icon}
        </div>
      )}
      <Text
        size={2}
        weight="medium"
        className={cn(
          '-tracking-[0.02em] text-primary-muted group-hover:text-primary ease-in-out duration-100 truncate z-10',
          {
            'text-primary': active
          }
        )}>
        {text}
      </Text>
    </div>
  )
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="grid px-5 h-[76px] items-center border-t border-border-background">{children}</div>
}

export { Root, Header, Content, Group, AccordionGroup, Item, Footer }
