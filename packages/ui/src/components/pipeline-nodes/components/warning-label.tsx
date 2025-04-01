import { Icon } from '@components/icon'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <span className="flex items-center gap-x-1.5 text-12 leading-tight text-cn-foreground-alert">
      <Icon name="triangle-warning" size={12} />
      {children}
    </span>
  )
}
