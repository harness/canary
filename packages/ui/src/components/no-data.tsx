import { Dispatch, FC, SetStateAction } from 'react'

import { useRouterContext } from '@/context'
import { cn } from '@utils/cn'

import { Button } from './button'
import { Illustration, IllustrationsNameType } from './illustration'
import { Text } from './text'

export interface NoDataProps {
  title: string
  imageName?: IllustrationsNameType
  imageSize?: number
  description: string[]
  primaryButton?: {
    label: string
    onClick?: () => void
    to?: string
  }
  secondaryButton?: {
    label: string
    to?: string
    onClick?: () => void
  }
  withBorder?: boolean
  loadState?: string
  setLoadState?: Dispatch<SetStateAction<string>>
  textWrapperClassName?: string
  className?: string
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
  className
}) => {
  const { NavLink } = useRouterContext()
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col place-content-center place-items-center gap-4 my-auto',
        { 'h-auto min-h-[75vh] border border-cn-borders-4 rounded-md': withBorder },
        className
      )}
    >
      {imageName && <Illustration name={imageName} size={imageSize} themeDependent />}
      <div className={cn('flex flex-col place-content-center place-items-center gap-2.5 pb-4', textWrapperClassName)}>
        <Text variant="heading-section">{title}</Text>
        {description && (
          <div className="flex flex-col">
            {description.map((line, index) => (
              <Text key={index} align="center" color="foreground-3">
                {line}
              </Text>
            ))}
          </div>
        )}
        {(primaryButton || secondaryButton) && (
          <div className="mt-4 flex gap-[1.125rem]">
            {primaryButton &&
              (primaryButton.to ? (
                <Button asChild onClick={() => primaryButton?.onClick?.()}>
                  <NavLink to={primaryButton.to}>{primaryButton.label}</NavLink>
                </Button>
              ) : (
                <Button onClick={() => primaryButton?.onClick?.()}>{primaryButton.label}</Button>
              ))}
            {secondaryButton &&
              (secondaryButton.to ? (
                <Button variant="outline" asChild onClick={() => secondaryButton?.onClick?.()}>
                  <NavLink to={secondaryButton.to}>{secondaryButton.label}</NavLink>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => secondaryButton?.onClick?.()}>
                  {secondaryButton.label}
                </Button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
