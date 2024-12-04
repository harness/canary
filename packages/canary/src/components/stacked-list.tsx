import * as React from 'react'

import { cn } from '@/lib/utils'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

const listItemVariants = cva(
  'flex flex-1 flex-row flex-wrap items-center justify-start gap-1 border-b p-2 px-4 py-3 align-middle',
  {
    variants: {
      disabled: {
        true: '',
        false: ''
      },
      loading: {
        true: '',
        false: ''
      }
    }
  }
)

const listFieldVariants = cva('flex flex-1 flex-col items-stretch justify-center gap-1 text-sm', {
  variants: {
    right: {
      true: 'items-end'
    }
  }
})

interface ListItemProps extends React.ComponentProps<'div'>, VariantProps<typeof listItemVariants> {
  thumbnail?: React.ReactNode
  actions?: React.ReactNode
  asChild?: boolean
  isLast?: boolean
  isHeader?: boolean
  disableHover?: boolean
}

interface ListFieldProps extends Omit<React.ComponentProps<'div'>, 'title'>, VariantProps<typeof listFieldVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  label?: boolean
  secondary?: boolean
}

interface ListProps extends React.ComponentProps<'div'> {
  onlyTopRounded?: boolean
  borderBackground?: boolean
}

const List: React.FC<ListProps> = ({ className, children, onlyTopRounded, borderBackground, ...props }) => (
  <div
    className={cn(
      'w-full',
      'border [&>div:last-child]:border-0',
      onlyTopRounded ? 'rounded-t-md' : 'rounded-md',
      borderBackground ? 'border-border-background' : '',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

List.displayName = 'StackedList'

const ListItem = ({
  className,
  children,
  thumbnail,
  actions,
  asChild,
  isLast,
  isHeader,
  disableHover = false,
  ...props
}: ListItemProps) => {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={cn(
        listItemVariants({}),
        className,
        isLast ? 'border-none' : 'border-b',
        isHeader ? 'bg-primary/[0.01]' : '',
        disableHover ? '' : 'hover:bg-primary/5 cursor-pointer duration-150 ease-in-out'
      )}
      {...props}
    >
      {thumbnail && <div className="mr-2 flex items-center">{thumbnail}</div>}
      <Slottable>{children}</Slottable>
      {actions && <div className="ml-2 flex items-center">{actions}</div>}
      <Icon name="chevron-right" className="hidden" />
    </Comp>
  )
}

ListItem.displayName = 'StackedListItem'

const ListField = ({ className, title, description, label, secondary, right, ...props }: ListFieldProps) => (
  <div className={cn(listFieldVariants({ right }), className)} {...props}>
    {title && (
      <div
        className={cn(
          secondary ? 'text-xs' : 'text-sm', // Conditionally apply text-xs if secondary is true
          'text-primary [&>em]:text-primary font-normal [&>em]:font-medium [&>em]:not-italic',
          label && 'text-tertiary-background',
          className
        )}
      >
        {title}
      </div>
    )}
    {description && (
      <div
        className={cn(
          'text-tertiary-background flex gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-xs',
          className
        )}
      >
        {description}
      </div>
    )}
  </div>
)

ListField.displayName = 'StackedListField'

const Root = List
const Item = ListItem
const Field = ListField

export { Root, Item, Field }

export type { ListItemProps, ListFieldProps }
