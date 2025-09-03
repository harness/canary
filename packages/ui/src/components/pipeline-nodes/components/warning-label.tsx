import { IconV2 } from '@components/icon-v2'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <span className="text-cn-warning text-1 flex items-center gap-x-1.5 leading-tight">
      <IconV2 name="warning-triangle" size="2xs" />
      {children}
    </span>
  )
}
