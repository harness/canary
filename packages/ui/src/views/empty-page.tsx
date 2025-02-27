import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { NoData } from '@/components'

export interface EmptyPageProps {
  pathName: string
}

export const EmptyPage: FC<EmptyPageProps> = ({ pathName }) => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center">
      <NoData
        iconName="no-search-magnifying-glass"
        title={`Upgrade to Harness Enterprise to access ${pathName}`}
        description={[]}
        primaryButton={{
          label: 'Take me back',
          onClick: () => navigate(-1)
        }}
      />
    </div>
  )
}
