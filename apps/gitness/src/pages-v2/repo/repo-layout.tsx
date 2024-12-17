import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return (
    <>
      <div className="bg-background-1 sticky top-0 z-40">
        <Breadcrumbs />
        <RepoSubheader useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}

export default RepoLayout
