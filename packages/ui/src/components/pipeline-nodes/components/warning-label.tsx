import { Icon } from '@components/icon'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <span className="text-cn-foreground-alert flex items-center gap-x-1.5 text-1 leading-tight">
      <Icon name="triangle-warning" size={12} />
      {children}
    </span>
  )
}
