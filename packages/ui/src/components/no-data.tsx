import { Dispatch, FC, SetStateAction } from 'react'
import { NavLink } from 'react-router-dom'

import { cn } from '@utils/cn'

import { Button } from './button'
import { Icon, IconProps } from './icon'
import { Text } from './text'

export interface NoDataProps {
  title: string
  iconName?:
    | Pick<IconProps, 'name'>
    | 'no-data-folder'
    | 'no-search-magnifying-glass'
    | 'no-data-merge'
    | 'no-data-cog'
    | 'no-data-webhooks'
    | 'no-data-branches'
    | 'no-data-members'
    | 'no-repository'
    | 'no-data-error'
    | 'no-data-commits'
    | 'no-data-pr'
    | 'no-data-tags'
  iconSize?: number
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
  iconName,
  iconSize = 112,
  title,
  description,
  primaryButton,
  secondaryButton,
  withBorder = false,
  textWrapperClassName,
  className
}) => {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col place-content-center place-items-center gap-4',
        { 'py-20 pb-24 h-auto min-h-[75vh] border border-borders-4 rounded-md': withBorder },
        className
      )}
    >
      {iconName && <Icon name={iconName as IconProps['name']} size={iconSize} />}
      <div className={cn('flex flex-col place-content-center place-items-center gap-2.5', textWrapperClassName)}>
        <Text size={5} weight="medium">
          {title}
        </Text>
        {description && (
          <div className="flex flex-col">
            {description.map((line, index) => (
              <Text key={index} size={2} weight="normal" align="center" color="tertiaryBackground">
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
