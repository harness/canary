import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { IThemeStore, NoData } from '@/components'
import { ThemeProvider } from '@/providers/theme'

export interface EmptyPageProps {
  pathName: string
  useThemeStore: () => IThemeStore
}

export const EmptyPage: FC<EmptyPageProps> = ({ pathName, useThemeStore }) => {
  const navigate = useNavigate()
  const storeTheme = useThemeStore()

  return (
    <ThemeProvider {...storeTheme}>
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
    </ThemeProvider>
  )
}
