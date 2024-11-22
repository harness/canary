import type { EnumPrincipalType, EnumPullReqReviewDecision } from '../components/pull-request/interfaces'

export const mockCodeOwnerData = {
  evaluation_entries: [
    {
      line_number: 2,
      pattern: 'WORKSPACE',
      owner_evaluations: [
        {
          owner: {
            id: 14,
            uid: 'default2',
            display_name: 'default2',
            email: 'default2@harness.io',
            type: 'user' as EnumPrincipalType,
            created: 1707765218469,
            updated: 1707765218469
          },
          review_decision: 'approved' as EnumPullReqReviewDecision,
          review_sha: ''
        },
        {
          owner: {
            id: 15,
            uid: 'admin',
            display_name: 'admin',
            email: 'admin@harness.io',
            type: 'user' as EnumPrincipalType,
            created: 1707765218469,
            updated: 1707765218469
          },
          review_decision: 'changereq' as EnumPullReqReviewDecision,
          review_sha: ''
        },
        {
          owner: {
            id: 15,
            uid: 'calvin',
            display_name: 'Calvin Lee',
            email: 'cl@harness.io',
            type: 'user' as EnumPrincipalType,
            created: 1707765218469,
            updated: 1707765218469
          },
          review_decision: 'approved' as EnumPullReqReviewDecision,
          review_sha: ''
        }
      ],
      user_group_owner_evaluations: []
    }
  ],
  file_sha: 'c170a02bb6d0160c41d4dc7f701bb15c64d9214b'
}
