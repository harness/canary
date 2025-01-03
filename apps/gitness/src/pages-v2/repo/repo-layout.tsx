import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs'
import BreadcrumbsNew from '../../components/breadcrumbs/breadcrumbs-new'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  const { scope } = useMFEContext()
  const isMFE = useIsMFE()

  return (
    <>
      <div className="bg-background-1 sticky top-0 z-40">
        {!isMFE ? <Breadcrumbs /> : <BreadcrumbsNew selectedProject={scope.projectIdentifier || '...'} />}
        <RepoSubheader useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}

export default RepoLayout
