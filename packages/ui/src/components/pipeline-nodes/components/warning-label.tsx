import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'

export function WarningLabel({ children }: { children: JSX.Element | string }) {
  return (
    <Text as="span" color="warning" variant="caption-normal" className="flex items-center gap-x-cn-2xs">
      <IconV2 name="warning-triangle" size="2xs" color="warning" />
      {children}
    </Text>
  )
}
