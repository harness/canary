import { NoData } from '@harnessio/playground'
import { SandboxLayout } from '@harnessio/playground'
import { useNavigate } from 'react-router-dom'

export const EmptyPage = ({ pathName }: { pathName: string }) => {
  const navigate = useNavigate()
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <NoData
          iconName="no-search-magnifying-glass"
          title={`${pathName} does not exist`}
          description={[`Upgrade to harness-enterprise to access ${pathName}`]}
          primaryButton={{
            label: 'Take me back',
            onClick: () => navigate(-1)
          }}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
