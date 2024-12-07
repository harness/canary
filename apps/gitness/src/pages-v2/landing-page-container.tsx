import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'

export const LandingPage = () => {
  const { spaces } = useAppContext()

  return <LandingPageView spaces={spaces} />
}
