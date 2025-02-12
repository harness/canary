import { EnumPrincipalType } from '@harnessio/ui/types'
import { DiffFileEntry, EnumPullReqState, TypesPullReqActivity, TypesRuleViolations } from '@harnessio/ui/views'

export const pullRequestProviderStore = {
  repoMetadata: {
    id: 44,
    parent_id: 23,
    identifier: 'new',
    path: 'test666/new',
    description:
      'dsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsaddsad',
    created_by: 22,
    created: 1736976067249,
    updated: 1737044851126,
    size: 332,
    size_updated: 1737011331966,
    default_branch: 'main',
    fork_id: 0,
    num_forks: 0,
    num_pulls: 1,
    num_closed_pulls: 0,
    num_open_pulls: 1,
    num_merged_pulls: 0,
    state: 0,
    git_url: 'http://localhost:3000/git/test666/new.git',
    git_ssh_url: 'ssh://git@localhost:2222/test666/new.git',
    is_public: true,
    importing: false,
    uid: 'new'
  },
  pullReqMetadata: {
    number: 1,
    created: 1737044851123,
    updated: 1737045007201,
    edited: 1737045007201,
    state: 'open' as EnumPullReqState,
    is_draft: false,
    title: 'Create cxzcxczx.txt',
    description: '',
    source_repo_id: 44,
    source_branch: 'dsad',
    source_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
    target_repo_id: 44,
    target_branch: 'main',

    merge_target_sha: 'c2769294883f8a86ec70bfc5dad6b6d315951634',
    merge_base_sha: '0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca',
    merge_check_status: 'mergeable',
    rebase_check_status: 'unchecked',
    author: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    stats: {
      commits: 2,
      files_changed: 2,
      additions: 2,
      deletions: 0,
      conversations: 3,
      unresolved_count: 3
    }
  },
  pullReqStats: {
    commits: 2,
    files_changed: 2,
    additions: 2,
    deletions: 0,
    conversations: 3,
    unresolved_count: 3
  },
  pullReqCommits: {
    commits: [
      {
        sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
        parent_shas: ['bf28bf043ef81c642a57b44b1b276e2eba4001fa'],
        title: 'Create gfdgfdgfdgfdg.txt',
        message: 'Create gfdgfdgfdgfdg.txt',
        author: {
          identity: {
            name: 'test1234',
            email: 'test1234@harness.io'
          },
          when: '2025-01-15T14:35:50-07:00'
        },
        committer: {
          identity: {
            name: 'Gitness',
            email: 'system@gitness.io'
          },
          when: '2025-01-15T14:35:50-07:00'
        }
      },
      {
        sha: 'bf28bf043ef81c642a57b44b1b276e2eba4001fa',
        parent_shas: ['0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca'],
        title: 'Create cxzcxczx.txt',
        message: 'Create cxzcxczx.txt',
        author: {
          identity: {
            name: 'test1234',
            email: 'test1234@harness.io'
          },
          when: '2025-01-15T14:35:30-07:00'
        },
        committer: {
          identity: {
            name: 'Gitness',
            email: 'system@gitness.io'
          },
          when: '2025-01-15T14:35:30-07:00'
        }
      }
    ],
    rename_details: [],
    total_commits: 2
  },
  pullReqActivities: [
    {
      id: 759,
      created: 1737044855598,
      updated: 1737044855598,
      edited: 1737044855598,
      parent_id: null,
      repo_id: 44,
      pullreq_id: 163,
      order: 1,
      sub_order: 0,
      type: 'comment',
      kind: 'comment',
      text: 's',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      }
    },
    {
      id: 760,
      created: 1737044857799,
      updated: 1737044857799,
      edited: 1737044857799,
      parent_id: null,
      repo_id: 44,
      pullreq_id: 163,
      order: 2,
      sub_order: 0,
      type: 'comment',
      kind: 'comment',
      text: 'a',
      payload: {},
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      }
    },
    {
      id: 761,
      created: 1737045007200,
      updated: 1737045007200,
      edited: 1737045007200,
      parent_id: null,
      repo_id: 44,
      pullreq_id: 163,
      order: 3,
      sub_order: 0,
      type: 'code-comment',
      kind: 'change-comment',
      text: 'ddd',
      payload: {
        title: '@@ -0,0 +1 @@',
        lines: ['+gfdgfdg'],
        line_start_new: true,
        line_end_new: true
      },
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      },
      code_comment: {
        outdated: false,
        merge_base_sha: '0e5ec7a99e6a6d6dfc2781bd6834c0581f3361ca',
        source_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
        path: 'cxzcxczx.txt',
        line_new: 1,
        span_new: 1,
        line_old: 0,
        span_old: 0
      }
    },
    {
      author: {
        id: 3,
        uid: 'admin',
        display_name: 'Administrator',
        email: 'admin@gitness.io',
        type: 'user',
        created: 1699863416002,
        updated: 1699863416002
      },
      created: 1737660855128,
      edited: 1737660855128,
      id: 795,
      kind: 'change-comment',
      order: 15,
      parent_id: null,
      payload: {
        id: 795,
        created: 1737660855128,
        updated: 1737660855128,
        edited: 1737660855128,
        parent_id: null,
        repo_id: 22,
        pullreq_id: 165,
        order: 15,
        sub_order: 0,
        type: 'code-comment',
        kind: 'change-comment',
        text: 'test-comment',
        payload: {
          title: '@@ -0,0 +141,5 @@',
          lines: [
            "+              str={getString('bySigningIn')}",
            '+              vars={{',
            '+                policy: <a href="https://harness.io/privacy"> {getString(\'privacyPolicy\')} </a>,',
            '+                terms: <a href="https://harness.io/subscriptionterms"> {getString(\'termsOfUse\')} </a>',
            '+              }}'
          ],
          line_start_new: true,
          line_end_new: true
        },
        author: {
          id: 3,
          uid: 'admin',
          display_name: 'Administrator',
          email: 'admin@gitness.io',
          type: 'user',
          created: 1699863416002,
          updated: 1699863416002
        },
        code_comment: {
          outdated: false,
          merge_base_sha: 'c1cb34a7eeaa2bd70a3ccc5440630220a8d31a18',
          source_sha: 'b179f4b0f7d3e217ed9898b67440ad7db96668be',
          path: 'newfile.tsx',
          line_new: 143,
          span_new: 1,
          line_old: 0,
          span_old: 0
        }
      },
      pullreq_id: 165,
      repo_id: 22,
      sub_order: 0,
      text: 'test-comment',
      type: 'code-comment',
      updated: 1737660855128
    }
  ] as TypesPullReqActivity[],
  loading: false,
  error: null,
  pullReqChecksDecision: {
    count: {
      error: 0,
      failure: 0,
      pending: 0,
      running: 0,
      success: 0,
      skipped: 0,
      killed: 0
    },
    error: null,
    data: {
      commit_sha: 'c59260ea5656e3e831b2d06a6524ad03c9f1ca9a',
      checks: null
    },
    color: 'GREEN_500',
    background: 'GREEN_50',
    message: '',
    checkInfo: {
      title: '',
      content: '',
      color: '',
      status: ''
    },
    summaryText: ''
  },
  showEditDescription: false,
  diffs: [
    {
      blocks: [
        {
          lines: [
            {
              content: '+gfdgfdg',
              type: 'insert',
              newNumber: 1
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 1,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '31a26d5db74951582e90d0620bc917eda0a77080',
      oldName: '/dev/null',
      language: 'txt',
      newName: 'cxzcxczx.txt',
      isCombined: false,
      containerId: 'container-/dev/null::::cxzcxczx.txt',
      contentId: 'content-/dev/null::::cxzcxczx.txt',
      fileId: '/dev/null::::cxzcxczx.txt',
      filePath: 'cxzcxczx.txt',
      fileViews: {
        has: () => {
          return false
        }
      },
      raw: 'diff --git a/cxzcxczx.txt b/cxzcxczx.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..31a26d5db74951582e90d0620bc917eda0a77080\n--- /dev/null\n+++ b/cxzcxczx.txt\n@@ -0,0 +1 @@\n+gfdgfdg\n\\ No newline at end of file\n'
    },
    {
      blocks: [
        {
          lines: [
            {
              content: '+ghfdgfdgfdg',
              type: 'insert',
              newNumber: 1
            }
          ],
          oldStartLine: 0,
          oldStartLine2: null,
          newStartLine: 1,
          header: '@@ -0,0 +1 @@'
        }
      ],
      deletedLines: 0,
      addedLines: 1,
      isGitDiff: true,
      newFileMode: '100644',
      isNew: true,
      checksumBefore: '0000000000000000000000000000000000000000',
      checksumAfter: '857f1f0597bf3e56b26d76db3d816911d0f0a3c7',
      oldName: '/dev/null',
      language: 'txt',
      newName: 'gfdgfdgfdgfdg.txt',
      isCombined: false,
      containerId: 'container-/dev/null::::gfdgfdgfdgfdg.txt',
      contentId: 'content-/dev/null::::gfdgfdgfdgfdg.txt',
      fileId: '/dev/null::::gfdgfdgfdgfdg.txt',
      filePath: 'gfdgfdgfdgfdg.txt',
      fileViews: {
        has: () => {
          return false
        }
      },
      raw: 'diff --git a/gfdgfdgfdgfdg.txt b/gfdgfdgfdgfdg.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..857f1f0597bf3e56b26d76db3d816911d0f0a3c7\n--- /dev/null\n+++ b/gfdgfdgfdgfdg.txt\n@@ -0,0 +1 @@\n+ghfdgfdgfdg\n\\ No newline at end of file\n'
    }
  ] as unknown as DiffFileEntry[],
  prPanelData: {
    ruleViolation: true,
    ruleViolationArr: {
      data: {
        rule_violations: [
          {
            rule: {
              repo_path: 'test666/new',
              identifier: 'test',
              type: 'branch',
              state: 'active'
            },
            bypassable: false,
            bypassed: false,
            violations: [
              {
                code: 'pullreq.merge.blocked',
                message: 'The merge for the branch main is not allowed.',
                params: ['main']
              }
            ]
          }
        ] as TypesRuleViolations[]
      }
    },
    requiresCommentApproval: false,
    atLeastOneReviewerRule: false,
    reqCodeOwnerApproval: false,
    minApproval: 0,
    reqCodeOwnerLatestApproval: false,
    minReqLatestApproval: 0,
    PRStateLoading: false,
    commentsLoading: false,
    commentsInfoData: {
      header: 'Unresolved comments',
      content: 'There are 0 unresolved comments',
      status: 'failed'
    }
  }
}

export const mockDiffs = [
  {
    blocks: [
      {
        lines: [
          {
            content: '+few',
            type: 'insert',
            newNumber: 1
          }
        ],
        oldStartLine: 0,
        oldStartLine2: null,
        newStartLine: 1,
        header: '@@ -0,0 +1 @@'
      }
    ],
    deletedLines: 0,
    addedLines: 1,
    isGitDiff: true,
    newFileMode: '100644',
    isNew: true,
    checksumBefore: '0000000000000000000000000000000000000000',
    checksumAfter: 'dab58467d181fe0293283f56ea8d5461a5384bdb',
    oldName: '/dev/null',
    language: 'txt',
    newName: 'new-file.txt',
    isCombined: false,
    containerId: 'container-/dev/null::::new-file.txt',
    contentId: 'content-/dev/null::::new-file.txt',
    fileId: '/dev/null::::new-file.txt',
    filePath: 'new-file.txt',
    fileViews: {
      has: () => {
        return false
      }
    },
    raw: 'diff --git a/new-file.txt b/new-file.txt\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..dab58467d181fe0293283f56ea8d5461a5384bdb\n--- /dev/null\n+++ b/new-file.txt\n@@ -0,0 +1 @@\n+few\n\\ No newline at end of file\n'
  },
  {
    blocks: [
      {
        lines: [
          {
            content: '+/*',
            type: 'insert',
            newNumber: 1
          },
          {
            content: '+ * Copyright 2023 Harness, Inc.',
            type: 'insert',
            newNumber: 2
          },
          {
            content: '+ *',
            type: 'insert',
            newNumber: 3
          },
          {
            content: '+ * Licensed under the Apache License, Version 2.0 (the "License");',
            type: 'insert',
            newNumber: 4
          },
          {
            content: '+ * you may not use this file except in compliance with the License.',
            type: 'insert',
            newNumber: 5
          },
          {
            content: '+ * You may obtain a copy of the License at',
            type: 'insert',
            newNumber: 6
          },
          {
            content: '+ *',
            type: 'insert',
            newNumber: 7
          },
          {
            content: '+ *     http://www.apache.org/licenses/LICENSE-2.0',
            type: 'insert',
            newNumber: 8
          },
          {
            content: '+ *',
            type: 'insert',
            newNumber: 9
          },
          {
            content: '+ * Unless required by applicable law or agreed to in writing, software',
            type: 'insert',
            newNumber: 10
          },
          {
            content: '+ * distributed under the License is distributed on an "AS IS" BASIS,',
            type: 'insert',
            newNumber: 11
          },
          {
            content: '+ * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
            type: 'insert',
            newNumber: 12
          },
          {
            content: '+ * See the License for the specific language governing permissions and',
            type: 'insert',
            newNumber: 13
          },
          {
            content: '+ * limitations under the License.',
            type: 'insert',
            newNumber: 14
          },
          {
            content: '+ */',
            type: 'insert',
            newNumber: 15
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 16
          },
          {
            content: "+import React, { useCallback } from 'react'",
            type: 'insert',
            newNumber: 17
          },
          {
            content: '+import {',
            type: 'insert',
            newNumber: 18
          },
          {
            content: '+  Button,',
            type: 'insert',
            newNumber: 19
          },
          {
            content: '+  Container,',
            type: 'insert',
            newNumber: 20
          },
          {
            content: '+  FlexExpander,',
            type: 'insert',
            newNumber: 21
          },
          {
            content: '+  FormInput,',
            type: 'insert',
            newNumber: 22
          },
          {
            content: '+  Formik,',
            type: 'insert',
            newNumber: 23
          },
          {
            content: '+  FormikForm,',
            type: 'insert',
            newNumber: 24
          },
          {
            content: '+  Layout,',
            type: 'insert',
            newNumber: 25
          },
          {
            content: '+  StringSubstitute,',
            type: 'insert',
            newNumber: 26
          },
          {
            content: '+  Text,',
            type: 'insert',
            newNumber: 27
          },
          {
            content: '+  useToaster',
            type: 'insert',
            newNumber: 28
          },
          {
            content: "+} from '@harnessio/uicore'",
            type: 'insert',
            newNumber: 29
          },
          {
            content: "+import { Color } from '@harnessio/design-system'",
            type: 'insert',
            newNumber: 30
          },
          {
            content: "+import * as Yup from 'yup'",
            type: 'insert',
            newNumber: 31
          },
          {
            content: "+import { Link } from 'react-router-dom'",
            type: 'insert',
            newNumber: 32
          },
          {
            content: "+import { useStrings } from 'framework/strings'",
            type: 'insert',
            newNumber: 33
          },
          {
            content: "+import AuthLayout from 'components/AuthLayout/AuthLayout'",
            type: 'insert',
            newNumber: 34
          },
          {
            content: "+import { useAppContext } from 'AppContext'",
            type: 'insert',
            newNumber: 35
          },
          {
            content: "+import { getErrorMessage, type RegisterForm } from 'utils/Utils'",
            type: 'insert',
            newNumber: 36
          },
          {
            content: "+import { useOnRegister } from 'services/code'",
            type: 'insert',
            newNumber: 37
          },
          {
            content: "+import css from './SignUp.module.scss'",
            type: 'insert',
            newNumber: 38
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 39
          },
          {
            content: '+export const SignUp: React.FC = () => {',
            type: 'insert',
            newNumber: 40
          },
          {
            content: '+  const { routes } = useAppContext()',
            type: 'insert',
            newNumber: 41
          },
          {
            content: '+  const { getString } = useStrings()',
            type: 'insert',
            newNumber: 42
          },
          {
            content: '+  const { showError, showSuccess } = useToaster()',
            type: 'insert',
            newNumber: 43
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 44
          },
          {
            content: '+  const { mutate } = useOnRegister({',
            type: 'insert',
            newNumber: 45
          },
          {
            content: '+    queryParams: {',
            type: 'insert',
            newNumber: 46
          },
          {
            content: '+      include_cookie: true',
            type: 'insert',
            newNumber: 47
          },
          {
            content: '+    }',
            type: 'insert',
            newNumber: 48
          },
          {
            content: '+  })',
            type: 'insert',
            newNumber: 49
          },
          {
            content: '+  const onRegister = useCallback(',
            type: 'insert',
            newNumber: 50
          },
          {
            content: '+    (data: RegisterForm) => {',
            type: 'insert',
            newNumber: 51
          },
          {
            content: '+      mutate(',
            type: 'insert',
            newNumber: 52
          },
          {
            content: '+        {',
            type: 'insert',
            newNumber: 53
          },
          {
            content: '+          display_name: data.username,',
            type: 'insert',
            newNumber: 54
          },
          {
            content: '+          email: data.email,',
            type: 'insert',
            newNumber: 55
          },
          {
            content: '+          uid: data.username,',
            type: 'insert',
            newNumber: 56
          },
          {
            content: '+          password: data.password',
            type: 'insert',
            newNumber: 57
          },
          {
            content: '+        },',
            type: 'insert',
            newNumber: 58
          },
          {
            content: '+        {',
            type: 'insert',
            newNumber: 59
          },
          {
            content: "+          headers: { Authorization: '' }",
            type: 'insert',
            newNumber: 60
          },
          {
            content: '+        }',
            type: 'insert',
            newNumber: 61
          },
          {
            content: '+      )',
            type: 'insert',
            newNumber: 62
          },
          {
            content: '+        .then(() => {',
            type: 'insert',
            newNumber: 63
          },
          {
            content: "+          showSuccess(getString('userCreated'))",
            type: 'insert',
            newNumber: 64
          },
          {
            content: '+          window.location.replace(window.location.origin + routes.toCODEHome())',
            type: 'insert',
            newNumber: 65
          },
          {
            content: '+        })',
            type: 'insert',
            newNumber: 66
          },
          {
            content: '+        .catch(error => {',
            type: 'insert',
            newNumber: 67
          },
          {
            content: '+          showError(getErrorMessage(error))',
            type: 'insert',
            newNumber: 68
          },
          {
            content: '+        })',
            type: 'insert',
            newNumber: 69
          },
          {
            content: '+    },',
            type: 'insert',
            newNumber: 70
          },
          {
            content: '+    [mutate, showSuccess, showError, getString, routes]',
            type: 'insert',
            newNumber: 71
          },
          {
            content: '+  )',
            type: 'insert',
            newNumber: 72
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 73
          },
          {
            content: '+  const handleSubmit = (data: RegisterForm): void => {',
            type: 'insert',
            newNumber: 74
          },
          {
            content: '+    if (data.username && data.password) {',
            type: 'insert',
            newNumber: 75
          },
          {
            content: '+      onRegister(data)',
            type: 'insert',
            newNumber: 76
          },
          {
            content: '+    }',
            type: 'insert',
            newNumber: 77
          },
          {
            content: '+  }',
            type: 'insert',
            newNumber: 78
          },
          {
            content: '+  return (',
            type: 'insert',
            newNumber: 79
          },
          {
            content: '+    <AuthLayout>',
            type: 'insert',
            newNumber: 80
          },
          {
            content: '+      <Container className={css.signUpContainer}>',
            type: 'insert',
            newNumber: 81
          },
          {
            content: "+        <Layout.Horizontal flex={{ alignItems: 'center' }}>",
            type: 'insert',
            newNumber: 82
          },
          {
            content: "+          <Text font={{ size: 'large', weight: 'bold' }} color={Color.BLACK}>",
            type: 'insert',
            newNumber: 83
          },
          {
            content: "+            {getString('signUp')}",
            type: 'insert',
            newNumber: 84
          },
          {
            content: '+          </Text>',
            type: 'insert',
            newNumber: 85
          },
          {
            content: '+          <FlexExpander />',
            type: 'insert',
            newNumber: 86
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 87
          },
          {
            content: '+          <Layout.Horizontal spacing="xsmall">',
            type: 'insert',
            newNumber: 88
          },
          {
            content: "+            <Text>{getString('alreadyHaveAccount')}</Text>",
            type: 'insert',
            newNumber: 89
          },
          {
            content: "+            <Link to={routes.toSignIn()}>{getString('signIn')}</Link>",
            type: 'insert',
            newNumber: 90
          },
          {
            content: '+          </Layout.Horizontal>',
            type: 'insert',
            newNumber: 91
          },
          {
            content: '+        </Layout.Horizontal>',
            type: 'insert',
            newNumber: 92
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 93
          },
          {
            content: "+        <Container margin={{ top: 'xlarge' }}>",
            type: 'insert',
            newNumber: 94
          },
          {
            content: '+          <Formik<RegisterForm>',
            type: 'insert',
            newNumber: 95
          },
          {
            content: "+            initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}",
            type: 'insert',
            newNumber: 96
          },
          {
            content: '+            formName="loginPageForm"',
            type: 'insert',
            newNumber: 97
          },
          {
            content: '+            validationSchema={Yup.object().shape({',
            type: 'insert',
            newNumber: 98
          },
          {
            content: "+              username: Yup.string().required(getString('userNameRequired')),",
            type: 'insert',
            newNumber: 99
          },
          {
            content: "+              email: Yup.string().email().required(getString('emailRequired')),",
            type: 'insert',
            newNumber: 100
          },
          {
            content:
              "+              password: Yup.string().min(6, getString('minPassLimit')).required(getString('passwordRequired')),",
            type: 'insert',
            newNumber: 101
          },
          {
            content: '+              confirmPassword: Yup.string()',
            type: 'insert',
            newNumber: 102
          },
          {
            content: "+                .required(getString('confirmPassRequired'))",
            type: 'insert',
            newNumber: 103
          },
          {
            content: "+                .oneOf([Yup.ref('password')], getString('matchPassword'))",
            type: 'insert',
            newNumber: 104
          },
          {
            content: '+            })}',
            type: 'insert',
            newNumber: 105
          },
          {
            content: '+            onSubmit={handleSubmit}>',
            type: 'insert',
            newNumber: 106
          },
          {
            content: '+            <FormikForm>',
            type: 'insert',
            newNumber: 107
          },
          {
            content: '+              <FormInput.Text',
            type: 'insert',
            newNumber: 108
          },
          {
            content: "+                placeholder={getString('enterUser')}",
            type: 'insert',
            newNumber: 109
          },
          {
            content: '+                name="username"',
            type: 'insert',
            newNumber: 110
          },
          {
            content: "+                label={getString('userId')}",
            type: 'insert',
            newNumber: 111
          },
          {
            content: '+                disabled={false}',
            type: 'insert',
            newNumber: 112
          },
          {
            content: '+              />',
            type: 'insert',
            newNumber: 113
          },
          {
            content:
              "+              <FormInput.Text placeholder={'email@work.com'} name=\"email\" label={getString('email')} disabled={false} />",
            type: 'insert',
            newNumber: 114
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 115
          },
          {
            content: '+              <FormInput.Text',
            type: 'insert',
            newNumber: 116
          },
          {
            content: '+                name="password"',
            type: 'insert',
            newNumber: 117
          },
          {
            content: "+                label={getString('password')}",
            type: 'insert',
            newNumber: 118
          },
          {
            content: "+                inputGroup={{ type: 'password' }}",
            type: 'insert',
            newNumber: 119
          },
          {
            content: '+                disabled={false}',
            type: 'insert',
            newNumber: 120
          },
          {
            content: "+                placeholder={getString('characterLimit')}",
            type: 'insert',
            newNumber: 121
          },
          {
            content: '+              />',
            type: 'insert',
            newNumber: 122
          },
          {
            content: '+              <FormInput.Text',
            type: 'insert',
            newNumber: 123
          },
          {
            content: '+                name="confirmPassword"',
            type: 'insert',
            newNumber: 124
          },
          {
            content: "+                label={getString('confirmPassword')}",
            type: 'insert',
            newNumber: 125
          },
          {
            content: "+                inputGroup={{ type: 'password' }}",
            type: 'insert',
            newNumber: 126
          },
          {
            content: '+                disabled={false}',
            type: 'insert',
            newNumber: 127
          },
          {
            content: "+                placeholder={getString('confirmPassword')}",
            type: 'insert',
            newNumber: 128
          },
          {
            content: '+              />',
            type: 'insert',
            newNumber: 129
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 130
          },
          {
            content:
              '+              <Button type="submit" intent="primary" loading={false} disabled={false} width="100%">',
            type: 'insert',
            newNumber: 131
          },
          {
            content: "+                {getString('signUp')}",
            type: 'insert',
            newNumber: 132
          },
          {
            content: '+              </Button>',
            type: 'insert',
            newNumber: 133
          },
          {
            content: '+            </FormikForm>',
            type: 'insert',
            newNumber: 134
          },
          {
            content: '+          </Formik>',
            type: 'insert',
            newNumber: 135
          },
          {
            content: '+        </Container>',
            type: 'insert',
            newNumber: 136
          },
          {
            content: '+',
            type: 'insert',
            newNumber: 137
          },
          {
            content: '+        <Layout.Horizontal margin={{ top: \'xlarge\' }} spacing="xsmall">',
            type: 'insert',
            newNumber: 138
          },
          {
            content: '+          <Text>',
            type: 'insert',
            newNumber: 139
          },
          {
            content: '+            <StringSubstitute',
            type: 'insert',
            newNumber: 140
          },
          {
            content: "+              str={getString('bySigningIn')}",
            type: 'insert',
            newNumber: 141
          },
          {
            content: '+              vars={{',
            type: 'insert',
            newNumber: 142
          },
          {
            content:
              '+                policy: <a href="https://harness.io/privacy"> {getString(\'privacyPolicy\')} </a>,',
            type: 'insert',
            newNumber: 143
          },
          {
            content:
              '+                terms: <a href="https://harness.io/subscriptionterms"> {getString(\'termsOfUse\')} </a>',
            type: 'insert',
            newNumber: 144
          },
          {
            content: '+              }}',
            type: 'insert',
            newNumber: 145
          },
          {
            content: '+            />',
            type: 'insert',
            newNumber: 146
          },
          {
            content: '+          </Text>',
            type: 'insert',
            newNumber: 147
          },
          {
            content: '+        </Layout.Horizontal>',
            type: 'insert',
            newNumber: 148
          },
          {
            content: '+      </Container>',
            type: 'insert',
            newNumber: 149
          },
          {
            content: '+    </AuthLayout>',
            type: 'insert',
            newNumber: 150
          },
          {
            content: '+  )',
            type: 'insert',
            newNumber: 151
          },
          {
            content: '+}',
            type: 'insert',
            newNumber: 152
          }
        ],
        oldStartLine: 0,
        oldStartLine2: null,
        newStartLine: 1,
        header: '@@ -0,0 +1,152 @@'
      }
    ],
    deletedLines: 0,
    addedLines: 152,
    isGitDiff: true,
    newFileMode: '100644',
    isNew: true,
    checksumBefore: '0000000000000000000000000000000000000000',
    checksumAfter: 'd42407b8e4519ad202e661580d149fedac537ee5',
    oldName: '/dev/null',
    language: 'tsx',
    newName: 'newfile.tsx',
    isCombined: false,
    containerId: 'container-/dev/null::::newfile.tsx',
    contentId: 'content-/dev/null::::newfile.tsx',
    fileId: '/dev/null::::newfile.tsx',
    filePath: 'newfile.tsx',
    fileViews: {
      has: () => {
        return false
      }
    },
    raw: "diff --git a/newfile.tsx b/newfile.tsx\nnew file mode 100644\nindex 0000000000000000000000000000000000000000..d42407b8e4519ad202e661580d149fedac537ee5\n--- /dev/null\n+++ b/newfile.tsx\n@@ -0,0 +1,152 @@\n+/*\n+ * Copyright 2023 Harness, Inc.\n+ *\n+ * Licensed under the Apache License, Version 2.0 (the \"License\");\n+ * you may not use this file except in compliance with the License.\n+ * You may obtain a copy of the License at\n+ *\n+ *     http://www.apache.org/licenses/LICENSE-2.0\n+ *\n+ * Unless required by applicable law or agreed to in writing, software\n+ * distributed under the License is distributed on an \"AS IS\" BASIS,\n+ * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n+ * See the License for the specific language governing permissions and\n+ * limitations under the License.\n+ */\n+\n+import React, { useCallback } from 'react'\n+import {\n+  Button,\n+  Container,\n+  FlexExpander,\n+  FormInput,\n+  Formik,\n+  FormikForm,\n+  Layout,\n+  StringSubstitute,\n+  Text,\n+  useToaster\n+} from '@harnessio/uicore'\n+import { Color } from '@harnessio/design-system'\n+import * as Yup from 'yup'\n+import { Link } from 'react-router-dom'\n+import { useStrings } from 'framework/strings'\n+import AuthLayout from 'components/AuthLayout/AuthLayout'\n+import { useAppContext } from 'AppContext'\n+import { getErrorMessage, type RegisterForm } from 'utils/Utils'\n+import { useOnRegister } from 'services/code'\n+import css from './SignUp.module.scss'\n+\n+export const SignUp: React.FC = () => {\n+  const { routes } = useAppContext()\n+  const { getString } = useStrings()\n+  const { showError, showSuccess } = useToaster()\n+\n+  const { mutate } = useOnRegister({\n+    queryParams: {\n+      include_cookie: true\n+    }\n+  })\n+  const onRegister = useCallback(\n+    (data: RegisterForm) => {\n+      mutate(\n+        {\n+          display_name: data.username,\n+          email: data.email,\n+          uid: data.username,\n+          password: data.password\n+        },\n+        {\n+          headers: { Authorization: '' }\n+        }\n+      )\n+        .then(() => {\n+          showSuccess(getString('userCreated'))\n+          window.location.replace(window.location.origin + routes.toCODEHome())\n+        })\n+        .catch(error => {\n+          showError(getErrorMessage(error))\n+        })\n+    },\n+    [mutate, showSuccess, showError, getString, routes]\n+  )\n+\n+  const handleSubmit = (data: RegisterForm): void => {\n+    if (data.username && data.password) {\n+      onRegister(data)\n+    }\n+  }\n+  return (\n+    <AuthLayout>\n+      <Container className={css.signUpContainer}>\n+        <Layout.Horizontal flex={{ alignItems: 'center' }}>\n+          <Text font={{ size: 'large', weight: 'bold' }} color={Color.BLACK}>\n+            {getString('signUp')}\n+          </Text>\n+          <FlexExpander />\n+\n+          <Layout.Horizontal spacing=\"xsmall\">\n+            <Text>{getString('alreadyHaveAccount')}</Text>\n+            <Link to={routes.toSignIn()}>{getString('signIn')}</Link>\n+          </Layout.Horizontal>\n+        </Layout.Horizontal>\n+\n+        <Container margin={{ top: 'xlarge' }}>\n+          <Formik<RegisterForm>\n+            initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}\n+            formName=\"loginPageForm\"\n+            validationSchema={Yup.object().shape({\n+              username: Yup.string().required(getString('userNameRequired')),\n+              email: Yup.string().email().required(getString('emailRequired')),\n+              password: Yup.string().min(6, getString('minPassLimit')).required(getString('passwordRequired')),\n+              confirmPassword: Yup.string()\n+                .required(getString('confirmPassRequired'))\n+                .oneOf([Yup.ref('password')], getString('matchPassword'))\n+            })}\n+            onSubmit={handleSubmit}>\n+            <FormikForm>\n+              <FormInput.Text\n+                placeholder={getString('enterUser')}\n+                name=\"username\"\n+                label={getString('userId')}\n+                disabled={false}\n+              />\n+              <FormInput.Text placeholder={'email@work.com'} name=\"email\" label={getString('email')} disabled={false} />\n+\n+              <FormInput.Text\n+                name=\"password\"\n+                label={getString('password')}\n+                inputGroup={{ type: 'password' }}\n+                disabled={false}\n+                placeholder={getString('characterLimit')}\n+              />\n+              <FormInput.Text\n+                name=\"confirmPassword\"\n+                label={getString('confirmPassword')}\n+                inputGroup={{ type: 'password' }}\n+                disabled={false}\n+                placeholder={getString('confirmPassword')}\n+              />\n+\n+              <Button type=\"submit\" intent=\"primary\" loading={false} disabled={false} width=\"100%\">\n+                {getString('signUp')}\n+              </Button>\n+            </FormikForm>\n+          </Formik>\n+        </Container>\n+\n+        <Layout.Horizontal margin={{ top: 'xlarge' }} spacing=\"xsmall\">\n+          <Text>\n+            <StringSubstitute\n+              str={getString('bySigningIn')}\n+              vars={{\n+                policy: <a href=\"https://harness.io/privacy\"> {getString('privacyPolicy')} </a>,\n+                terms: <a href=\"https://harness.io/subscriptionterms\"> {getString('termsOfUse')} </a>\n+              }}\n+            />\n+          </Text>\n+        </Layout.Horizontal>\n+      </Container>\n+    </AuthLayout>\n+  )\n+}\n"
  }
] as unknown as DiffFileEntry[]
