import { JSX } from 'react'

import { Button, ButtonProps, DropdownMenu, IconPropsV2, IconV2 } from '@harnessio/ui/components'

import { InputValueType } from '../../types/types'

interface MultiTypeSelectProps {
  inputValueType: InputValueType
  setInputValueType: (inputValueType: InputValueType) => void
  allowedValueTypes?: InputValueType[]
}

export interface StyledMultiTypeSelectProps extends MultiTypeSelectProps {
  className?: string
  buttonClassName?: string
  variant?: ButtonProps['variant']
  style?: React.CSSProperties
  allowedValueTypes?: InputValueType[]
}

const getButtonIcon = (inputValueType: InputValueType) => {
  switch (inputValueType) {
    case 'fixed':
      return <IconV2 name="code-brackets" size="xs" className="text-cn-blue-surface" />
    case 'runtime':
      return <IconV2 name="code" size="xs" className="text-cn-purple-surface" />
    case 'expression':
      return <IconV2 name="variables" size="xs" className="text-cn-orange-surface" />
  }
}

function MultiTypeSelectForPrefix(props: MultiTypeSelectProps): JSX.Element {
  return (
    <MultiTypeSelectBase
      {...props}
      className="cn-input-prefix"
      buttonClassName="rounded-l-cn rounded-r-cn-none"
      variant={'ghost'}
      style={{ height: 'calc(var(--cn-input-size-md) - var(--cn-input-border) * 2)' }}
    />
  )
}

function MultiTypeSelectForLabel(props: MultiTypeSelectProps): JSX.Element {
  return <MultiTypeSelectBase {...props} variant="outline" />
}

function MultiTypeSelectBase(props: StyledMultiTypeSelectProps): JSX.Element {
  const {
    inputValueType,
    setInputValueType,
    className,
    buttonClassName,
    variant = 'outline',
    style,
    allowedValueTypes
  } = props

  const options: { value: InputValueType; icon: IconPropsV2['name']; iconClassName: string; title: string }[] = [
    {
      value: 'fixed',
      icon: 'code-brackets',
      iconClassName: 'text-cn-blue-surface',
      title: 'Fixed'
    },
    {
      value: 'runtime',
      icon: 'code',
      iconClassName: 'text-cn-purple-surface',
      title: 'Runtime'
    },
    {
      value: 'expression',
      icon: 'variables',
      iconClassName: 'text-cn-orange-surface',
      title: 'Expression'
    }
  ]

  // filter based on allowedValueTypes, default to all if not provided or empty
  const filteredOptions =
    allowedValueTypes && allowedValueTypes.length > 0
      ? options.filter(option => allowedValueTypes.includes(option.value))
      : options

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={className}>
        <Button variant={variant} style={style} iconOnly className={buttonClassName}>
          {getButtonIcon(inputValueType)}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="start">
        {filteredOptions.map(({ value, icon, iconClassName, title }) => (
          <DropdownMenu.IconItem
            key={value}
            icon={icon}
            iconClassName={iconClassName}
            title={title}
            onSelect={() => setInputValueType(value)}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export const MultiTypeSelectButton = {
  Default: MultiTypeSelectBase,
  ForPrefix: MultiTypeSelectForPrefix,
  ForLabel: MultiTypeSelectForLabel
}
