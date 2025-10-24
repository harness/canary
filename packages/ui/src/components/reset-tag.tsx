import { Tag, TagProps } from './tag'

interface ResetTagProps extends TagProps {
  onReset: () => void
  actionIcon?: never
  onActionClick?: never
}

export function ResetTag({ onReset, ...props }: ResetTagProps) {
  return <Tag {...props} actionIcon="xmark" onActionClick={onReset} />
}
