import { Button, cn, DropdownMenu, DropdownMenuTrigger, Icon, Text } from '@harnessio/canary'

import { BranchSelectorDropdown, type BranchSelectorDropdownProps } from './branch-selector-dropdown'

interface BranchSelectorProps extends BranchSelectorDropdownProps {
  size?: 'default' | 'sm'
  width?: 'auto' | 'sm' | 'md' | 'lg' | 'full'
  prefix?: string
  className?: string
}

export const BranchSelector = ({
  name,
  branchList,
  tagList,
  size = 'default',
  selectBranch,
  width = 'auto',
  prefix = undefined,
  className
}: BranchSelectorProps) => {
  const widthClasses: { [key in NonNullable<BranchSelectorProps['width']>]: string } = {
    auto: 'w-auto',
    sm: 'w-16',
    md: 'w-32',
    lg: 'w-48',
    full: 'w-full'
  }

  const isTag = tagList.items?.some(tag => tag.name === name) ?? false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            widthClasses[width],
            'data-[state=open]:border-borders-8 [&_svg]:data-[state=open]:text-foreground-1 flex items-center gap-1.5 overflow-hidden px-3',
            className
          )}
          variant="outline"
          size={size}
        >
          {prefix ? null : (
            <Icon className="min-w-[12px] fill-transparent text-icons-9" name={isTag ? 'tag' : 'branch'} size={12} />
          )}
          <Text className="w-full text-primary/90" truncate align="left">
            {prefix ? `${prefix}: ${name}` : name}
          </Text>
          <Icon className="chevron-down ml-0 min-w-[10px] text-tertiary-background" name="chevron-down" size={10} />
        </Button>
      </DropdownMenuTrigger>
      <BranchSelectorDropdown branchList={branchList} tagList={tagList} name={name} selectBranch={selectBranch} />
    </DropdownMenu>
  )
}
