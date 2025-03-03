import { TypesCodeOwnerEvaluationEntry, TypesOwnerEvaluation, TypesPrincipalInfo } from '@harnessio/code-service-client'

import { PullReqReviewDecision, TypeCheckData } from '../../../pages/pull-request/types/types'
import {
  capitalizeFirstLetter,
  changedFileId,
  checkIfOutdatedSha,
  determineStatusMessage,
  extractInfoForCodeOwnerContent,
  extractInfoFromRuleViolationArr,
  extractSpecificViolations,
  findChangeReqDecisions,
  findWaitingDecisions,
  generateAlphaNumericHash,
  generateStatusSummary,
  normalizeGitFilePath,
  processReviewDecision
} from '../pull-request-utils'

export enum EnumCheckStatus {
  Error = 'error',
  Failure = 'failure',
  Pending = 'pending',
  Running = 'running',
  Success = 'success'
}
export enum EnumPullReqReviewDecision {
  Approved = 'approved',
  ChangeReq = 'changereq',
  Pending = 'pending',
  Reviewed = 'reviewed',
  Waiting = 'waiting'
}

// Mock data
const mockChecks = [
  { check: { status: EnumCheckStatus.Success }, required: true, bypassable: false },
  { check: { status: EnumCheckStatus.Failure }, required: false, bypassable: false }
]

const mockViolationsData = {
  data: {
    rule_violations: [
      { violations: [{ code: 'rule1', description: 'Violation 1' }] },
      { violations: [{ code: 'rule2', description: 'Violation 2' }] }
    ]
  }
}

const mockReviewDecision = EnumPullReqReviewDecision.Approved
const mockReviewedSHA = 'sha1'
const mockSourceSHA = 'sha2'

// Mock data for findWaitingDecisions
const mockEntriesForWaitingDecisions: TypesCodeOwnerEvaluationEntry[] = [
  {
    pattern: '**',
    owner_evaluations: [
      {
        owner: {
          id: 3,
          uid: 'admin',
          display_name: 'Administrator',
          email: 'admin@gitness.io',
          type: 'user',
          created: 1699863416002,
          updated: 1699863416002
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        review_decision: '' as any, // Set to empty
        review_sha: ''
      }
    ],
    user_group_owner_evaluations: []
  }
]

// Mock data for findChangeReqDecisions
const mockEntriesForChangeReq: TypesCodeOwnerEvaluationEntry[] = [
  {
    owner_evaluations: [
      { review_decision: EnumPullReqReviewDecision.Approved },
      { review_decision: EnumPullReqReviewDecision.ChangeReq }
    ]
  },
  {
    owner_evaluations: [{ review_decision: EnumPullReqReviewDecision.Approved }]
  },
  {
    owner_evaluations: [{ review_decision: EnumPullReqReviewDecision.Reviewed }]
  }
]
// Mock data for extractInfoFromRuleViolationArr
const mockRuleViolations = [
  {
    violations: [{ message: 'Violation 1' }, { message: 'Violation 2' }]
  },
  {
    violations: [{ message: 'Violation 3' }]
  }
]

// Tests
describe('processReviewDecision', () => {
  it('should mark review as outdated if SHAs differ', () => {
    const result = processReviewDecision(mockReviewDecision, mockReviewedSHA, mockSourceSHA)
    expect(result).toBe(PullReqReviewDecision.outdated)
  })

  it('should not mark review as outdated if SHAs do not differ', () => {
    const sameSHA = 'sameSHA'
    const result = processReviewDecision(mockReviewDecision, sameSHA, sameSHA)
    expect(result).not.toBe(PullReqReviewDecision.outdated) // Assuming it returns a different decision
  })
  it('should return the original decision if not approved or SHAs are the same', () => {
    const result = processReviewDecision(PullReqReviewDecision.pending, 'sameSHA', 'sameSHA')
    expect(result).toBe(PullReqReviewDecision.pending)
  })
})

describe('generateStatusSummary', () => {
  it('should generate a summary of status checks', () => {
    const result = generateStatusSummary(mockChecks)
    expect(result.summary.total).toBe(2)
    expect(result.summary.successReq).toBe(1)
    expect(result.summary.failed).toBe(1)
  })
})

// Mock data for determineStatusMessage
const mockChecksForStatusMessage = [
  { check: { status: 'success' as EnumCheckStatus }, required: true },
  { check: { status: 'failure' as EnumCheckStatus }, required: false }
]

describe('determineStatusMessage', () => {
  it('should determine the status message based on the status summary', () => {
    const result = determineStatusMessage(mockChecksForStatusMessage as TypeCheckData[])
    expect(result).toEqual({
      color: 'text-success',
      content: '1 failed, 1 succeeded',
      status: 'success',
      title: 'All required checks passed'
    })
  })
})

describe('extractSpecificViolations', () => {
  it('should extract specific violations based on rule', () => {
    const result = extractSpecificViolations(mockViolationsData, 'rule1')
    expect(result).toEqual([{ code: 'rule1', description: 'Violation 1' }])
  })
})

describe('checkIfOutdatedSha', () => {
  it('should return true if SHAs differ', () => {
    const result = checkIfOutdatedSha(mockReviewedSHA, mockSourceSHA)
    expect(result).toBe(true)
  })
})

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    const result = capitalizeFirstLetter('hello')
    expect(result).toBe('Hello')
  })
})

