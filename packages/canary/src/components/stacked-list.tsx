import * as React from 'react'
import { Slot, Slottable } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { NavArrowRight } from '@harnessio/icons-noir'

const listItemVariants = cva(
  'p-2 align-middle flex flex-row flex-1 gap-1 px-4 py-3 border-b flex-wrap justify-start items-center',
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

const listFieldVariants = cva(
  'text-sm gap-1 flex flex-col flex-1 justify-start items-center justify-center items-stretch',
  {
    variants: {
      right: {
        true: 'items-end'
      }
    }
  }
)

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
      '[&>div:last-child]:border-0 border',
      onlyTopRounded ? 'rounded-t-md' : 'rounded-md',
      borderBackground ? 'border-border-background' : '',
      className
    )}
    {...props}>
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
        disableHover ? '' : 'hover:bg-primary/5 ease-in-out duration-150 cursor-pointer'
      )}
      {...props}>
      {thumbnail && <div className="mr-2 flex items-center">{thumbnail}</div>}
      <Slottable>{children}</Slottable>
      {actions && <div className="ml-2 flex items-center">{actions}</div>}
      <NavArrowRight className="hidden" strokeWidth="1.5" />
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
          'font-normal text-primary [&>em]:font-medium [&>em]:text-primary [&>em]:not-italic',
          label && 'text-tertiary-background',
          className
        )}>
        {title}
      </div>
    )}
    {description && (
      <div
        className={cn(
          'flex gap-2 text-xs text-tertiary-background whitespace-nowrap overflow-hidden text-ellipsis',
          className
        )}>
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
