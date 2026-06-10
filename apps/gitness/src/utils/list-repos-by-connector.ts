export interface GitRepositoryResponseDTO {
  name?: string
}

interface ListReposByConnectorResponse {
  status?: string
  data?: GitRepositoryResponseDTO[]
}

function getAuthToken(): string | undefined {
  const rawToken = localStorage.getItem('token')
  if (!rawToken) return undefined

  try {
    return JSON.parse(decodeURIComponent(atob(rawToken))) as string
  } catch {
    return undefined
  }
}

export interface ListReposByConnectorParams {
  accountIdentifier: string
  orgIdentifier?: string
  projectIdentifier?: string
  connectorRef: string
  page?: number
  size?: number
  repoNameSearchTerm?: string
}

export async function listReposByConnector(params: ListReposByConnectorParams): Promise<GitRepositoryResponseDTO[]> {
  const searchParams = new URLSearchParams({
    accountIdentifier: params.accountIdentifier,
    connectorRef: params.connectorRef,
    page: String(params.page ?? 0),
    size: String(params.size ?? 50)
  })

  if (params.orgIdentifier) {
    searchParams.set('orgIdentifier', params.orgIdentifier)
  }
  if (params.projectIdentifier) {
    searchParams.set('projectIdentifier', params.projectIdentifier)
  }
  if (params.repoNameSearchTerm) {
    searchParams.set('repoNameSearchTerm', params.repoNameSearchTerm)
  }

  const routingId = params.accountIdentifier
  const url = `${window.apiUrl || ''}/ng/api/scm/list-repos-by-connector?${searchParams.toString()}&routingId=${routingId}`

  const token = getAuthToken()
  const headers: HeadersInit = { Accept: 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, { headers, credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Failed to list repositories (${response.status})`)
  }

  const body = (await response.json()) as ListReposByConnectorResponse
  if (body.status && body.status !== 'SUCCESS') {
    throw new Error('Failed to list repositories')
  }

  return body.data ?? []
}
