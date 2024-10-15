import { RootLayout } from '@harnessio/playground'
import { useAppContext } from '../framework/context/AppContext'

const RootLayoutWrapper = () => {
  const { currentUser } = useAppContext()

  return (
    <>
      <RootLayout currentUser={currentUser} />
    </>
  )
}

export default RootLayoutWrapper
