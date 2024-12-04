import { RepoLayout as RepoLayoutView } from '@harnessio/ui/views'

import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return <RepoLayoutView useTranslationStore={useTranslationStore} />
}

export default RepoLayout
