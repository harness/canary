import { Text } from '@components/index'

interface LineTitleProps {
  text?: string
  icon?: React.ReactElement
}

interface LineDescriptionProps {
  text?: string
}

export const LineTitle = ({ ...props }: LineTitleProps) => {
  return (
    <div className="inline-flex items-center gap-2">
      {props.icon}
      <Text weight="medium">{props.text}</Text>
    </div>
  )
}

export const LineDescription = ({ ...props }: LineDescriptionProps) => {
  return (
    <div className="ml-6 inline-flex items-center gap-2">
      <Text size={1} weight="normal" color={'tertiaryBackground'}>
        {props.text}
      </Text>
    </div>
  )
}
