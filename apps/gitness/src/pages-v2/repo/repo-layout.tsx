import { RepoLayout as RepoLayoutView } from '@harnessio/ui/views'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return (
    <>
      <div className="fixed top-0 z-30 margin-breadcrumbs w-full bg-background-1">
        <Breadcrumbs />
      </div>
      <RepoLayoutView useTranslationStore={useTranslationStore} />
    </>
  )
}

export default RepoLayout
