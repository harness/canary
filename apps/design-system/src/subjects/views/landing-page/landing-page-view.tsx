import { noop, useTranslationStore } from '@utils/viewUtils'

import { LandingPageView } from '@harnessio/ui/views'

export const LandingPagePreview = () => {
  return (
    <LandingPageView
      spaces={[]}
      useTranslationStore={useTranslationStore}
      onProjectSelect={noop}
      onProjectCreate={noop}
    />
  )
}
