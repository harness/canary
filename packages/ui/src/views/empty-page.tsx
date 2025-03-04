import { NoData } from '@/components'
import { useRouterContext } from '@/context'

export const EmptyPage = ({ pathName }: { pathName: string }) => {
  const { navigate } = useRouterContext()
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
