import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { RepoLinkFormFields, RepoLinkView } from '@harnessio/views'

import { LinkRepoConnectorDrawer, type ConnectorSelection } from '../../components-v2/link-repo-connector-drawer'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useAPIPath } from '../../hooks/useAPIPath'
import { PathParams } from '../../RouteDefinitions'

export const LinkRepo = () => {
  const routes = useRoutes()
  const navigate = useNavigate()
  const { spaceId } = useParams<PathParams>()
  const spaceURL = useGetSpaceURLParam()
  const apiPath = useAPIPath()
  const { scope } = useMFEContext()

  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string>('')
  const [selectedLabel, setSelectedLabel] = useState<string>('')

  const buildConnectorPath = useCallback(
    (connector: ConnectorSelection): string => {
      const parts = [scope.accountId]
      if (connector.orgIdentifier) parts.push(connector.orgIdentifier)
      if (connector.projectIdentifier) parts.push(connector.projectIdentifier)
      return parts.filter(Boolean).join('/')
    },
    [scope.accountId]
  )

  const onSubmit = async (data: RepoLinkFormFields) => {
    const linkRepoPath = apiPath(`/api/v1/repos/link?space_path=${spaceURL}`)

    try {
      setIsLoading(true)
      setApiError('')

      const response = await fetch(linkRepoPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_ref: spaceURL,
          identifier: data.identifier,
          description: data.description || '',
          is_public: data.isPublic,
          connector: {
            path: data.connectorPath,
            identifier: data.connectorIdentifier
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 401) {
          navigate('/login')
          return
        }
        setApiError(errorData.message || 'Failed to link repository')
        return
      }

      navigate(routes.toRepositories({ spaceId }))
    } catch (error) {
      setApiError((error as Error).message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const onCancel = () => {
    navigate(routes.toRepositories({ spaceId }))
  }

  return (
    <RepoLinkView
      onFormSubmit={onSubmit}
      onFormCancel={onCancel}
      isLoading={isLoading}
      connectorSelectorRenderer={onSelect => (
        <LinkRepoConnectorDrawer
          selectedLabel={selectedLabel}
          onConnectorSelect={connector => {
            const connectorPath = buildConnectorPath(connector)
            onSelect({ path: connectorPath, identifier: connector.identifier })
            setSelectedLabel(connector.name)
          }}
        />
      )}
      apiError={apiError}
    />
  )
}
