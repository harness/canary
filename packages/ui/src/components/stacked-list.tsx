import { ComponentProps, FC, forwardRef, ReactNode } from 'react'

import { Link, LinkProps, Pagination, PaginationProps, Text, TextProps, withTooltip } from '@/components'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export const stackedListVariants = cva('cn-stacked-list', {
  variants: {
    border: {
      false: 'cn-stacked-list-border-no'
    },
    rounded: {
      top: 'cn-stacked-list-rounded-top'
    }
  }
})

const spacings = ['4xs', '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '0'] as const
type Spacing = (typeof spacings)[number]

const createSpacingMap = (prefix: string) => {
  return Object.fromEntries(spacings.map(s => [s, `${prefix}${s === '0' ? '-' : '-cn-'}${s}`])) as Record<
    Spacing,
    string
  >
}

export const stackedListItemVariants = cva('cn-stacked-list-item', {
  variants: {
    paddingX: createSpacingMap('px'),
    paddingY: createSpacingMap('py'),
    disableHover: {
      true: '',
      false: 'cn-stacked-list-item-with-hover'
    }
  },
  defaultVariants: {
    disableHover: false,
    paddingX: 'md',
    paddingY: 'md'
  }
})

export type StackedListPaginationProps = PaginationProps &
  Pick<VariantProps<typeof stackedListItemVariants>, 'paddingX' | 'paddingY'>

type ListProps = ComponentProps<'div'> &
  VariantProps<typeof stackedListVariants> & {
    paginationProps?: StackedListPaginationProps
  }

const List: FC<ListProps> = ({
  children,
  className,
  border,
  rounded,
  paginationProps: {
    className: paginationClassName,
    paddingX,
    paddingY,
    ...paginationProps
  } = {} as StackedListPaginationProps,
  ...props
}) => (
  <div className={cn(stackedListVariants({ border, rounded }), className)} {...props}>
    {children}
    {paginationProps && (
      <Pagination
        {...paginationProps}
        className={cn(
          '!mt-0',
          stackedListItemVariants({ paddingX, paddingY, disableHover: true }),
          paginationClassName
        )}
      />
    )}
  </div>
)
List.displayName = 'StackedList'

interface ListItemProps extends Omit<ComponentProps<'div'>, 'ref'>, VariantProps<typeof stackedListItemVariants> {
  thumbnail?: ReactNode
  actions?: ReactNode
  asChild?: boolean
  to?: string
  linkProps?: Omit<LinkProps, 'to'>
  onClick?: () => void
}

const ListItemComp = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      className,
      children,
      thumbnail,
      actions,
      asChild,
      to,
      linkProps,
      disableHover = false,
      paddingX = 'md',
      paddingY = 'md',
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : ('div' as any)
    const withLink = !!to || !!linkProps
    const withButton = !to && !linkProps && !!onClick

    return (
      <Comp
        ref={ref}
        className={cn(
          stackedListItemVariants({ paddingX, paddingY, disableHover }),
          { 'cn-stacked-list-item-clickable': withLink || withButton },
          className
        )}
        {...props}
      >
        {withLink && (
          <Link
            className="cn-stacked-list-item-clickable-block"
            to={to || ''}
            {...(linkProps || {})}
            onClick={() => onClick?.()}
          />
        )}
        {withButton && <button className="cn-stacked-list-item-clickable-block" onClick={() => onClick?.()} />}
        {thumbnail && <div className="cn-stacked-list-item-thumbnail">{thumbnail}</div>}
        <Slottable>{children}</Slottable>
        {actions && <div className="cn-stacked-list-item-actions">{actions}</div>}
      </Comp>
    )
  }
)
ListItemComp.displayName = 'StackedListItem'
const ListItem = withTooltip(ListItemComp)

const ListHeader = forwardRef<HTMLDivElement, Omit<ListItemProps, 'disableHover'>>(
  ({ className, paddingY = 'xs', ...props }, ref) => {
    return (
      <ListItem
        ref={ref}
        className={cn('cn-stacked-list-item-header', className)}
        paddingY={paddingY}
        disableHover
        {...props}
      />
    )
  }
)
ListHeader.displayName = 'StackedListHeader'

/**
 * Field
 */

const listFieldVariants = cva('cn-stacked-list-field', {
  variants: {
    right: {
      true: 'cn-stacked-list-field-right'
    }
  }
})

interface ListFieldProps extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof listFieldVariants> {
  title?: ReactNode
  description?: ReactNode
  titleColor?: TextProps['color']
  disableTruncate?: boolean
}

const ListField = ({
  className,
  title,
  description,
  titleColor = 'foreground-1',
  right,
  disableTruncate = false,
  ...props
}: ListFieldProps) => (
  <div className={cn(listFieldVariants({ right }), className)} {...props}>
    {title && (
      <Text className="cn-stacked-list-field-title" as="div" color={titleColor} truncate={!disableTruncate}>
        {title}
      </Text>
    )}
    {description && (
      <Text as="div" className="select-none" truncate={!disableTruncate}>
        {description}
      </Text>
    )}
  </div>
)

ListField.displayName = 'StackedListField'

const StackedList = {
  Root: List,
  Header: ListHeader,
  Item: ListItem,
  Field: ListField
}

export { StackedList }

export type { ListItemProps, ListFieldProps }
