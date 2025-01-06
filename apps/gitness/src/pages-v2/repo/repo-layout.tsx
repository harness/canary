import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  return (
    <>
      <div className="sticky top-breadcrumbs z-40 bg-background-1">
        <RepoSubheader useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}

export default RepoLayout