describe('findChangeReqDecisions', () => {
  it('should find change request decisions from entries', () => {
    const result = findChangeReqDecisions(mockEntriesForChangeReq, 'changereq')
    expect(result).toEqual([
      {
        owner_evaluations: [{ review_decision: 'changereq' }]
      }
    ])
  })
})

describe('findWaitingDecisions', () => {
  it('should find waiting decisions from entries', () => {
    const result = findWaitingDecisions(mockEntriesForWaitingDecisions)
    expect(result).toEqual([
      {
        pattern: '**',
        owner_evaluations: [
          {
            owner: {
              id: 3,
              uid: 'admin',
              display_name: 'Administrator',
              email: 'admin@gitness.io',
              type: 'user',
              created: 1699863416002,
              updated: 1699863416002
            },
            review_decision: '',
            review_sha: ''
          }
        ],
        user_group_owner_evaluations: []
      }
    ])
  })
})

describe('normalizeGitFilePath', () => {
  it('should remove trailing tab if path contains spaces', () => {
    const pathWithSpacesAndTab = 'path/with a space/file.txt\t'
    const normalizedPath = normalizeGitFilePath(pathWithSpacesAndTab)
    expect(normalizedPath).toBe('path/with a space/file.txt')
  })
})

describe('generateAlphaNumericHash', () => {
  it('should generate an alphanumeric hash of specified length', () => {
    const result = generateAlphaNumericHash(5)
    expect(result).toHaveLength(5)
  })
})

// Mock data for extractInfoForCodeOwnerContent
const mockPropsForCodeOwnerContent = {
  approvedEvaluations: [{ reviewer: { display_name: 'John Doe' } as TypesPrincipalInfo, approved: true }],
  reqNoChangeReq: false,
  reqCodeOwnerApproval: true,
  minApproval: 1,
  reqCodeOwnerLatestApproval: false,
  minReqLatestApproval: 0,
  codeOwnerChangeReqEntries: [],
  codeOwnerPendingEntries: [],
  latestCodeOwnerApprovalArr: [],
  latestApprovalArr: [],
  codeOwnerApprovalEntries: [
    {
      owner_evaluations: [
        { reviewer: { display_name: 'Jane Smith' } as TypesPrincipalInfo, approved: true } as TypesOwnerEvaluation
      ]
    }
  ],
  changeReqReviewer: 'John Doe',
  changeReqEvaluations: []
}

describe('extractInfoForCodeOwnerContent', () => {
  it('should extract information for code owner content', () => {
    const result = extractInfoForCodeOwnerContent(mockPropsForCodeOwnerContent)
    expect(result).toEqual({
      title: 'Changes approved',
      statusMessage: 'Changes were approved by code owners',
      statusColor: 'text-success',
      statusIcon: 'success',
      isNotRequired: false
    })
  })
})

describe('changedFileId', () => {
  it('should return the changed file ID', () => {
    const result = changedFileId(['file.txt'])
    expect(result).toBe('file.txt')
  })

  it('should handle multiple changed files', () => {
    const result = changedFileId(['file1.txt', 'file2.txt'])
    expect(result).toBe('file1.txt::::file2.txt')
  })

  it('should handle no changed files', () => {
    const result = changedFileId([])
    expect(result).toBe('')
  })
})

describe('extractInfoFromRuleViolationArr', () => {
  it('should extract information from rule violation array', () => {
    const result = extractInfoFromRuleViolationArr(mockRuleViolations)
    expect(result).toEqual({
      checkIfBypassAllowed: false,
      uniqueViolations: new Set(['Violation 1', 'Violation 2', 'Violation 3']),
      violationArr: [
        {
          violation: 'Violation 1'
        },
        {
          violation: 'Violation 2'
        },
        {
          violation: 'Violation 3'
        }
      ]
    })
  })
})
