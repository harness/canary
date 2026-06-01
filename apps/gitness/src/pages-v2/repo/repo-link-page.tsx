import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { LinkedCreateRepositoryRequestBody, useLinkedCreateRepositoryMutation } from '@harnessio/code-service-client'
import { ACCOUNT_CONNECTOR_SPEC_TYPE, RepoLinkFormFields, RepoLinkView } from '@harnessio/views'

import { LinkRepoConnectorDrawer, type ConnectorSelection } from '../../components-v2/link-repo-connector-drawer'
import { LinkRepoProviderRepoSelect } from '../../components-v2/link-repo-provider-repo-select'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { PathParams } from '../../RouteDefinitions'

function ProviderRepoRendererBridge({ onSelect }: { onSelect: (repoIdentifier: string) => void }) {
  const { watch } = useFormContext<RepoLinkFormFields>()
  const connectorRef = watch('connectorRef')

  return <LinkRepoProviderRepoSelect connectorRef={connectorRef} onSelect={onSelect} />
}

export const LinkRepo = () => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam() ?? ''

  const {
    mutate: linkRepoMutation,
    isLoading,
    error
  } = useLinkedCreateRepositoryMutation(
    {},
    {
      onSuccess: () => {
        navigate(routes.toRepositories({ spaceId }))
      }
    }
  )

  /**
   * Builds a scoped connector_ref string from the selected connector.
   * Format: `identifier` (project), `org.identifier` (org), `account.identifier` (account)
   */
  const buildConnectorRef = useCallback((connector: ConnectorSelection): string => {
    if (connector.projectIdentifier) return connector.identifier
    if (connector.orgIdentifier) return `org.${connector.identifier}`
    return `account.${connector.identifier}`
  }, [])

  const onSubmit = (data: RepoLinkFormFields) => {
    if (!spaceURL) return

    const body = {
      parent_ref: spaceURL,
      identifier: data.identifier,
      description: data.description || '',
      is_public: data.isPublic,
      connector_ref: data.connectorRef,
      ...(data.connectorSpecType === ACCOUNT_CONNECTOR_SPEC_TYPE && data.repoIdentifier
        ? { repo_identifier: data.repoIdentifier }
        : {})
    } as LinkedCreateRepositoryRequestBody

    linkRepoMutation({
      queryParams: { space_path: spaceURL },
      body
    })
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    <RepoLinkView
      onFormSubmit={onSubmit}
      onFormCancel={onCancel}
      isLoading={isLoading}
      isSubmitDisabled={!spaceURL}
      connectorSelectorRenderer={onSelect => (
        <LinkRepoConnectorDrawer
          onConnectorSelect={connector => {
            onSelect({ ref: buildConnectorRef(connector), specType: connector.specType })
          }}
        />
      )}
      providerRepoRenderer={onSelect => <ProviderRepoRendererBridge onSelect={onSelect} />}
      apiError={error?.message}
    />
  )
}

LinkRepo.displayName = 'LinkRepo'
