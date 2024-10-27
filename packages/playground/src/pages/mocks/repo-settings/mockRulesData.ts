export const branchRules = [
  {
    created: 1730068869877,
    updated: 1730068869877,
    identifier: 'rule-1',
    description: 'desc-1',
    type: 'branch',
    state: 'active',
    pattern: {},
    definition: {
      bypass: {},
      pullreq: {
        approvals: {
          require_code_owners: true
        },
        comments: {},
        status_checks: {
          require_uids: null
        },
        merge: {}
      },
      lifecycle: {}
    },
    created_by: {
      id: 5,
      uid: 'sanskar-sehgal',
      display_name: 'sans',
      email: 'sanskar.sehgal@harness.io',
      type: 'user',
      created: 1728591847687,
      updated: 1729710072769
    },
    users: {},
    uid: 'rule-1'
  },
  {
    created: 1730068877284,
    updated: 1730068877284,
    identifier: 'rule-2',
    description: 'desc-2',
    type: 'branch',
    state: 'active',
    pattern: {},
    definition: {
      bypass: {},
      pullreq: {
        approvals: {
          require_code_owners: true
        },
        comments: {},
        status_checks: {
          require_uids: null
        },
        merge: {}
      },
      lifecycle: {}
    },
    created_by: {
      id: 5,
      uid: 'sanskar-sehgal',
      display_name: 'sans',
      email: 'sanskar.sehgal@harness.io',
      type: 'user',
      created: 1728591847687,
      updated: 1729710072769
    },
    users: {},
    uid: 'rule-2'
  }
]
