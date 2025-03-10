import { get } from '@harnessio/forms'

import { createConnectorPayloadBuilder } from './ConnectorPayloadBuilder'
import { ConnectorPayloadTypes, FormData, GitAPIAuthTypes, GitAuthTypes, GitConnectionType, ValueType } from './types'

const getGitAuthSpec = (formData: FormData): Record<string, any> | undefined => {
  const isAnonymous = formData.authType === GitAuthTypes.ANONYMOUS
  const oAuthAccessTokenRef = formData.oAuthAccessTokenRef || get(formData, 'spec.authentication.spec.spec.tokenRef')
  const oAuthRefreshTokenRef =
    formData.oAuthRefreshTokenRef || get(formData, 'spec.authentication.spec.spec.refreshTokenRef')
  if (isAnonymous) return undefined

  switch (formData.authType) {
    case GitAuthTypes.USER_TOKEN:
      return {
        username: formData.username?.value,
        tokenRef: formData.token?.referenceString
      }
    case GitAuthTypes.USER_PASSWORD:
      return {
        username: formData.username?.value,
        passwordRef: formData.password?.referenceString
      }
    case GitAuthTypes.OAUTH:
      return {
        tokenRef: oAuthAccessTokenRef,
        ...(oAuthRefreshTokenRef && {
          refreshTokenRef: oAuthRefreshTokenRef
        })
      }
    case GitAuthTypes.GITHUB_APP:
      return {
        installationId: formData.installationId?.type === ValueType.TEXT ? formData.installationId?.value : undefined,
        installationIdRef:
          formData.installationId?.type === ValueType.ENCRYPTED ? formData.installationId?.value : undefined,
        applicationId: formData.applicationId?.type === ValueType.TEXT ? formData.applicationId?.value : undefined,
        applicationIdRef:
          formData.applicationId?.type === ValueType.ENCRYPTED ? formData.applicationId?.value : undefined,
        privateKeyRef: formData.privateKey
      }
    default:
      return undefined
  }
}

const getGitApiAccessSpec = (formData: FormData): Record<string, any> => {
  switch (formData.apiAuthType) {
    case GitAPIAuthTypes.OAUTH:
      return {
        clientId: formData.clientId,
        clientSecret: formData.clientSecret?.referenceString,
        installationId: formData.installationId
      }
    case GitAPIAuthTypes.TOKEN:
      return {
        tokenRef: formData.apiAccessToken?.referenceString
      }
    case GitAPIAuthTypes.GITHUB_APP:
      return {
        applicationId: formData.applicationId,
        privateKeyRef: formData.privateKey?.referenceString,
        installationId: formData.installationId
      }
    default:
      return {}
  }
}

const buildGithubSpec = (formData: FormData): Record<string, any> => {
  const isAnonymous = formData.authType === GitAuthTypes.ANONYMOUS
  const getExecuteOnDelegateValue = ({ _formData }: { _formData: FormData }) => {
    return true
  }

  const spec: Record<string, any> = {
    ...(formData?.delegateSelectors ? { delegateSelectors: formData.delegateSelectors } : {}),
    executeOnDelegate: getExecuteOnDelegateValue(formData.connectivityMode),
    type: formData.urlType,
    url: formData.url,
    ...(formData.validationRepo ? { validationRepo: formData.validationRepo } : {}),
    authentication: {
      type: formData.connectionType,
      spec:
        formData.connectionType === GitConnectionType.SSH
          ? { sshKeyRef: formData.sshKey?.referenceString }
          : {
              type: formData.authType,
              spec: isAnonymous ? undefined : getGitAuthSpec(formData)
            }
    }
  }

  // Handle API Access
  if (formData.enableAPIAccess) {
    spec.apiAccess = {
      type: formData.apiAuthType,
      spec: getGitApiAccessSpec(formData)
    }
  }

  // Handle HTTP Proxy
  if (formData.connectionType === GitConnectionType.HTTP) {
    spec.proxy = formData.proxy
  }

  return spec
}

export const githubConnectorPayloadBuilder = createConnectorPayloadBuilder(
  ConnectorPayloadTypes.Github,
  buildGithubSpec
)
