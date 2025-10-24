import { Dispatch, FC, ReactNode, SetStateAction } from 'react'

import {
  Button,
  ButtonProps,
  IconPropsV2,
  IconV2,
  Illustration,
  IllustrationsNameType,
  Layout,
  SplitButton,
  Text
} from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'
import omit from 'lodash-es/omit'

export interface NoDataProps {
  title: string
  imageName?: IllustrationsNameType
  imageSize?: number
  description: string[]
  primaryButton?: ButtonProps & {
    icon?: IconPropsV2['name']
    label: ReactNode | string
    to?: string
  }
  secondaryButton?: ButtonProps & {
    icon?: IconPropsV2['name']
    label: ReactNode | string
    to?: string
  }
  withBorder?: boolean
  loadState?: string
  setLoadState?: Dispatch<SetStateAction<string>>
  textWrapperClassName?: string
  className?: string
  splitButton?: {
    label: ReactNode | string
    options: { value: string; label: string }[]
    handleOptionChange: (option: string) => void
    handleButtonClick: () => void
    props?: ButtonProps
  }
}

export const NoData: FC<NoDataProps> = ({
  imageName,
  imageSize = 112,
  title,
  description,
  primaryButton,
  secondaryButton,
  withBorder = false,
  textWrapperClassName,
  className,
  splitButton
}) => {
  const { NavLink } = useRouterContext()

  return (
    <Layout.Vertical
      gap="md"
      align="center"
      justify="center"
      className={cn(
        'h-full w-full my-auto py-cn-4xl',
        { 'h-auto grow border border-cn-borders-3 rounded-md': withBorder },
        className
      )}
    >
      {imageName && <Illustration name={imageName} size={imageSize} themeDependent />}
      <Layout.Vertical gap="xl" align="center" justify="center">
        <Layout.Vertical gap="xs" align="center" justify="center" className={textWrapperClassName}>
          <Text variant="heading-section">{title}</Text>
          {!!description &&
            description.map((line, index) => (
              <Text key={index} align="center">
                {line}
              </Text>
            ))}
        </Layout.Vertical>
        {(primaryButton || secondaryButton || splitButton) && (
          <Layout.Horizontal gap="sm">
            {primaryButton &&
              (primaryButton.to ? (
                <Button asChild {...omit(primaryButton, ['to', 'label', 'icon'])}>
                  <NavLink to={primaryButton.to}>
                    {primaryButton.icon && <IconV2 name={primaryButton.icon} size="sm" />}
                    {primaryButton.label}
                  </NavLink>
                </Button>
              ) : (
                <Button {...omit(primaryButton, ['label', 'icon'])}>
                  {primaryButton.icon && <IconV2 name={primaryButton.icon} size="sm" />}
                  {primaryButton.label}
                </Button>
              ))}
            {secondaryButton &&
              (secondaryButton.to ? (
                <Button variant="outline" asChild {...omit(secondaryButton, ['to', 'label', 'icon'])}>
                  <NavLink to={secondaryButton.to}>
                    {secondaryButton.icon && <IconV2 name={secondaryButton.icon} size="sm" />}
                    {secondaryButton.label}
                  </NavLink>
                </Button>
              ) : (
                <Button variant="outline" {...omit(secondaryButton, ['label', 'icon'])}>
                  {secondaryButton.icon && <IconV2 name={secondaryButton.icon} size="sm" />}
                  {secondaryButton.label}
                </Button>
              ))}
            {splitButton && (
              <SplitButton<string>
                dropdownContentClassName="mt-0 min-w-[170px]"
                handleButtonClick={() => splitButton.handleButtonClick()}
                handleOptionChange={option => {
                  if (option === 'tag-rule') {
                    splitButton.handleOptionChange(option)
                  }
                }}
                options={splitButton.options}
              >
                {splitButton.label}
              </SplitButton>
            )}
          </Layout.Horizontal>
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
