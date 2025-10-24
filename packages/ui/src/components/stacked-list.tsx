import * as React from 'react'

import { Text } from '@/components'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

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

const listFieldVariants = cva('gap-cn-2xs flex flex-1 flex-col items-stretch justify-start', {
  variants: {
    right: {
      true: 'items-end justify-end'
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
  primary?: boolean
  disableTruncate?: boolean
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
      'w-full bg-cn-background-1',
      'border [&>div:last-child]:border-0',
      '[&>*:first-child_>.stacked-list-item]:rounded-t-3 [&>.stacked-list-item:first-child]:rounded-t-3',
      {
        '[&>*:last-child_>.stacked-list-item]:rounded-b-3 [&>.stacked-list-item:last-child]:rounded-b-3':
          !onlyTopRounded
      },
      onlyTopRounded ? 'rounded-t-3' : 'rounded-3',
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
        isHeader ? 'bg-cn-background-2' : '',
        disableHover
          ? ''
          : 'focus:bg-cn-background-hover hover:bg-cn-background-hover cursor-pointer duration-150 ease-in-out'
      )}
      {...props}
    >
      {thumbnail && <div className="mr-2 flex items-center">{thumbnail}</div>}
      <Slottable>{children}</Slottable>
      {actions && <div className="ml-2 flex items-center">{actions}</div>}
    </Comp>
  )
}

ListItem.displayName = 'StackedListItem'

const ListField = ({
  className,
  title,
  description,
  label,
  primary,
  right,
  disableTruncate = false,
  ...props
}: ListFieldProps) => (
  <div className={cn(listFieldVariants({ right }), className)} {...props}>
    {title && (
      <Text
        as="div"
        variant={primary ? 'heading-base' : 'body-normal'}
        color={label ? 'foreground-2' : 'foreground-1'}
        truncate={!disableTruncate}
        className="min-w-0"
      >
        {title}
      </Text>
    )}
    {description && (
      <Text className={cn('flex gap-2', className)} as="div" variant="body-normal" truncate={!disableTruncate}>
        {description}
      </Text>
    )}
  </div>
)

ListField.displayName = 'StackedListField'

const Root = List
const Item = ListItem
const Field = ListField

export { Root, Item, Field }

export type { ListItemProps, ListFieldProps }
