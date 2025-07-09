import { IconV2 } from '@components/icon-v2'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <span className="text-cn-foreground-alert flex items-center gap-x-1.5 text-1 leading-tight">
      <IconV2 name="warning-triangle" size="2xs" />
      {children}
    </span>
  )
}
