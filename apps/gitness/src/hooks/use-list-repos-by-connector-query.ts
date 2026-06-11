import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { fetcher } from '@harnessio/react-ng-manager-v2-client/dist/custom-fetcher/index.js'

export interface GitRepositoryResponseDTO {
  name?: string
}

export interface ListReposByConnectorQueryParams {
  accountIdentifier: string
  orgIdentifier?: string
  projectIdentifier?: string
  connectorRef: string
  page?: number
  size?: number
  repoNameSearchTerm?: string
}

interface ResponseListGitRepositoryResponseDTO {
  data?: GitRepositoryResponseDTO[]
  status?: string
}

export interface ListReposByConnectorResponseContainer {
  body: ResponseListGitRepositoryResponseDTO
}

export interface ListReposByConnectorProps {
  queryParams: ListReposByConnectorQueryParams
  signal?: AbortSignal
}

export function listReposByConnector(props: ListReposByConnectorProps): Promise<ListReposByConnectorResponseContainer> {
  return fetcher({
    url: '/scm/list-repos-by-connector',
    method: 'GET',
    queryParams: props.queryParams,
    signal: props.signal
  })
}

export function useListReposByConnectorQuery(
  props: { queryParams: ListReposByConnectorQueryParams },
  options?: Omit<UseQueryOptions<ListReposByConnectorResponseContainer, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery(
    ['listReposByConnector', props.queryParams],
    ({ signal }) => listReposByConnector({ ...props, signal }),
    options
  )
}
