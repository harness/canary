export interface ConnectorSpec {
  url: string
  validationRepo: string | null
  authentication: {
    type: string
    spec: {
      type: string
      spec: {
        username: string
        usernameRef: string | null
        tokenRef: string
      }
    }
  }
  apiAccess: {
    type: string
    spec: {
      tokenRef: string
    }
  } | null
  delegateSelectors: string[]
  executeOnDelegate: boolean
  proxy: boolean
  ignoreTestConnection: boolean
  type: string
}

export interface Connector {
  name: string
  identifier: string
  description: string
  accountIdentifier: string
  orgIdentifier: string
  projectIdentifier: string
  tags: Record<string, string>
  type: string
  spec: ConnectorSpec
}

export interface ConnectorStatus {
  status: 'SUCCESS' | 'FAILURE'
  errorSummary: string | null
  errors: Array<{
    reason: string
    message: string
    code: number
  }> | null
  testedAt: number
  lastTestedAt: number
  lastConnectedAt: number
  lastAlertSent: number | null
}

export interface ConnectorGitDetails {
  objectId: string | null
  branch: string | null
  repoIdentifier: string | null
  rootFolder: string | null
  filePath: string | null
  repoName: string | null
  commitId: string | null
  fileUrl: string | null
  repoUrl: string | null
  parentEntityConnectorRef: string | null
  parentEntityRepoName: string | null
  isHarnessCodeRepo: boolean | null
}

export interface ConnectorItem {
  connector: Connector
  createdAt: number
  lastModifiedAt: number
  status: ConnectorStatus
  activityDetails: {
    lastActivityTime: number
  }
  harnessManaged: boolean
  gitDetails: ConnectorGitDetails
  entityValidityDetails: {
    valid: boolean
    invalidYaml: string | null
  }
  governanceMetadata: any | null
  isFavorite: boolean
}

export enum ConnectorType {
  NEW = 'new',
  EXISTING = 'existing'
}
