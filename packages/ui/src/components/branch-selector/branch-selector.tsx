import { Button, DropdownMenu, DropdownMenuTrigger, Icon, Text } from '@/components'
import { cn } from '@utils/cn'

import { BranchSelectorDropdown, type BranchSelectorDropdownProps } from './branch-selector-dropdown'

interface BranchSelectorProps extends BranchSelectorDropdownProps {
  size?: 'default' | 'sm'
  prefix?: string
  className?: string
}

export const BranchSelector = ({
  name,
  branchList,
  tagList = [],
  size = 'default',
  selectBranch,
  prefix,
  className
}: BranchSelectorProps) => {
  const isTag = tagList.some(tag => tag.name === name) ?? false

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'data-[state=open]:border-borders-8 [&_svg]:data-[state=open]:text-foreground-1 flex items-center gap-1.5 overflow-hidden px-3',
            className
          )}
          variant="outline"
          size={size}
        >
          {!prefix && (
            <Icon className="min-w-[12px] fill-transparent text-icons-9" name={isTag ? 'tag' : 'branch'} size={12} />
          )}
          <Text className="w-full text-foreground-8" truncate align="left">
            {prefix ? `${prefix}: ${name}` : name}
          </Text>
          <Icon className="chevron-down text-icons-2" name="chevron-down" size={10} />
        </Button>
      </DropdownMenuTrigger>
      <BranchSelectorDropdown branchList={branchList} tagList={tagList} name={name} selectBranch={selectBranch} />
    </DropdownMenu>
  )
}
