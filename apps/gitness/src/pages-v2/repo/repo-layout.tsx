import { RepoLayout as RepoLayoutView } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return (
    <>
      <div className="breadcrumbs">
        <Breadcrumbs />
      </div>
      <RepoLayoutView useTranslationStore={useTranslationStore} />
    </>
  )
}

export default RepoLayout
