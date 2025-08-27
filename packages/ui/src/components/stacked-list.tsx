import * as React from 'react'

import { Link, LinkProps, Text } from '@/components'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const listFieldVariants = cva('gap-cn-2xs flex flex-1 flex-col items-stretch justify-start', {
  variants: {
    right: {
      true: 'items-end justify-end'
    }
  }
})

interface ListItemProps extends React.ComponentProps<'div'> {
  thumbnail?: React.ReactNode
  actions?: React.ReactNode
  asChild?: boolean
  isLast?: boolean
  isHeader?: boolean
  disableHover?: boolean
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
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
  to,
  linkProps,
  ...props
}: ListItemProps) => {
  const Comp = asChild ? Slot : ('div' as any)

  return (
    <Comp
      className={cn(
        'stacked-list-item relative flex flex-1 flex-row flex-wrap items-center justify-start gap-1 border-b p-4 align-middle border-b',
        className,
        { 'border-none': isLast },
        { 'bg-cn-background-2': isHeader },
        {
          'focus:bg-cn-background-hover hover:bg-cn-background-hover cursor-pointer duration-150 ease-in-out':
            !disableHover
        },
        { '[&_a]:z-10 [&_button]:relative [&_button]:z-10': to || linkProps }
      )}
      {...props}
    >
      {(to || linkProps) && <Link className="absolute inset-0 w-full rounded-3" to={to || ''} {...(linkProps || {})} />}
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
