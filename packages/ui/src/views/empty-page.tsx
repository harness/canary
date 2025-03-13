import { NoData } from '@/components'
import { useRouterContext } from '@/context'

export const EmptyPage = ({ pathName, comingSoon }: { pathName: string; comingSoon?: boolean }) => {
  const { navigate } = useRouterContext()
  return (
    <div className="flex min-h-screen items-center">
      <NoData
        iconName={comingSoon ? 'no-data-cog' : 'no-search-magnifying-glass'}
        title={
          comingSoon
            ? `The ${pathName} page is under development. It will be available soon.`
            : `Upgrade to Harness Enterprise to access ${pathName}`
        }
        description={[]}
        primaryButton={{
          label: 'Take me back',
          onClick: () => navigate(-1)
        }}
      />
    </div>
  )
}
