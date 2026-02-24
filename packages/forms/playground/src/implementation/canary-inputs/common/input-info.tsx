import { Alert } from '@harnessio/ui/components'

export interface InputCaptionProps {
  toLearnMore?: string
  info?: string
}

const InputInfo = ({ toLearnMore, info }: InputCaptionProps) => {
  if (!info) {
    return null
  }

  return (
    <Alert.Root theme="info" className="mt-cn-3xs">
      <Alert.Description>{info}</Alert.Description>
      {toLearnMore && <Alert.Link to={toLearnMore}>Learn more</Alert.Link>}
    </Alert.Root>
  )
}
InputInfo.displayName = 'InputInfo'

export { InputInfo }
