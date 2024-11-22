import { SandboxRoot } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'

// import { useGetSpaceURLParam } from '../framework/hooks/useGetSpaceParam'

const RootWrapper = () => {
  const {
    currentUser
    // spaces
  } = useAppContext()
  // const spaceId = useGetSpaceURLParam()

  return (
    <>
      <SandboxRoot
        currentUser={currentUser}
        pinnedMenu={null}
        recentMenu={undefined}
        changePinnedMenu={(_data) => {}}
        changeRecentMenu={(_data) => {}}
      />
    </>
  )
}

export default RootWrapper
