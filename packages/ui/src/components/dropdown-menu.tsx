import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes, ReactNode } from 'react'

import { usePortal, useTranslation } from '@/context'
import { cn, filterChildrenByDisplayNames } from '@/utils'
import { Avatar, AvatarProps } from '@components/avatar'
import { Layout } from '@components/layout'
import { ScrollArea, ScrollAreaIntersectionProps } from '@components/scroll-area'
import { Text, TextProps } from '@components/text'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { omit } from 'lodash-es'

import { IconPropsV2, IconV2 } from './icon-v2'
import { LogoV2, LogoV2NamesType } from './logo-v2'

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
  scrollAreaProps?: ScrollAreaIntersectionProps
}

const DropdownMenuContent = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Content>, DropdownMenuContentProps>(
  ({ className, children: _children, sideOffset = 4, isSubContent, scrollAreaProps, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const Primitive = isSubContent ? DropdownMenuPrimitive.SubContent : DropdownMenuPrimitive.Content

    const header = filterChildrenByDisplayNames(_children, [displayNames.header])[0]
    const footer = filterChildrenByDisplayNames(_children, [displayNames.footer])[0]
    const children = filterChildrenByDisplayNames(_children, [displayNames.header, displayNames.footer], true)

    return (
      <DropdownMenuPortal container={portalContainer}>
        <Primitive
          ref={ref}
          sideOffset={sideOffset}
          className={cn('cn-dropdown-menu', className)}
          onCloseAutoFocus={event => event.preventDefault()}
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
  title: ReactNode
  children?: ReactNode
  className?: string
  description?: ReactNode
  label?: string
  shortcut?: string
  checkmark?: boolean
  withSubIndicator?: ReactNode
}

const DropdownBaseItem = ({
  children,
  className,
  title,
  description,
  label,
  shortcut,
  checkmark,
  withSubIndicator
}: DropdownBaseItemProps) => (
  <div className={cn('cn-dropdown-menu-base-item', className)}>
    {children}
    <Layout.Grid gap="none" className="w-full">
      {typeof title === 'string' ? <Text color="foreground-1">{title}</Text> : title}
      {typeof description === 'string' ? <Text>{description}</Text> : description}
    </Layout.Grid>
    {label && <Text variant="caption-soft">{label}</Text>}
    {shortcut && <Text variant="caption-soft">{shortcut}</Text>}
    {checkmark && <IconV2 name="check" />}
    {withSubIndicator && <IconV2 name="nav-arrow-right" size="xs" />}
  </div>
)

interface DropdownMenuItemProps
  extends Omit<DropdownBaseItemProps, 'withSubIndicator'>,
    Omit<ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>, 'title' | 'prefix'> {
  prefix?: ReactNode
}

const DropdownMenuItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuItemProps>(
  ({ className, children, title, description, label, shortcut, checkmark, prefix, ...props }, ref) => {
    const filteredChildren = filterChildrenByDisplayNames(children, innerComponentsDisplayNames)
    const withChildren = filteredChildren.length > 0

    const ItemContent = () => (
      <DropdownBaseItem {...{ title, description, label, shortcut, checkmark, withSubIndicator: withChildren }}>
        {prefix}
      </DropdownBaseItem>
    )

    if (withChildren) {
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            ref={ref}
            className={cn('cn-dropdown-menu-item cn-dropdown-menu-item-subtrigger', className)}
            {...omit(props, ['onSelect'])}
          >
            <ItemContent />
          </DropdownMenuSubTrigger>
          <DropdownMenuContent isSubContent>{filteredChildren}</DropdownMenuContent>
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
    Omit<ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>, 'title' | 'onSelect'> {}

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
      onCheckedChange,
      onClick,
      ...props
    },
    ref
  ) => {
    const filteredChildren = filterChildrenByDisplayNames(children, innerComponentsDisplayNames)
    const withChildren = filteredChildren.length > 0
    const checkedDataState = checked === true ? 'checked' : checked

    const ItemContent = () => (
      <DropdownBaseItem {...{ title, description, label, shortcut, checkmark, withSubIndicator: withChildren }}>
        <div className="cn-checkbox-root" {...{ 'data-state': checkedDataState }}>
          {checked && (
            <div className="cn-checkbox-indicator" {...{ 'data-state': checkedDataState }}>
              {checked === 'indeterminate' ? (
                <IconV2 name="minus" className="cn-checkbox-icon" skipSize />
              ) : (
                <IconV2 name="check" className="cn-checkbox-icon" skipSize />
              )}
            </div>
          )}
        </div>
      </DropdownBaseItem>
    )

    if (withChildren) {
      return (
        <DropdownMenuSub>
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
          <DropdownMenuContent isSubContent>{filteredChildren}</DropdownMenuContent>
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
>(({ className, title, description, label, shortcut, checkmark, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn('cn-dropdown-menu-item', className)}
    onSelect={e => {
      e.stopPropagation()
      e.preventDefault()
    }}
    {...props}
  >
    <DropdownBaseItem {...{ title, description, label, shortcut, checkmark }}>
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
      prefix={<Avatar size={props.description ? 'lg' : 'md'} src={src} rounded={rounded} name={name} />}
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
    <DropdownMenuItem ref={ref} {...props} prefix={<IconV2 size="2xs" name={icon} className={iconClassName} />} />
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

const DropdownMenuHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('cn-dropdown-menu-header', className)} {...props} />
)
DropdownMenuHeader.displayName = displayNames.header

const DropdownMenuFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('cn-dropdown-menu-footer', className)} {...props} />
)
DropdownMenuFooter.displayName = displayNames.footer

const DropdownMenuSpinner = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('cn-dropdown-menu-spinner', className)} {...props}>
    <IconV2 className="animate-spin" name="loader" />
  </div>
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

const DropdownMenuSlot = (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />
DropdownMenuSlot.displayName = displayNames.slot

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

export { DropdownMenu, DropdownMenuItemProps }
