import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return (
    <>
      <div className="sticky top-0 z-40 bg-background-1">
        <Breadcrumbs />
        <RepoSubheader useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}

export default RepoLayout
