import { Dispatch, FC, Fragment, ReactNode, SetStateAction } from 'react'

import { Button, ButtonProps, Illustration, IllustrationsNameType, Layout, SplitButton, Text } from '@/components'
import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

export interface NoDataProps {
  title: string
  imageName?: IllustrationsNameType
  imageSize?: number
  description: string[] | ReactNode
  primaryButton?: {
    label: ReactNode | string
    onClick?: () => void
    to?: string
    props?: ButtonProps
  }
  secondaryButton?: {
    label: ReactNode | string
    to?: string
    onClick?: () => void
    props?: ButtonProps
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
            (Array.isArray(description)
              ? description.map((line, index) => (
                  <Text key={index} align="center">
                    {line}
                  </Text>
                ))
              : description)}
        </Layout.Vertical>
        {(primaryButton || secondaryButton || splitButton) && (
          <Layout.Horizontal gap="sm">
            {primaryButton &&
              (primaryButton.to ? (
                <Button asChild onClick={() => primaryButton?.onClick?.()} {...primaryButton.props}>
                  <NavLink to={primaryButton.to}>{primaryButton.label}</NavLink>
                </Button>
              ) : (
                <Button onClick={() => primaryButton?.onClick?.()} {...primaryButton.props}>
                  {primaryButton.label}
                </Button>
              ))}
            {secondaryButton &&
              (secondaryButton.to ? (
                <Button
                  variant="outline"
                  asChild
                  onClick={() => secondaryButton?.onClick?.()}
                  {...secondaryButton.props}
                >
                  <NavLink to={secondaryButton.to}>{secondaryButton.label}</NavLink>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => secondaryButton?.onClick?.()} {...secondaryButton.props}>
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
