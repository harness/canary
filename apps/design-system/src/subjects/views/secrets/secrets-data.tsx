export const getSecretsData = () => [
  {
    secret: {
      type: 'SecretFile',
      name: 'secret-file-1',
      identifier: 'secret-id-1',
      orgIdentifier: 'org-default',
      projectIdentifier: 'project-xyz',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'secret-manager',
        additionalMetadata: null
      }
    },
    createdAt: 1741279791821,
    updatedAt: 1741279791821,
    draft: false,
    governanceMetadata: null
  },
  {
    secret: {
      type: 'SecretFile',
      name: 'secret-file-2',
      identifier: 'secret-id-2',
      orgIdentifier: 'org-default',
      projectIdentifier: 'project-xyz',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'secret-manager',
        additionalMetadata: null
      }
    },
    createdAt: 1741213431403,
    updatedAt: 1741213431403,
    draft: false,
    governanceMetadata: null
  },
  {
    secret: {
      type: 'SecretText',
      name: 'secret-text-1',
      identifier: 'secret-text-id-1',
      orgIdentifier: 'org-default',
      projectIdentifier: 'project-xyz',
      tags: {
        tag1: '',
        tag2: '',
        tag3: ''
      },
      description: 'desc',
      spec: {
        secretManagerIdentifier: 'secret-manager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1740785306341,
    updatedAt: 1740785306341,
    draft: false,
    governanceMetadata: null
  },
  {
    secret: {
      type: 'SecretText',
      name: 'secret-text-2',
      identifier: 'secret-text-id-2',
      orgIdentifier: 'org-default',
      projectIdentifier: 'project-xyz',
      tags: {},
      description: 'github token',
      spec: {
        secretManagerIdentifier: 'secret-manager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1719353653579,
    updatedAt: 1719353653579,
    draft: false,
    governanceMetadata: null
  },
  {
    secret: {
      type: 'SecretText',
      name: 'secret-text-3',
      identifier: 'secret-text-id-3',
      orgIdentifier: 'org-default',
      projectIdentifier: 'project-xyz',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'secret-manager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1710968557986,
    updatedAt: 1710968557986,
    draft: false,
    governanceMetadata: null
  },
  {
    secret: {
      type: 'SecretText',
      name: 'secret-text-4',
      identifier: 'secret-text-id-4',
      orgIdentifier: 'org-default',
      projectIdentifier: 'project-xyz',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'secret-manager',
        valueType: 'Inline',
        value: null,
        additionalMetadata: null
      }
    },
    createdAt: 1700005592914,
    updatedAt: 1700005592914,
    draft: false,
    governanceMetadata: null
  }
]

// export const getAccountsData = () => [
//   {
//     uuid: 'px7xd_BFRCi-pfWPYXVjvw',
//     accountName: 'harness-dev',
//     companyName: 'harness-dev',
//     clusterName: 'cluster1',
//     localEncryptionEnabled: false,
//     twoFactorAdminEnforced: false,
//     forImport: false,
//     cloudCostEnabled: false,
//     salesContacts: null,
//     licenseInfo: {
//       accountType: 'PAID',
//       accountStatus: 'ACTIVE',
//       expireAfterDays: 0,
//       expiryTime: 1727111595000,
//       licenseUnits: 1003000,
//       reasonForLicenseUpdate: null
//     },
//     ceLicenseInfo: {
//       licenseType: 'FULL_TRIAL',
//       expiryTime: 1656700199999
//     },
//     licenseId: null,
//     techStacks: [
//       {
//         category: 'Deployment Platforms',
//         technology: 'None'
//       }
//     ],
//     subdomainUrl: null,
//     defaultExperience: 'NG',
//     authenticationMechanism: 'USER_PASSWORD',
//     sessionTimeOutInMinutes: 1440,
//     publicAccessEnabled: true,
//     absoluteSessionTimeOutInMinutes: 0,
//     status: 'ACTIVE',
//     loginAllowed: true
//   }
// ]

export const getOrgData = () => [
  {
    organizationResponse: {
      organization: {
        identifier: 'org-anon-1',
        name: 'org-anon-1',
        description: '',
        tags: {}
      },
      createdAt: 1720080149569,
      lastModifiedAt: 1720080149569,
      harnessManaged: false
    },
    projectsCount: 1,
    connectorsCount: 1,
    secretsCount: 0,
    delegatesCount: 0,
    templatesCount: 0,
    admins: [
      {
        name: 'Admin User 1',
        email: 'admin1@example.com',
        uuid: 'uuid-admin-1',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Collaborator User 1',
        email: 'collab1@example.com',
        uuid: 'uuid-collab-1',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ]
  },
  {
    organizationResponse: {
      organization: {
        identifier: 'org-anon-2',
        name: 'org-anon-2',
        description: '',
        tags: {}
      },
      createdAt: 1689075271268,
      lastModifiedAt: 1689075271268,
      harnessManaged: false
    },
    projectsCount: 10,
    connectorsCount: 1,
    secretsCount: 1,
    delegatesCount: 0,
    templatesCount: 0,
    admins: [
      {
        name: 'Admin User 2',
        email: 'admin2@example.com',
        uuid: 'uuid-admin-2',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Collaborator User 2',
        email: 'collab2@example.com',
        uuid: 'uuid-collab-2',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ]
  }
]

export const getProjectData = () => [
  {
    projectResponse: {
      project: {
        orgIdentifier: 'org-1',
        identifier: 'project-1',
        name: 'project-1',
        color: '#0063f7',
        modules: [
          'CD',
          'CI',
          'CV',
          'CF',
          'CE',
          'STO',
          'CHAOS',
          'SRM',
          'IACM',
          'CET',
          'IDP',
          'CODE',
          'SSCA',
          'CORE',
          'PMS',
          'TEMPLATESERVICE',
          'SEI',
          'HAR'
        ],
        description: '',
        tags: {}
      },
      createdAt: 1720080389723,
      lastModifiedAt: 1720080389723,
      isFavorite: false
    },
    organization: {
      identifier: 'org-test-1',
      name: 'Org Test 1',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Admin 1',
        email: 'admin1@example.com',
        uuid: 'admin1-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: []
  },
  {
    projectResponse: {
      project: {
        orgIdentifier: 'org-2',
        identifier: 'project-2',
        name: 'project-2',
        color: '#0063f7',
        modules: [
          'CD',
          'CI',
          'CV',
          'CF',
          'CE',
          'STO',
          'CHAOS',
          'SRM',
          'IACM',
          'CET',
          'IDP',
          'CODE',
          'SSCA',
          'CORE',
          'PMS',
          'TEMPLATESERVICE',
          'SEI',
          'HAR'
        ],
        description: '',
        tags: {}
      },
      createdAt: 1700827366661,
      lastModifiedAt: 1700827366661,
      isFavorite: false
    },
    organization: {
      identifier: 'org-test-2',
      name: 'Org Test 2',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Admin 2',
        email: 'admin2@example.com',
        uuid: 'admin2-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Collaborator 1',
        email: 'collab1@example.com',
        uuid: 'collab1-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ]
  },
  {
    projectResponse: {
      project: {
        orgIdentifier: 'org-1',
        identifier: 'project-3',
        name: 'project-3',
        color: '#0063f7',
        modules: [
          'CD',
          'CI',
          'CV',
          'CF',
          'CE',
          'STO',
          'CHAOS',
          'SRM',
          'IACM',
          'CET',
          'IDP',
          'CODE',
          'SSCA',
          'CORE',
          'PMS',
          'TEMPLATESERVICE',
          'SEI',
          'HAR'
        ],
        description: '',
        tags: {}
      },
      createdAt: 1698861453045,
      lastModifiedAt: 1698861463436,
      isFavorite: false
    },
    organization: {
      identifier: 'org-default',
      name: 'Default Org',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Admin 3',
        email: 'admin3@example.com',
        uuid: 'admin3-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Collaborator 2',
        email: 'collab2@example.com',
        uuid: 'collab2-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ]
  },
  {
    projectResponse: {
      project: {
        orgIdentifier: 'org-2',
        identifier: 'project-4',
        name: 'project-4',
        color: '#e63535',
        modules: [
          'CD',
          'CI',
          'CV',
          'CF',
          'CE',
          'STO',
          'CHAOS',
          'SRM',
          'IACM',
          'CET',
          'IDP',
          'CODE',
          'SSCA',
          'CORE',
          'PMS',
          'TEMPLATESERVICE',
          'SEI',
          'HAR'
        ],
        description: '',
        tags: {}
      },
      createdAt: 1676075582941,
      lastModifiedAt: 1676075582941,
      isFavorite: false
    },
    organization: {
      identifier: 'org-code',
      name: 'Code Org',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Admin 4',
        email: 'admin4@example.com',
        uuid: 'admin4-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: []
  },
  {
    projectResponse: {
      project: {
        orgIdentifier: 'org-1',
        identifier: 'project-5',
        name: 'project-5',
        color: '#0063f7',
        modules: [
          'CD',
          'CI',
          'CV',
          'CF',
          'CE',
          'STO',
          'CHAOS',
          'SRM',
          'IACM',
          'CET',
          'IDP',
          'CODE',
          'SSCA',
          'CORE',
          'PMS',
          'TEMPLATESERVICE',
          'SEI',
          'HAR'
        ],
        description: '',
        tags: {}
      },
      createdAt: 1666881084984,
      lastModifiedAt: 1666881084984,
      isFavorite: false
    },
    organization: {
      identifier: 'org-triggers',
      name: 'Triggers Org',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Admin 5',
        email: 'admin5@example.com',
        uuid: 'admin5-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Collaborator 3',
        email: 'collab3@example.com',
        uuid: 'collab3-uuid',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ]
  }
]
