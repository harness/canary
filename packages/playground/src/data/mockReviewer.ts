import type { EnumPullReqReviewDecision } from '../components/pull-request/interfaces'

export const mockReviewers = [
  {
    created: 1711754093953,
    updated: 1711754093953,
    type: 'self_assigned',
    latest_review_id: 111,
    review_decision: 'pending' as EnumPullReqReviewDecision,
    sha: '73b10cca5b9f5121822f31b81346954e5f1dce99',
    reviewer: {
      id: 1,
      uid: 'default',
      display_name: 'mcullough',
      email: 'default@harness.io',
      type: 'user',
      created: 1700943243392,
      updated: 1700943243392
    },
    added_by: {
      id: 2,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user',
      created: 1700943243392,
      updated: 1700943243392
    }
  },
  {
    created: 1711754093953,
    updated: 1711754093953,
    type: 'self_assigned',
    latest_review_id: 111,
    review_decision: 'approved' as EnumPullReqReviewDecision,
    sha: '73b10cca5b9f5121822f31b81346954e5f1dce99',
    reviewer: {
      id: 2,
      uid: 'default',
      display_name: 'Ted Richardson',
      email: 'default@harness.io',
      type: 'user',
      created: 1700943243392,
      updated: 1700943243392
    },
    added_by: {
      id: 1,
      uid: 'default',
      display_name: 'default',
      email: 'default@harness.io',
      type: 'user',
      created: 1700943243392,
      updated: 1700943243392
    }
  }
]
