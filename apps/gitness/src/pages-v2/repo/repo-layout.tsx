import { RepoLayout as RepoLayoutView } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return (
    <>
      <div className="fixed top-0 breadcrumbs w-full">
        <Breadcrumbs />
      </div>
      <RepoLayoutView useTranslationStore={useTranslationStore} />
    </>
  )
}

export default RepoLayout
