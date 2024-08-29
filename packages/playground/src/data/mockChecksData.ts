import { EnumCheckPayloadKind, EnumCheckStatus, EnumPrincipalType } from '../components/pull-request/interfaces'

export const mockChecksFailedData = [
  {
    required: false,
    bypassable: false,
    check: {
      id: 969,
      created: 1715284980344,
      updated: 1715284986898,
      identifier:
        'BIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIG',
      status: 'running' as EnumCheckStatus,
      summary: 'BIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIG',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 13,
          repo_id: 3,
          pipeline_id: 9
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'BIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIGBIGNAMEBIG'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 966,
      created: 1715284980191,
      updated: 1715284984657,
      identifier: 'newpp',
      status: 'success' as EnumCheckStatus,
      summary: 'newpp',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 31,
          repo_id: 3,
          pipeline_id: 6
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'newpp'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 964,
      created: 1715284980142,
      updated: 1715284982654,
      identifier: 'post',
      status: 'error' as EnumCheckStatus,
      summary: 'post',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 32,
          repo_id: 3,
          pipeline_id: 5
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service',
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'post'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 961,
      created: 1715284980048,
      updated: 1715284981432,
      identifier: 'test2',
      status: 'failed' as EnumCheckStatus,
      summary: 'test2',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 99,
          repo_id: 3,
          pipeline_id: 3
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'test2'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 962,
      created: 1715284980089,
      updated: 1715284982632,
      identifier: 'test3',
      status: 'pending' as EnumCheckStatus,
      summary: 'test3',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 97,
          repo_id: 3,
          pipeline_id: 4
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'test3'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 967,
      created: 1715284980255,
      updated: 1715284985147,
      identifier: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinename',
      status: 'success' as EnumCheckStatus,
      summary: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinename',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 15,
          repo_id: 3,
          pipeline_id: 7
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinename'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 968,
      created: 1715284980312,
      updated: 1715284986410,
      identifier: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenameth',
      status: 'success' as EnumCheckStatus,
      summary: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenameth',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 14,
          repo_id: 3,
          pipeline_id: 8
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenameth'
    }
  }
]

export const mockChecksSuccessData = [
  {
    required: false,
    bypassable: false,
    check: {
      id: 967,
      created: 1715284980255,
      updated: 1715284985147,
      identifier: 'thisisabighisisabigpipelinename',
      status: 'success' as EnumCheckStatus,
      summary: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinename',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 15,
          repo_id: 3,
          pipeline_id: 7
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinename'
    }
  },
  {
    required: false,
    bypassable: false,
    check: {
      id: 968,
      created: 1715284980312,
      updated: 1715284986410,
      identifier: 'thisisanameth',
      status: 'success' as EnumCheckStatus,
      summary: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenameth',
      metadata: {},
      payload: {
        version: '1',
        kind: 'pipeline' as EnumCheckPayloadKind,
        data: {
          execution_number: 14,
          repo_id: 3,
          pipeline_id: 8
        }
      },
      reported_by: {
        id: 1,
        uid: 'gitness',
        display_name: 'Gitness',
        email: 'system@gitness.io',
        type: 'service' as EnumPrincipalType,
        created: 1699863415934,
        updated: 1699863415934
      },
      uid: 'thisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenamethisisabigpipelinenameth'
    }
  }
]
