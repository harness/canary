import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef
} from 'react'

import { usePortal, useTranslation } from '@/context'
import { afterFrames, cn, filterChildrenByDisplayNames, getShadowActiveElement, useMergeRefs } from '@/utils'
import { Avatar, AvatarProps } from '@components/avatar'
import { Layout } from '@components/layout'
import { ScrollArea, ScrollAreaProps } from '@components/scroll-area'
import { Text, TextProps } from '@components/text'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { omit } from 'lodash-es'

import { IconPropsV2, IconV2 } from './icon-v2'
import { LogoV2, LogoV2NamesType } from './logo-v2'
import { Tag, TagProps } from './tag'

const DropdownMenuRoot = DropdownMenuPrimitive.Root
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger
const DropdownMenuSub = DropdownMenuPrimitive.Sub

const displayNames = {
  root: 'DropdownMenuRoot',
  portal: 'DropdownMenuPortal',
  radioGroup: 'DropdownMenuRadioGroup',
  trigger: 'DropdownMenuTrigger',
  group: 'DropdownMenuGroup',
  sub: 'DropdownMenuSub',
  subTrigger: 'DropdownMenuSubTrigger',
  subContent: 'DropdownMenuSubContent',
  content: 'DropdownMenuContent',
  item: 'DropdownMenuItem',
  checkboxItem: 'DropdownMenuCheckboxItem',
  radioItem: 'DropdownMenuRadioItem',
  avatarItem: 'DropdownMenuAvatarItem',
  logoItem: 'DropdownMenuLogoItem',
  iconItem: 'DropdownMenuIconItem',
  indicatorItem: 'DropdownMenuIndicatorItem',
  separator: 'DropdownMenuSeparator',
  header: 'DropdownMenuHeader',
  footer: 'DropdownMenuFooter',
  spinner: 'DropdownMenuSpinner',
  noOptions: 'DropdownMenuNoOptions',
  slot: 'DropdownMenuSlot'
}

DropdownMenuRoot.displayName = displayNames.root
DropdownMenuPortal.displayName = displayNames.portal
DropdownMenuTrigger.displayName = displayNames.trigger
DropdownMenuSubTrigger.displayName = displayNames.subTrigger
DropdownMenuSub.displayName = displayNames.sub

const innerComponentsDisplayNames = [
  displayNames.group,
  displayNames.item,
  displayNames.checkboxItem,
  displayNames.radioGroup,
  displayNames.radioItem,
  displayNames.separator,
  displayNames.header,
  displayNames.footer
]

interface DropdownMenuContentProps extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  isSubContent?: boolean
  scrollAreaProps?: Omit<ScrollAreaProps, 'children'>
  onOpenAutoFocus?: (event: Event) => void
}

