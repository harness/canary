import { Outlet } from 'react-router-dom'

import { RepoSubheader } from '@harnessio/ui/components'

import BreadcrumbsMFE from '../../components/breadcrumbs/breadcrumbs-mfe'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useTranslationStore } from '../../i18n/stores/i18n-store'

const RepoLayout = () => {
  const { scope } = useMFEContext()
  const isMFE = useIsMFE()

  return (
    <>
      <div className="top-breadcrumbs bg-background-1 sticky z-40">
        {!isMFE ? null : <BreadcrumbsMFE selectedProject={scope.projectIdentifier || '...'} />}
        <RepoSubheader useTranslationStore={useTranslationStore} />
      </div>
      <Outlet />
    </>
  )
}

export default RepoLayout
