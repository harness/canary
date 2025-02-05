import { Icon, Text } from '@harnessio/ui/components'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <Text className="text-tag-foreground-amber-1 m-2 flex items-center" size={1}>
      <Icon name="triangle-warning" size={12} className="mr-1" />
      {children}
    </Text>
  )
}
