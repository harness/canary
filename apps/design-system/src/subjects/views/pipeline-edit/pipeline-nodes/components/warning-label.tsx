import { Icon } from '@harnessio/ui/components'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <span className="text-foreground-alert text-12 flex items-center gap-x-1.5 leading-tight">
      <Icon name="triangle-warning" size={12} />
      {children}
    </span>
  )
}
