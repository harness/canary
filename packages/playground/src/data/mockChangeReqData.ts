import type {
  EnumPrincipalType,
  EnumPullReqReviewDecision,
  EnumPullReqReviewerType
} from '../components/pull-request/interfaces'

export const mockChangeReqData = [
  {
    created: 1719877100786,
    updated: 1719877105822,
    type: 'self_assigned' as EnumPullReqReviewerType,
    latest_review_id: 153,
    review_decision: 'changereq' as EnumPullReqReviewDecision,
    sha: '552de456f6e5fec0071fdaba2e14dce3c7066db8',
    reviewer: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    },
    added_by: {
      id: 3,
      uid: 'admin',
      display_name: 'Administrator',
      email: 'admin@gitness.io',
      type: 'user' as EnumPrincipalType,
      created: 1699863416002,
      updated: 1699863416002
    }
  }
]
