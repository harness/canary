import React from 'react'

import { NoData, type NoDataProps } from './no-data'

interface NoSearchResultsProps extends Omit<NoDataProps, 'iconSize'> {
  iconSize?: number
}

export const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  iconName,
  iconSize = 112,
  title,
  description,
  primaryButton,
  secondaryButton
}: NoSearchResultsProps) => {
  return (
    <div className="flex size-full flex-col items-center justify-center rounded-md border pb-[9.75rem] pt-[6.25rem]">
      <NoData
        iconName={iconName}
        iconSize={iconSize}
        title={title}
        description={description}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
      />
    </div>
  )
}
