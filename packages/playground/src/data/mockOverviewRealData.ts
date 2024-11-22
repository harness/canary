import type {
  EnumPrincipalType,
  EnumPullReqActivityKind,
  EnumPullReqActivityType
} from '../components/pull-request/interfaces'

export const mockOverviewRealData = [
  {
    id: 316,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725335161983,
    edited: 1725335161983,
    updated: 1725335161983,
    outdated: false,
    payload: {
      id: 316,
      created: 1725335161983,
      updated: 1725335161983,
      edited: 1725335161983,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 59,
      order: 2,
      sub_order: 0,
      type: 'branch-delete' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        sha: '3024731eb5c27938cce2a7686506aea543fd0cc1'
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    },
    deleted: 0,
    content: 'Comment content'
  },

  {
    id: 315,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725335161955,
    edited: 1725335161955,
    updated: 1725335161955,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 315,
      created: 1725335161955,
      updated: 1725335161955,
      edited: 1725335161955,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 59,
      order: 1,
      sub_order: 0,
      type: 'merge' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        merge_method: 'merge',
        merge_sha: '10b6f3afa7ca8ff8c5330fa2bf82f879471160c8',
        target_sha: '26cd0c202180f82738823d5351488540f331f943',
        source_sha: '3024731eb5c27938cce2a7686506aea543fd0cc1',
        rules_bypassed: true
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 314,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725334176016,
    edited: 1725334176016,
    updated: 1725334176016,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 314,
      created: 1725334176016,
      updated: 1725334176016,
      edited: 1725334176016,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 68,
      sub_order: 0,
      type: 'state-change' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'open',
        new: 'open',
        old_draft: false,
        new_draft: true
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 313,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725334115568,
    edited: 1725334115568,
    updated: 1725334115568,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 313,
      created: 1725334115568,
      updated: 1725334115568,
      edited: 1725334115568,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 67,
      sub_order: 0,
      type: 'state-change' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'open',
        new: 'open',
        old_draft: true,
        new_draft: false
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 312,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725334112782,
    edited: 1725334112782,
    updated: 1725334112782,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 312,
      created: 1725334112782,
      updated: 1725334112782,
      edited: 1725334112782,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 66,
      sub_order: 0,
      type: 'state-change' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'open',
        new: 'open',
        old_draft: false,
        new_draft: true
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 311,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725334110643,
    edited: 1725334110643,
    updated: 1725334110643,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 311,
      created: 1725334110643,
      updated: 1725334110643,
      edited: 1725334110643,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 65,
      sub_order: 0,
      type: 'state-change' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'closed',
        new: 'open',
        old_draft: false,
        new_draft: false
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 310,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725334022449,
    edited: 1725334022449,
    updated: 1725334022449,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 310,
      created: 1725334022449,
      updated: 1725334022449,
      edited: 1725334022449,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 64,
      sub_order: 0,
      type: 'state-change' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'open',
        new: 'closed',
        old_draft: false,
        new_draft: false
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 309,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725157425941,
    edited: 1725157425941,
    updated: 1725157425941,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 309,
      created: 1725157425941,
      updated: 1725157425941,
      edited: 1725157425941,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 63,
      sub_order: 0,
      type: 'branch-update' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: '1f248b1b2abfad1c10a3feaa4208e52e600a2681',
        new: '42303ff7c6215d8c77399387be01ed6231e36c69',
        forced: false,
        commit_title: 'tests 2'
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 307,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725156123046,
    edited: 1725156123046,
    updated: 1725156127220,
    outdated: false,
    content: 'testddd',
    deleted: 0,
    payload: {
      id: 307,
      created: 1725156123046,
      updated: 1725156127220,
      edited: 1725156123046,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 62,
      sub_order: 0,
      type: 'comment' as EnumPullReqActivityType,
      kind: 'comment' as EnumPullReqActivityKind,
      text: 'testddd',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },
  {
    id: 308,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725156127220,
    edited: 1725156127220,
    updated: 1725156127220,
    outdated: false,
    content: 'ddddd',
    deleted: 0,
    payload: {
      id: 308,
      created: 1725156127220,
      updated: 1725156127220,
      edited: 1725156127220,
      parent_id: 307,
      repo_id: 3,
      pullreq_id: 12,
      order: 62,
      sub_order: 1,
      type: 'comment' as EnumPullReqActivityType,
      kind: 'comment' as EnumPullReqActivityKind,
      text: 'ddddd',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 305,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725155989149,
    edited: 1725155989149,
    updated: 1725155989149,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 305,
      created: 1725155989149,
      updated: 1725155989149,
      edited: 1725155989149,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 61,
      sub_order: 0,
      type: 'title-change' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'Create xcxc.txt',
        new: 'Create xcxc.txt-edit'
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 302,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725031361236,
    edited: 1725031361236,
    updated: 1725156116112,
    outdated: false,
    deleted: 0,
    content: 'saw',
    payload: {
      id: 302,
      created: 1725031361236,
      updated: 1725156116112,
      edited: 1725031361236,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 60,
      sub_order: 0,
      type: 'code-comment' as EnumPullReqActivityType,
      kind: 'change-comment' as EnumPullReqActivityKind,
      text: 'saw',
      payload: {
        title: '@@ -0,0 +1,3 @@',
        lines: ['+gfgfgfgfg', '+fdfdf', '+Dfdf'],
        line_start_new: true,
        line_end_new: true
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      },
      code_comment: {
        outdated: false,
        merge_base_sha: '28b19d7a201025444f68932453dc9e016f2e8b9d',
        source_sha: '1f248b1b2abfad1c10a3feaa4208e52e600a2681',
        path: 'cxcxcxcx.txt',
        line_new: 3,
        span_new: 1,
        line_old: 0,
        span_old: 0
      }
    }
  },
  {
    id: 306,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725156116112,
    edited: 1725156116112,
    updated: 1725156116112,
    outdated: false,
    content: 'test',
    deleted: 0,
    payload: {
      id: 306,
      created: 1725156116112,
      updated: 1725156116112,
      edited: 1725156116112,
      parent_id: 302,
      repo_id: 3,
      pullreq_id: 12,
      order: 60,
      sub_order: 1,
      type: 'comment' as EnumPullReqActivityType,
      kind: 'change-comment' as EnumPullReqActivityKind,
      text: 'test',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 301,
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    created: 1725031340170,
    edited: 1725031340170,
    updated: 1725031340170,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 301,
      created: 1725031340170,
      updated: 1725031340170,
      edited: 1725031340170,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 59,
      sub_order: 0,
      type: 'branch-update' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: '4db87d4622af902510a642e6e58b435febaa1cbb',
        new: '1f248b1b2abfad1c10a3feaa4208e52e600a2681',
        forced: false,
        commit_title: 'chore: add new text framework'
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user' as EnumPrincipalType,
        created: 1699863416002,
        updated: 1699863416002
      }
    }
  },

  {
    id: 168,
    author: {
      id: 5,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user' as EnumPrincipalType,
      created: 1700943243392,
      updated: 1700943243392
    },
    created: 1708113965258,
    edited: 1708113965258,
    updated: 1708113965258,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 168,
      created: 1708113965258,
      updated: 1708113965258,
      edited: 1708113965258,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 58,
      sub_order: 0,
      type: 'review-submit' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        commit_sha: '4db87d4622af902510a642e6e58b435febaa1cbb',
        decision: 'approved'
      },
      author: {
        id: 5,
        uid: 'default',
        display_name: 'default',
        email: 'default@harness.io',
        type: 'user' as EnumPrincipalType,
        created: 1700943243392,
        updated: 1700943243392
      }
    }
  },

  {
    id: 167,
    author: {
      id: 5,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user' as EnumPrincipalType,
      created: 1700943243392,
      updated: 1700943243392
    },
    created: 1708113855985,
    edited: 1708113855985,
    updated: 1708113855985,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 167,
      created: 1708113855985,
      updated: 1708113855985,
      edited: 1708113855985,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 57,
      sub_order: 0,
      type: 'branch-update' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        old: 'b12d8960b142b4f10109d08b7615d554cfe40bb8',
        new: '4db87d4622af902510a642e6e58b435febaa1cbb',
        forced: false,
        commit_title: ' chore: add new text framework 2'
      },
      author: {
        id: 5,
        uid: 'default',
        display_name: 'default',
        email: 'default@harness.io',
        type: 'user' as EnumPrincipalType,
        created: 1700943243392,
        updated: 1700943243392
      }
    }
  },

  {
    id: 166,
    author: {
      id: 5,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user' as EnumPrincipalType,
      created: 1700943243392,
      updated: 1700943243392
    },
    created: 1708113843020,
    edited: 1708113843020,
    updated: 1708113843020,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 166,
      created: 1708113843020,
      updated: 1708113843020,
      edited: 1708113843020,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 56,
      sub_order: 0,
      type: 'review-submit' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        commit_sha: 'b12d8960b142b4f10109d08b7615d554cfe40bb8',
        decision: 'changereq'
      },
      author: {
        id: 5,
        uid: 'default',
        display_name: 'default',
        email: 'default@harness.io',
        type: 'user' as EnumPrincipalType,
        created: 1700943243392,
        updated: 1700943243392
      }
    }
  },

  {
    id: 165,
    author: {
      id: 5,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user' as EnumPrincipalType,
      created: 1700943243392,
      updated: 1700943243392
    },
    created: 1708113838167,
    edited: 1708113838167,
    updated: 1708113838167,
    outdated: false,
    deleted: 0,
    content: 'Comment content',
    payload: {
      id: 165,
      created: 1708113838167,
      updated: 1708113838167,
      edited: 1708113838167,
      parent_id: null,
      repo_id: 3,
      pullreq_id: 12,
      order: 55,
      sub_order: 0,
      type: 'review-submit' as EnumPullReqActivityType,
      kind: 'system' as EnumPullReqActivityKind,
      text: '',
      payload: {
        commit_sha: 'b12d8960b142b4f10109d08b7615d554cfe40bb8',
        decision: 'approved'
      },
      author: {
        id: 5,
        uid: 'default',
        display_name: 'default',
        email: 'default@harness.io',
        type: 'user' as EnumPrincipalType,
        created: 1700943243392,
        updated: 1700943243392
      }
    }
  }
]
