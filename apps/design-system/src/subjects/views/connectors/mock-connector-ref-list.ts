import { ConnectorReferenceList } from '@harnessio/ui/views'

export const mockConnectorRefList = {
  content: [
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'pipeline.stages.test.spec.execution.steps.Run_1.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Pipelines',
        entityRef: {
          scope: 'project',
          identifier: 'project-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-1',
          parentUniqueId: 'parent-pipeline-id-1',
          metadata: {},
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default/project-demo-1'
        },
        name: 'project-1',
        entityGitMetadata: null
      },
      detail: {
        type: 'EntityReferredByPipelineSetupUsageDetail',
        identifier: 'test',
        referenceType: 'STAGE_IDENTIFIER'
      },
      createdAt: 1600000000000
    },
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'pipeline.stages.CustomCDK.spec.execution.steps.Cdk_Step_Group.steps.Background_1.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Pipelines',
        entityRef: {
          scope: 'project',
          identifier: 'project-2',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-2',
          parentUniqueId: 'parent-pipeline-id-2',
          metadata: {},
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default/project-demo-2'
        },
        name: 'project-pipeline-2',
        entityGitMetadata: null
      },
      detail: {
        type: 'EntityReferredByPipelineSetupUsageDetail',
        identifier: 'CustomCDK',
        referenceType: 'STAGE_IDENTIFIER'
      },
      createdAt: 1600100000000
    },
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'service.serviceDefinition.spec.artifacts.primary.sources.harness_idp_ui_gar.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Service',
        entityRef: {
          scope: 'project',
          identifier: 'service-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-3',
          parentUniqueId: 'parent-service-id-1',
          metadata: {},
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default/project-demo-3'
        },
        name: 'service-app',
        entityGitMetadata: null
      },
      detail: null,
      createdAt: 1600200000000
    },
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'service.serviceDefinition.spec.artifacts.primary.sources.artifactId.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Service',
        entityRef: {
          scope: 'project',
          identifier: 'service-2',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-2',
          parentUniqueId: 'parent-pipeline-id-2',
          metadata: {},
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default/project-demo-2'
        },
        name: 'service-2',
        entityGitMetadata: null
      },
      detail: null,
      createdAt: 1600300000000
    },
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'pipeline.stages.buildStg.spec.execution.steps.Run_1.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Pipelines',
        entityRef: {
          scope: 'project',
          identifier: 'project-3',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-2',
          parentUniqueId: 'parent-pipeline-id-2',
          metadata: {},
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default/project-demo-2'
        },
        name: 'test-nested-template',
        entityGitMetadata: null
      },
      detail: {
        type: 'EntityReferredByPipelineSetupUsageDetail',
        identifier: 'buildStg',
        referenceType: 'STAGE_IDENTIFIER'
      },
      createdAt: 1600400000000
    },
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'templateInputs.spec.execution.steps.BuildAndPushGAR_1.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Template',
        entityRef: {
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-4',
          parentUniqueId: 'parent-template-id-1',
          identifier: 'template-1',
          versionLabel: '1.0',
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          scope: 'project',
          default: true,
          metadata: {
            versionLabel: '1.0'
          }
        },
        name: 'build-machine-image',
        entityGitMetadata: null
      },
      detail: null,
      createdAt: 1600500000000
    },
    {
      accountIdentifier: 'account123456789',
      referredEntity: {
        type: 'Connectors',
        entityRef: {
          scope: 'org',
          identifier: 'connector-id-1',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: null,
          parentUniqueId: 'parent-unique-id-1',
          metadata: {
            fqn: 'pipeline.stages.BuildLinuxx64.spec.execution.steps.BuildAndPushGAR_1.spec.connectorRef'
          },
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default'
        },
        name: '',
        entityGitMetadata: null
      },
      referredByEntity: {
        type: 'Pipelines',
        entityRef: {
          scope: 'project',
          identifier: 'project-4',
          accountIdentifier: 'account123456789',
          orgIdentifier: 'default',
          projectIdentifier: 'project-demo-4',
          parentUniqueId: 'parent-template-id-1',
          metadata: {},
          repoIdentifier: null,
          branch: null,
          isDefault: true,
          default: true,
          fullyQualifiedScopeIdentifier: 'account123456789/default/project-demo-4'
        },
        name: 'build-machines',
        entityGitMetadata: null
      },
      detail: {
        type: 'EntityReferredByPipelineSetupUsageDetail',
        identifier: 'BuildLinux',
        referenceType: 'STAGE_IDENTIFIER'
      },
      createdAt: 1600600000000
    }
  ]
} as ConnectorReferenceList
