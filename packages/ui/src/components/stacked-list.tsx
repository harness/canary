import * as React from 'react'

import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

const listItemVariants = cva(
  'flex flex-1 flex-row flex-wrap items-center justify-start gap-1 border-b p-4 align-middle',
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

const listFieldVariants = cva('flex flex-1 flex-col items-stretch justify-center gap-[0.3125rem] text-sm', {
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
  primary?: boolean
}

interface ListProps extends React.ComponentProps<'div'> {
  onlyTopRounded?: boolean
  borderBackground?: boolean
  withoutBorder?: boolean
}

const List: React.FC<ListProps> = ({
  className,
  children,
  onlyTopRounded,
  borderBackground,
  withoutBorder = false,
  ...props
}) => (
  <div
    className={cn(
<<<<<<< HEAD
      'w-full bg-cn-background-2',
=======
      'w-full bg-cds-background-surface',
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
      'border [&>div:last-child]:border-0',
      '[&>*:first-child_>.stacked-list-item]:rounded-t-md [&>.stacked-list-item:first-child]:rounded-t-md',
      {
        '[&>*:last-child_>.stacked-list-item]:rounded-b-md [&>.stacked-list-item:last-child]:rounded-b-md':
          !onlyTopRounded
      },
      onlyTopRounded ? 'rounded-t-md' : 'rounded-md',
      withoutBorder ? 'border-none' : '',
      borderBackground ? 'border-cn-borders-2' : '',
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
  const Comp = asChild ? Slot : ('div' as any)

  return (
    <Comp
      className={cn(
        'stacked-list-item',
        listItemVariants({}),
        className,
        isLast ? 'border-none' : 'border-b',
<<<<<<< HEAD
        isHeader ? 'bg-cn-background-2' : '',
        disableHover ? '' : 'hover:bg-cn-background-hover cursor-pointer duration-150 ease-in-out'
=======
        isHeader ? 'bg-cds-background-2' : '',
        disableHover ? '' : 'hover:bg-cds-background-4 cursor-pointer duration-150 ease-in-out'
>>>>>>> b1385c7b8 (Update bg-background variants to bg-cds-background containing new colors)
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

const ListField = ({ className, title, description, label, primary, secondary, right, ...props }: ListFieldProps) => (
  <div className={cn(listFieldVariants({ right }), className)} {...props}>
    {title && (
      <div
        className={cn(
          primary ? 'text-16 leading-snug' : secondary ? 'text-xs' : 'text-sm',
          'text-cn-foreground-1 [&>em]:text-cn-foreground-1 font-normal [&>em]:font-medium [&>em]:not-italic',
          !!label && 'text-cn-foreground-2',
          className
        )}
      >
        {title}
      </div>
    )}
    {description && (
      <div
        className={cn(
          'text-cn-foreground-2 flex gap-2 text-ellipsis whitespace-nowrap',
          primary ? 'text-sm' : 'text-xs',
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
