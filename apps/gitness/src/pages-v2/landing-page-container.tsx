import { LandingPageView } from '@harnessio/ui/views'

import { useAppContext } from '../framework/context/AppContext'
import { useTranslationStore } from '../i18n/stores/i18n-store'

export const LandingPage = () => {
  const { spaces } = useAppContext()

  return <LandingPageView spaces={spaces} useTranslationStore={useTranslationStore} />
}