const DropdownMenuContent = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Content>, DropdownMenuContentProps>(
  (
    {
      className,
      children: _children,
      sideOffset = 4,
      isSubContent,
      scrollAreaProps,
      onKeyDownCapture: propOnKeyDownCapture,
      ...props
    },
    ref
  ) => {
    const { portalContainer } = usePortal()
    const contentRef = useRef<HTMLDivElement | null>(null)
    const Primitive = isSubContent ? DropdownMenuPrimitive.SubContent : DropdownMenuPrimitive.Content

    const header = filterChildrenByDisplayNames(_children, [displayNames.header])[0]
    const footer = filterChildrenByDisplayNames(_children, [displayNames.footer])[0]
    const children = filterChildrenByDisplayNames(_children, [displayNames.header, displayNames.footer], true)

    const mergedRef = useMergeRefs<HTMLDivElement>([
      node => {
        if (!node) return

        contentRef.current = node
      },
      ref
    ])

    /**
     * !!! This code is executed only when inside a ShadowRoot
     *
     * To navigate between items using the top and down arrow keys
     */
    const onKeyDownCaptureHandler = (e: KeyboardEvent<HTMLDivElement>) => {
      /**
       * To block further code execution in onKeyDownCaptureHandler,
       * need to call e.preventDefault() inside propOnKeyDownCapture.
       */
      propOnKeyDownCapture?.(e)
      if (e.defaultPrevented || e.isDefaultPrevented?.()) return

      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      const rootEl = contentRef.current
      if (!rootEl) return

      const { isShadowRoot, activeEl } = getShadowActiveElement(rootEl)

      if (!isShadowRoot) return

      const items = Array.from(
        rootEl.querySelectorAll<HTMLElement>('[data-radix-collection-item]:not([data-disabled])[role*="menuitem"]')
      )

      if (!items.length) return

      let idx = items.findIndex(el => el === activeEl || (activeEl instanceof Element && el.contains(activeEl)))

      if (idx === -1) {
        idx = e.key === 'ArrowDown' ? -1 : 0
      }

      const next =
        e.key === 'ArrowDown' ? (idx + 1 + items.length) % items.length : (idx - 1 + items.length) % items.length

      e.preventDefault()
      e.stopPropagation()
      items[next]?.focus()
    }

    return (
      <DropdownMenuPortal container={portalContainer}>
        <Primitive
          ref={mergedRef}
          sideOffset={sideOffset}
          className={cn('cn-dropdown-menu', className)}
          onKeyDownCapture={onKeyDownCaptureHandler}
          {...props}
        >
          {!!header && <div className="cn-dropdown-menu-container cn-dropdown-menu-container-header">{header}</div>}

          <ScrollArea className="cn-dropdown-menu-content" {...scrollAreaProps}>
            <div className="cn-dropdown-menu-container">{children}</div>
          </ScrollArea>

          {!!footer && <div className="cn-dropdown-menu-container cn-dropdown-menu-container-footer">{footer}</div>}
        </Primitive>
      </DropdownMenuPortal>
    )
  }
)
DropdownMenuContent.displayName = displayNames.content

const DropdownMenuGroup = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Group>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group> & { label?: string }
>(({ children, label, ...props }, ref) => (
  <DropdownMenuPrimitive.Group ref={ref} {...props}>
    {label && (
      <DropdownMenuPrimitive.Label className="cn-dropdown-menu-group-label">{label}</DropdownMenuPrimitive.Label>
    )}
    {children}
  </DropdownMenuPrimitive.Group>
))
DropdownMenuGroup.displayName = displayNames.group

interface DropdownBaseItemProps {
  title?: ReactNode
  children?: ReactNode
  className?: string
  description?: ReactNode
  label?: string | ReactNode
  shortcut?: string
  checkmark?: boolean
  tag?: TagProps
  withSubIndicator?: ReactNode
}

const DropdownBaseItem = ({
  children,
  className,
  title,
  description,
  label,
  tag,
  shortcut,
  checkmark,
  withSubIndicator
}: DropdownBaseItemProps) => (
  <div className={cn('cn-dropdown-menu-base-item', className)}>
    {children}
    <Layout.Grid gapX="2xs" className="w-fit">
      {typeof title === 'string' ? <Text color="foreground-1">{title}</Text> : title}
      {typeof description === 'string' ? <Text>{description}</Text> : description}
    </Layout.Grid>
    {tag && <Tag {...tag} />}

    <div className="ml-auto">
      {label && <Text variant="caption-soft">{label}</Text>}
      {shortcut && <Text variant="caption-soft">{shortcut}</Text>}
      {checkmark && <IconV2 name="check" />}
      {withSubIndicator && <IconV2 name="nav-arrow-right" size="xs" />}
    </div>
  </div>
)

interface DropdownMenuItemProps
  extends Omit<DropdownBaseItemProps, 'withSubIndicator'>,
    Omit<ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>, 'title' | 'prefix'> {
  prefix?: ReactNode
  subContentProps?: Omit<DropdownMenuContentProps, 'isSubContent'>
  subMenuProps?: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>
}

const DropdownMenuItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuItemProps>(
  (
    {
      className,
      children,
      title,
      description,
      label,
      shortcut,
      checkmark,
      prefix,
      tag,
      subContentProps,
      subMenuProps,
      ...props
    },
    ref
  ) => {
    const filteredChildren = filterChildrenByDisplayNames(children, innerComponentsDisplayNames)
    const withChildren = filteredChildren.length > 0

    const ItemContent = () => (
      <DropdownBaseItem {...{ title, description, label, shortcut, checkmark, tag, withSubIndicator: withChildren }}>
        {prefix}
      </DropdownBaseItem>
    )

    if (withChildren) {
      return (
        <DropdownMenuSub {...subMenuProps}>
          <DropdownMenuSubTrigger
            ref={ref}
            className={cn('cn-dropdown-menu-item cn-dropdown-menu-item-subtrigger', className)}
            {...omit(props, ['onSelect'])}
          >
            <ItemContent />
          </DropdownMenuSubTrigger>
          <DropdownMenuContent isSubContent {...subContentProps}>
            {filteredChildren}
          </DropdownMenuContent>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuPrimitive.Item ref={ref} className={cn('cn-dropdown-menu-item', className)} {...props}>
        <ItemContent />
      </DropdownMenuPrimitive.Item>
    )
  }
)
DropdownMenuItem.displayName = displayNames.item

interface DropdownMenuCheckboxItemProps
  extends Omit<DropdownBaseItemProps, 'withSubIndicator'>,
    Omit<ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>, 'title' | 'onSelect'> {
  subContentProps?: Omit<DropdownMenuContentProps, 'isSubContent'>
  subMenuProps?: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub>
}

const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(
  (
    {
      className,
      children,
      checked,
      title,
      description,
      label,
      shortcut,
      checkmark,
      tag,
      onCheckedChange,
      onClick,
      subContentProps,
      subMenuProps,
      ...props
    },
    ref
  ) => {
    const filteredChildren = filterChildrenByDisplayNames(children, innerComponentsDisplayNames)
    const withChildren = filteredChildren.length > 0
    const checkedDataState = checked === true ? 'checked' : checked

    const ItemContent = () => (
      <DropdownBaseItem {...{ title, description, label, shortcut, checkmark, tag, withSubIndicator: withChildren }}>
        <div className="cn-checkbox-root" {...{ 'data-state': checkedDataState }}>
          {checked && (
            <div className="cn-checkbox-indicator" {...{ 'data-state': checkedDataState }}>
              {checked === 'indeterminate' ? (
                <IconV2 name="minus" className="cn-checkbox-icon" size="2xs" />
              ) : (
                <IconV2 name="check" className="cn-checkbox-icon" size="2xs" />
              )}
            </div>
          )}
        </div>
      </DropdownBaseItem>
    )

    if (withChildren) {
      return (
        <DropdownMenuSub {...subMenuProps}>
          <DropdownMenuSubTrigger
            ref={ref}
            className={cn('cn-dropdown-menu-item cn-dropdown-menu-item-subtrigger', className)}
            onClick={e => {
              e.stopPropagation()
              e.preventDefault()

              if (props.disabled) return

              onClick?.(e)
              onCheckedChange?.(checked === 'indeterminate' ? false : !checked)
            }}
            {...props}
          >
            <ItemContent />
          </DropdownMenuSubTrigger>
          <DropdownMenuContent isSubContent {...subContentProps}>
            {filteredChildren}
          </DropdownMenuContent>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn('cn-dropdown-menu-item', className)}
        checked={checked}
        onSelect={e => {
          e.stopPropagation()
          e.preventDefault()
        }}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        <ItemContent />
      </DropdownMenuPrimitive.CheckboxItem>
    )
  }
)
DropdownMenuCheckboxItem.displayName = displayNames.checkboxItem

interface DropdownMenuRadioItemProps
  extends Omit<DropdownBaseItemProps, 'withSubIndicator'>,
    Omit<ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>, 'title'> {}

const DropdownMenuRadioGroup = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioGroup>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup> & { label?: string }
>(({ children, label, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioGroup ref={ref} {...props}>
    {label && (
      <DropdownMenuPrimitive.Label className="cn-dropdown-menu-group-label">{label}</DropdownMenuPrimitive.Label>
    )}
    {children}
  </DropdownMenuPrimitive.RadioGroup>
))
DropdownMenuRadioGroup.displayName = displayNames.radioGroup

const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  Omit<DropdownMenuRadioItemProps, 'children' | 'onSelect'>
>(({ className, title, description, label, shortcut, checkmark, tag, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn('cn-dropdown-menu-item', className)}
    onSelect={e => {
      e.stopPropagation()
      e.preventDefault()
    }}
    {...props}
  >
    <DropdownBaseItem {...{ title, description, label, shortcut, checkmark, tag }}>
      <div className="cn-radio-item">
        <DropdownMenuPrimitive.ItemIndicator className="cn-radio-item-indicator" />
      </div>
    </DropdownBaseItem>
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = displayNames.radioItem

interface DropdownMenuAvatarItemProps extends Omit<DropdownMenuItemProps, 'prefix'> {
  src?: AvatarProps['src']
  name?: AvatarProps['name']
  rounded?: AvatarProps['rounded']
}

const DropdownMenuAvatarItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuAvatarItemProps>(
  ({ src, rounded = true, name, ...props }, ref) => (
    <DropdownMenuItem
      ref={ref}
      {...props}
      prefix={<Avatar size={props.description ? 'lg' : 'sm'} src={src} rounded={rounded} name={name} />}
    />
  )
)
DropdownMenuAvatarItem.displayName = displayNames.avatarItem

interface DropdownMenuLogoItemProps extends Omit<DropdownMenuItemProps, 'prefix'> {
  logo: LogoV2NamesType
}

const DropdownMenuLogoItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuLogoItemProps>(
  ({ logo, ...props }, ref) => <DropdownMenuItem ref={ref} {...props} prefix={<LogoV2 name={logo} />} />
)
DropdownMenuLogoItem.displayName = displayNames.logoItem

interface DropdownMenuIconItemProps extends Omit<DropdownMenuItemProps, 'prefix'> {
  icon: IconPropsV2['name']
  iconClassName?: string
}

const DropdownMenuIconItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuIconItemProps>(
  ({ icon, iconClassName, ...props }, ref) => (
    <DropdownMenuItem ref={ref} {...props} prefix={<IconV2 name={icon} className={iconClassName} fallback="stop" />} />
  )
)
DropdownMenuIconItem.displayName = displayNames.iconItem

interface DropdownMenuIndicatorItemProps extends Omit<DropdownMenuItemProps, 'prefix'> {
  color:
    | 'gray'
    | 'green'
    | 'red'
    | 'yellow'
    | 'blue'
    | 'purple'
    | 'brown'
    | 'cyan'
    | 'indigo'
    | 'lime'
    | 'mint'
    | 'orange'
    | 'pink'
    | 'violet'
  pulse?: boolean
}

const DropdownMenuIndicatorItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuIndicatorItemProps
>(({ color, pulse, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    {...props}
    prefix={
      <div
        className={cn(`cn-dropdown-menu-item-indicator cn-dropdown-menu-item-indicator-${color}`, {
          'animate-pulse': pulse
        })}
      />
    }
  />
))
DropdownMenuIndicatorItem.displayName = displayNames.indicatorItem

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn('cn-dropdown-menu-separator', className)} {...props} />
))
DropdownMenuSeparator.displayName = displayNames.separator

const DropdownMenuHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn('cn-dropdown-menu-header', className)} ref={ref} {...props} />
)
DropdownMenuHeader.displayName = displayNames.header

const DropdownMenuFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn('cn-dropdown-menu-footer', className)} ref={ref} {...props} />
)
DropdownMenuFooter.displayName = displayNames.footer

const DropdownMenuSpinner = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn('cn-dropdown-menu-spinner', className)} ref={ref} {...props}>
      <IconV2 className="animate-spin" name="loader" />
    </div>
  )
)
DropdownMenuSpinner.displayName = displayNames.spinner

const DropdownMenuNoOptions = ({ className, children, ...props }: Omit<TextProps, 'ref'>) => {
  const { t } = useTranslation()

  return (
    <Text className={cn('cn-dropdown-menu-no-options', className)} color="foreground-3" {...props}>
      {children ?? t('component:dropdownMenu.noOptions', 'No options available')}
    </Text>
  )
}
DropdownMenuNoOptions.displayName = displayNames.noOptions

const DropdownMenuSlot = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} {...props}>
    {props.children}
  </div>
))
DropdownMenuSlot.displayName = displayNames.slot

const useSearchableDropdownKeyboardNavigation = ({
  onFirstItemKeyDown,
  onLastItemKeyDown,
  itemsLength
}: {
  onFirstItemKeyDown?: () => void
  onLastItemKeyDown?: () => void
  itemsLength: number
}) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const firstItemRef = useRef<HTMLDivElement | null>(null)
  const lastItemRef = useRef<HTMLDivElement | null>(null)

  const isSingleItem = useMemo(() => itemsLength === 1, [itemsLength])

  const handleSearchKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        afterFrames(() => {
          firstItemRef.current?.focus()
        })
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        afterFrames(() => {
          lastItemRef.current?.focus()
        })
      }

      if (e.key === 'ArrowUp' && isSingleItem) {
        e.preventDefault()
        afterFrames(() => {
          firstItemRef.current?.focus()
        })
      }
    },
    [isSingleItem]
  )

  const handleFirstItemKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        searchInputRef.current?.focus()
        onFirstItemKeyDown?.()
      }

      if (e.key === 'ArrowDown' && isSingleItem) {
        e.preventDefault()
        searchInputRef.current?.focus()
        onLastItemKeyDown?.()
      }
    },
    [isSingleItem, onFirstItemKeyDown, onLastItemKeyDown]
  )

  const handleLastItemKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        searchInputRef.current?.focus()
        onLastItemKeyDown?.()
      }
    },
    [onLastItemKeyDown]
  )

  const getItemProps = useCallback(
    (index: number) => {
      return {
        ref: index === 0 ? firstItemRef : index === itemsLength - 1 ? lastItemRef : undefined,
        onKeyDown: index === 0 ? handleFirstItemKeyDown : index === itemsLength - 1 ? handleLastItemKeyDown : undefined
      }
    },
    [firstItemRef, lastItemRef, handleFirstItemKeyDown, handleLastItemKeyDown, itemsLength]
  )

  return {
    searchInputRef,
    firstItemRef,
    lastItemRef,
    handleSearchKeyDown,
    handleFirstItemKeyDown,
    handleLastItemKeyDown,
    getItemProps
  }
}

const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  AvatarItem: DropdownMenuAvatarItem,
  LogoItem: DropdownMenuLogoItem,
  IconItem: DropdownMenuIconItem,
  IndicatorItem: DropdownMenuIndicatorItem,
  Separator: DropdownMenuSeparator,
  Group: DropdownMenuGroup,
  RadioGroup: DropdownMenuRadioGroup,
  Header: DropdownMenuHeader,
  Footer: DropdownMenuFooter,
  Spinner: DropdownMenuSpinner,
  NoOptions: DropdownMenuNoOptions,
  Slot: DropdownMenuSlot
}

export { DropdownMenu, useSearchableDropdownKeyboardNavigation, DropdownMenuItemProps }
