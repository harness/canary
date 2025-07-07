import { noop } from '@utils/viewUtils'

import { CreateProjectPage } from '@harnessio/ui/views'

export const CreateProjectView = ({ isAdditional = false }: { isAdditional?: boolean }) => {
  const commonProps = {
    isLoading: false,
    error: '',
    onFormSubmit: noop
  }

  if (isAdditional) {
    return (
      <CreateProjectPage
        {...commonProps}
        isAdditional={isAdditional}
        backLinkProps={{ to: '/' }}
        importProjectLinkProps={{ to: '/' }}
      />
    )
  }

  return <CreateProjectPage {...commonProps} logoutLinkProps={{ to: '/' }} importProjectLinkProps={{ to: '/' }} />
}
