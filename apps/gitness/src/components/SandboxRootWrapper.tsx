import { SandboxRoot } from '@harnessio/playground'
import { useAppContext } from '../framework/context/AppContext'

const SandboxRootWrapper = () => {
  const { currentUser } = useAppContext()

  return (
    <>
      <SandboxRoot currentUser={currentUser} />
    </>
  )
}

export default SandboxRootWrapper
