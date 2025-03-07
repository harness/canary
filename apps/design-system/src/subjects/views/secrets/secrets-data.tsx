export const getSecretsData = () => [
  {
    secret: {
      type: 'SecretFile',
      name: 'hellohjfe',
      identifier: 'hellohjfe',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
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
      name: 'hello',
      identifier: 'hello',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
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
      name: 'sanskar-test',
      identifier: 'sanskar-test',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {
        tag1: '',
        tag2: '',
        tag3: ''
      },
      description: 'desc',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
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
      name: 'abhinavrastogi-harness',
      identifier: 'abhinavrastogi-harness',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: 'github pat',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
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
      name: 'aws-access-key',
      identifier: 'aws-access-key',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
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
      name: 'abhinav-test',
      identifier: 'abhinavtest',
      orgIdentifier: 'default',
      projectIdentifier: 'abhinavtest3',
      tags: {},
      description: '',
      spec: {
        secretManagerIdentifier: 'harnessSecretManager',
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

export const getAccountsData = () => [
  {
    uuid: 'px7xd_BFRCi-pfWPYXVjvw',
    accountName: 'harness-dev',
    companyName: 'harness-dev',
    clusterName: 'cluster1',
    localEncryptionEnabled: false,
    twoFactorAdminEnforced: false,
    forImport: false,
    cloudCostEnabled: false,
    salesContacts: null,
    licenseInfo: {
      accountType: 'PAID',
      accountStatus: 'ACTIVE',
      expireAfterDays: 0,
      expiryTime: 1727111595000,
      licenseUnits: 1003000,
      reasonForLicenseUpdate: null
    },
    ceLicenseInfo: {
      licenseType: 'FULL_TRIAL',
      expiryTime: 1656700199999
    },
    licenseId: null,
    techStacks: [
      {
        category: 'Deployment Platforms',
        technology: 'None'
      }
    ],
    subdomainUrl: null,
    defaultExperience: 'NG',
    authenticationMechanism: 'USER_PASSWORD',
    sessionTimeOutInMinutes: 1440,
    publicAccessEnabled: true,
    absoluteSessionTimeOutInMinutes: 0,
    status: 'ACTIVE',
    loginAllowed: true
  }
]

export const getOrgData = () => [
  {
    organizationResponse: {
      organization: {
        identifier: 'sameed_Test',
        name: 'sameed_Test',
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
        name: 'Sameed Ul Haq',
        email: 'sameed.haq@harness.io',
        uuid: 'qSblIr49RqicjV2C8pJmpw',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Yash Rathore test',
        email: 'yash.rathore+1@harness.io',
        uuid: 'BDkEEa2BQOWX_p00FTStMg',
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
        identifier: 'Anjali',
        name: 'Anjali',
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
        name: 'Anjali Siwach',
        email: 'anjali.siwach@harness.io',
        uuid: '6b2lUhrqSVaq2q1pD1Ai0g',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'nikhil mishra',
        email: 'nikhil.mishra@harness.io',
        uuid: '0sZhwbdfSe64qHG4sZeYcQ',
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
        orgIdentifier: 'sameed_Test',
        identifier: 'Sameed_Test',
        name: 'Sameed_Test',
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
      identifier: 'sameed_Test',
      name: 'sameed_Test',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Sameed Ul Haq',
        email: 'sameed.haq@harness.io',
        uuid: 'qSblIr49RqicjV2C8pJmpw',
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
        orgIdentifier: 'Anjali',
        identifier: 'PL43094',
        name: 'PL-43094',
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
      identifier: 'Anjali',
      name: 'Anjali',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Jimit Gandhi',
        email: 'jimit.gandhi@harness.io',
        uuid: 'KYA2SGyJTTmM-duzJ_i_pg',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'jimit_1992',
        email: 'jimit_1992@mailinator.com',
        uuid: 'kBpu9YHzTnWxJM8ouTjXxA',
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
        orgIdentifier: 'default',
        identifier: 'abhinavtest3',
        name: 'abhinav-test-4',
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
      identifier: 'default',
      name: 'default',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Deba Chatterjee',
        email: 'debaditya.chatterjee@harness.io',
        uuid: '8sNtcQbiSr696pO_KOpJlw',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Raghav M',
        email: 'raghavsukt70@gmail.com',
        uuid: 'qHlpKjq2S36WQYICkr1BPg',
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
        orgIdentifier: 'code',
        identifier: 'johannes',
        name: 'johannes',
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
      identifier: 'code',
      name: 'code',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'Chanikya',
        email: 'chanikya.tippireddy@harness.io',
        uuid: 'kIYn-iMFRnGRyYt1PIRoqg',
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
        orgIdentifier: 'NgTriggersOrg',
        identifier: 'viniciusTest',
        name: 'viniciusTest',
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
      identifier: 'NgTriggersOrg',
      name: 'NgTriggersOrg',
      description: '',
      tags: {}
    },
    harnessManagedOrg: false,
    admins: [
      {
        name: 'shylaja.sundararajan@harness.io',
        email: 'shylaja.sundararajan@harness.io',
        uuid: 'lCf5uBXcQAGT1y4Qfc-uiQ',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ],
    collaborators: [
      {
        name: 'Abhinav Mittal 2',
        email: 'abhinav.mittal+1@harness.io',
        uuid: 'qwUyCw0SQ1qCmQ69AaPhdA',
        locked: false,
        disabled: false,
        externallyManaged: false,
        twoFactorAuthenticationEnabled: false
      }
    ]
  }
]
