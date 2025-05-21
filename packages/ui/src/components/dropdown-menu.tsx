import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes, ReactNode } from 'react'

import { usePortal } from '@/context'
import { Avatar, AvatarProps } from '@components/avatar'
import { Icon } from '@components/icon'
import { Logo, LogoProps } from '@components/logo'
import { Text } from '@components/text'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@utils/cn'
import { filterChildrenByDisplayNames } from '@utils/index'
import { omit } from 'lodash-es'

import { IconPropsV2, IconV2 } from './icon-v2'

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
  footer: 'DropdownMenuFooter'
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
}

const DropdownMenuContent = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Content>, DropdownMenuContentProps>(
  ({ className, children, sideOffset = 4, isSubContent, ...props }, ref) => {
    const { portalContainer } = usePortal()
    const Primitive = isSubContent ? DropdownMenuPrimitive.SubContent : DropdownMenuPrimitive.Content

    return (
      <DropdownMenuPortal container={portalContainer}>
        <Primitive
          ref={ref}
          sideOffset={sideOffset}
          className={cn('cn-dropdown-menu-content', className)}
          onCloseAutoFocus={event => event.preventDefault()}
          {...props}
        >
          {children}
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
  description?: string
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
    <div className="grid w-full">
      <Text className="text-cn-foreground-1 font-body-normal">{title}</Text>
      {description && <Text className="text-cn-foreground-2 font-body-normal">{description}</Text>}
    </div>
    {label && <Text className="text-cn-foreground-2 font-caption-soft">{label}</Text>}
    {shortcut && <Text className="text-cn-foreground-2 font-caption-soft">{shortcut}</Text>}
    {checkmark && <Icon name="check" size={16} />}
    {withSubIndicator && <Icon name="chevron-right" size={14} />}
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
    Omit<ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>, 'title'> {}

const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, title, description, label, shortcut, checkmark, ...props }, ref) => {
  const filteredChildren = filterChildrenByDisplayNames(children, innerComponentsDisplayNames)
  const withChildren = filteredChildren.length > 0
  const checkedState = checked === true ? 'checked' : checked

  const ItemContent = () => (
    <DropdownBaseItem {...{ title, description, label, shortcut, checkmark, withSubIndicator: withChildren }}>
      <div className="cn-checkbox-root" {...{ 'data-state': checkedState }}>
        {checked && (
          <div className="cn-checkbox-indicator" {...{ 'data-state': checkedState }}>
            {checked === 'indeterminate' ? (
              <Icon name="minus" className="cn-checkbox-icon" skipSize />
            ) : (
              <Icon name="check" className="cn-checkbox-icon" skipSize />
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
          {...omit(props, ['onSelect'])}
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
      {...props}
    >
      <ItemContent />
    </DropdownMenuPrimitive.CheckboxItem>
  )
})
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
  Omit<DropdownMenuRadioItemProps, 'children'>
>(({ className, title, description, label, shortcut, checkmark, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem ref={ref} className={cn('cn-dropdown-menu-item', className)} {...props}>
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
  rounded?: AvatarProps['rounded']
}

const DropdownMenuAvatarItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuAvatarItemProps>(
  ({ src, rounded = true, ...props }, ref) => (
    <DropdownMenuItem
      ref={ref}
      {...props}
      prefix={<Avatar size={props.description ? 'lg' : 'default'} src={src} rounded={rounded} />}
    />
  )
)
DropdownMenuAvatarItem.displayName = displayNames.avatarItem

interface DropdownMenuLogoItemProps extends Omit<DropdownMenuItemProps, 'prefix'> {
  logo: LogoProps['name']
  original?: LogoProps['original']
}

const DropdownMenuLogoItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuLogoItemProps>(
  ({ logo, original, ...props }, ref) => (
    <DropdownMenuItem ref={ref} {...props} prefix={<Logo size={20} name={logo} original={original} />} />
  )
)
DropdownMenuLogoItem.displayName = displayNames.logoItem

interface DropdownMenuIconItemProps extends Omit<DropdownMenuItemProps, 'prefix'> {
  icon: IconPropsV2['name']
}

const DropdownMenuIconItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, DropdownMenuIconItemProps>(
  ({ icon, ...props }, ref) => <DropdownMenuItem ref={ref} {...props} prefix={<IconV2 size={12} name={icon} />} />
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
  <>
    <div className={cn('cn-dropdown-menu-header', className)} {...props} />
    <DropdownMenuSeparator />
  </>
)
DropdownMenuHeader.displayName = displayNames.header

const DropdownMenuFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <>
    <DropdownMenuSeparator />
    <div className={cn('cn-dropdown-menu-footer', className)} {...props} />
  </>
)
DropdownMenuFooter.displayName = displayNames.footer

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
  Footer: DropdownMenuFooter
}

export { DropdownMenu }
