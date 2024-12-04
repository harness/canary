import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@harnessio/canary'

export interface BranchListProps {
  name?: string
}

interface PageProps {
  name: string
  branchList?: BranchListProps[]
  size?: 'default' | 'sm'
  width?: 'auto' | 'sm' | 'md' | 'lg' | 'full'
  selectBranch: (branch: string) => void
  prefix?: string
}

export const BranchSelector = ({ ...props }: PageProps) => {
  const { name, branchList, size = 'default', selectBranch, width = 'auto', prefix = undefined } = props

  const widthClasses: { [key in NonNullable<PageProps['width']>]: string } = {
    auto: 'w-auto',
    sm: 'w-16',
    md: 'w-32',
    lg: 'w-48',
    full: 'w-full'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size={size}
          className={cn(widthClasses[width], 'flex items-center gap-1.5 overflow-hidden px-3', {
            'bg-muted': !prefix,
            'bg-background': prefix,
            'border-border': prefix,
            'border-2': prefix
          })}
        >
          {prefix ? null : <Icon name="branch" size={12} className="text-tertiary-background min-w-[12px]" />}
          <Text as="p" align="left" className="text-primary/90 w-full truncate">
            {prefix ? `${prefix}: ${name}` : name}
          </Text>
          <Icon name="chevron-down" size={10} className="chevron-down text-tertiary-background ml-0 min-w-[10px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {branchList &&
          branchList.map(branch => {
            return (
              <DropdownMenuItem key={branch.name} onClick={() => selectBranch(branch.name ?? '')}>
                {branch.name}
              </DropdownMenuItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
