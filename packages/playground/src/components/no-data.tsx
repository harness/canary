import React from 'react'
import { Icon, Text, Button, cn, IconProps } from '@harnessio/canary'
import { NavLink } from 'react-router-dom'

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
  insideTabView?: boolean
  loadState?: string
  setLoadState?: React.Dispatch<React.SetStateAction<string>>
}

export const NoData: React.FC<NoDataProps> = ({
  iconName,
  iconSize = 112,
  title,
  description,
  primaryButton,
  secondaryButton,
  insideTabView = false
}) => {
  return (
    <div
      className={cn('w-full h-full flex flex-col place-content-center place-items-center', {
        'py-20 pb-24': insideTabView
      })}>
      {iconName && <Icon name={iconName as IconProps['name']} size={iconSize} />}
      <div className="flex flex-col gap-4 place-content-center place-items-center ">
        <Text size={5} weight="medium">
          {title}
        </Text>
        {description && (
          <div className="flex flex-col">
            {description.map((line, index) => (
              <Text key={index} size={2} weight="normal" align="center" className="text-tertiary-background">
                {line}
              </Text>
            ))}
          </div>
        )}
        {(primaryButton || secondaryButton) && (
          <div className="mt-3.5 flex gap-4">
            {primaryButton && (
              <Button size="lg" asChild onClick={primaryButton.onClick}>
                <NavLink to={primaryButton.to || '/</Button>'}>{primaryButton.label}</NavLink>
              </Button>
            )}
            {secondaryButton && (
              <Button variant="outline" size="lg" asChild onClick={secondaryButton.onClick}>
                <NavLink to={secondaryButton.to || '/</Button>'}>{secondaryButton.label}</NavLink>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
