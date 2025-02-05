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
        'border-border-background bg-primary-background grid h-screen w-[220px] select-none grid-rows-[auto_1fr_auto] overflow-y-auto border-r',
        className
      )}
    >
      {children}
    </div>
  )
}

function Header({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-0 z-20 grid items-center bg-primary-background">{children}</div>
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="grid content-start">{children}</div>
}

function Group({ children, title, topBorder }: { children: React.ReactNode; title?: string; topBorder?: boolean }) {
  return (
    <div
      className={cn('flex w-full flex-col gap-1.5 overflow-x-hidden px-5 pb-3.5', {
        'border-border-background border-t pt-5': topBorder
      })}
    >
      {title && (
        <div className="group mb-2 text-primary opacity-40">
          <p className="text-xs font-normal duration-150 ease-in-out group-hover:text-primary">{title}</p>
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
      className={cn('border-border-background w-full overflow-x-hidden border-t p-5 py-0.5', {
        'border-t-0 pt-0': topBorder
      })}
    >
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="group text-primary opacity-40">
            <p className="text-xs font-normal duration-150 ease-in-out group-hover:text-primary">{title}</p>
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
          'group relative grid cursor-pointer select-none grid-cols-[auto_1fr] items-center gap-3 py-1',
          { 'gap-0': !icon },
          className
        )}
      >
        <div
          className={cn(
            'group-hover:bg-primary/5 absolute -left-2 -right-2 z-0 h-full w-auto rounded-md bg-transparent',
            { 'bg-primary/5': active }
          )}
        />
        <div
          className={cn(
            'text-secondary-muted group-hover:text-primary z-10 col-start-1 row-span-full flex items-center truncate duration-0 ease-in-out',
            { 'text-primary': active }
          )}
        >
          {icon ? <div className="rounded-md bg-tertiary">{icon}</div> : <div />}
        </div>
        <div className="col-start-2 flex flex-col items-start">
          <Text
            size={2}
            truncate
            weight="medium"
            className={cn(
              'text-primary-muted group-hover:text-primary z-10 truncate -tracking-[0.02em] duration-0 ease-in-out',
              {
                'text-primary': active
              }
            )}
          >
            {text}
          </Text>
          <Text
            size={1}
            truncate
            color="tertiaryBackground"
            className={cn(
              'group-hover:text-primary/80 z-10 truncate -tracking-[0.02em] opacity-60 duration-0 ease-in-out group-hover:opacity-100',
              {
                'text-primary': active
              }
            )}
          >
            {description}
          </Text>
        </div>
      </div>
    )

  return (
    <div className={cn('group flex cursor-pointer select-none items-center gap-2 py-1', { 'gap-0': !icon }, className)}>
      {icon && (
        <div
          className={cn(
            'text-secondary-muted group-hover:text-primary z-10 flex w-3 min-w-3 items-center truncate duration-100 ease-in-out',
            { 'text-primary': active }
          )}
        >
          {icon}
        </div>
      )}
      <Text
        size={2}
        weight="medium"
        className={cn(
          'text-primary-muted group-hover:text-primary z-10 truncate -tracking-[0.02em] duration-100 ease-in-out',
          {
            'text-primary': active
          }
        )}
      >
        {text}
      </Text>
    </div>
  )
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 grid h-[76px] items-center border-t border-border-background bg-primary-background px-5">
      {children}
    </div>
  )
}

/**
 * @deprecated
 */
export { Root, Header, Content, Group, AccordionGroup, Item, Footer }
