import {
  Children,
  ComponentPropsWithoutRef,
  ElementRef,
  FC,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode
} from 'react'

import { Caption, Icon, Label, Message, MessageTheme, SearchBox } from '@/components'
import { usePortal } from '@/context'
import { useDebounceSearch } from '@hooks/use-debounce-search'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@utils/cn'

export interface SelectRootProps
  extends Omit<Omit<PropsWithChildren<HTMLAttributes<HTMLElement>>, 'defaultValue'>, 'dir'>,
    SelectPrimitive.SelectProps {
  label?: string
  error?: string
  caption?: ReactNode
  disabled?: boolean
  placeholder?: string
  selectValueChildren?: ReactNode
}

/**
 * A customizable select component that supports labels, error states, and captions
 * @example
 * <Select.Root name="select" label="Select an option" placeholder="Select an option">
 *   <Select.Content>
 *     <Select.Item val`ue="option1">Option 1</Select.Item>
 *     <Select.Item val`ue="option2">Option 2</Select.Item>
 *   </Select.Content>
 * </Select.Root>
 */
const SelectRoot: FC<SelectRootProps> = ({
  name,
  label,
  error,
  caption,
  disabled = false,
  placeholder = '',
  children,
  selectValueChildren,
  ...props
}) => (
  <SelectPrimitive.Root {...props}>
    {label && (
      <Label className="mb-2.5" color={disabled ? 'disabled-dark' : 'secondary'} htmlFor={name}>
        {label}
      </Label>
    )}
    <SelectTrigger
      className={cn(props.value ? 'text-foreground-1' : 'text-foreground-2')}
      id={name}
      disabled={disabled}
    >
      <SelectValue placeholder={placeholder} asChild={!!selectValueChildren}>
        {selectValueChildren}
      </SelectValue>
    </SelectTrigger>
    {children}

    {error && (
      <Message className="mt-0.5" theme={MessageTheme.ERROR}>
        {error}
      </Message>
    )}

    {caption && <Caption className={cn({ 'text-foreground-9': disabled })}>{caption}</Caption>}
  </SelectPrimitive.Root>
)
SelectRoot.displayName = SelectPrimitive.Root.displayName

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

/**
 * The trigger button for the select dropdown
 */
const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { iconClassName?: string }
>(({ className, children, iconClassName, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'border-borders-2 ring-offset-background flex h-9 w-full items-center justify-between whitespace-nowrap rounded border bg-input-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:rounded disabled:cursor-not-allowed disabled:border-borders-1 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icon name="chevron-down" size={12} className={iconClassName} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

export interface SelectContentSearchProps {
  placeholder?: string
  searchValue: string
  handleChangeSearchValue: (data: string) => void
}

export type SelectContentSearchType =
  | {
      withSearch: true
      searchProps: SelectContentSearchProps
    }
  | {
      withSearch?: false
      searchProps?: SelectContentSearchProps
    }

/**
 * The content container for the select dropdown
 * *Can include a search panel for options if withSearch is true and searchProps are provided.
 */
const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & SelectContentSearchType
>(({ className, children, position = 'popper', withSearch, searchProps, ...props }, ref) => {
  const { search, handleSearchChange } = useDebounceSearch({
    handleChangeSearchValue: searchProps?.handleChangeSearchValue,
    searchValue: searchProps?.searchValue
  })

  const { portalContainer } = usePortal()

  return (
    <SelectPrimitive.Portal container={portalContainer}>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] max-w-[var(--radix-popper-anchor-width)] overflow-hidden rounded box-border',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            'p-1 rounded-md border',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {!!withSearch && (
            <div className="sticky -top-1 z-[1] -mx-1 -mt-1 mb-1 border-b bg-background-2 px-3 py-2.5">
              <SearchBox.Root
                className="w-full"
                placeholder={searchProps?.placeholder || ''}
                value={search}
                handleChange={handleSearchChange}
              />
            </div>
          )}

          {children && !!Children.count(children) ? (
            children
          ) : (
            <div className="px-5 py-4 text-center">
              <span className="leading-tight text-foreground-2">Nothing to select</span>
            </div>
          )}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * A label component for grouping select items
 */
const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * An individual selectable item within the dropdown
 */
const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    isItemTextAsChild?: boolean
  }
>(({ className, children, isItemTextAsChild, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:outline-none',
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText asChild={!!isItemTextAsChild}>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * A visual separator between select items
 */
const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('bg-muted -mx-1 my-1 h-px', className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const Select = {
  Root: SelectRoot,
  Group: SelectGroup,
  Content: SelectContent,
  Label: SelectLabel,
  Item: SelectItem,
  Separator: SelectSeparator
}

export { Select }
