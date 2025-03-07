import { FormData } from '@platform/connectors/interfaces/ConnectorInterface'
import { createConnectorPayloadBuilder } from './ConnectorPayloadBuilder'
import { Connectors } from '@platform/connectors/constants'
import { GitAuthTypes, GitAPIAuthTypes, GitConnectionType } from '@platform/connectors/pages/connectors/utils/ConnectorHelper'
import { getExecuteOnDelegateValue } from '@platform/connectors/pages/connectors/utils/ConnectorUtils'

const getGitAuthSpec = (formData: FormData): Record<string, any> => {
  const isAnonymous = formData.authType === GitAuthTypes.ANONYMOUS
  if (isAnonymous) return undefined

  switch (formData.authType) {
    case GitAuthTypes.HTTP_USERNAME_TOKEN:
      return {
        username: formData.username?.value,
        tokenRef: formData.token?.referenceString
      }
    case GitAuthTypes.HTTP_USERNAME_PASSWORD:
      return {
        username: formData.username?.value,
        passwordRef: formData.password?.referenceString
      }
    case GitAuthTypes.SSH_KEY:
      return {
        sshKeyRef: formData.sshKey?.referenceString
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
  Connectors.GITHUB,
  buildGithubSpec
)
