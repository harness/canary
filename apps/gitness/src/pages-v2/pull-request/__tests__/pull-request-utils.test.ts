import { describe, expect, it } from 'vitest'

import {
  EnumCheckStatus,
  EnumPullReqReviewDecision,
  TypesCodeOwnerEvaluationEntry,
  TypesOwnerEvaluation,
  TypesPrincipalInfo
} from '@harnessio/code-service-client'

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
  getErrorMessage,
  normalizeGitFilePath,
  processReviewDecision
} from '../pull-request-utils'

// Mock data
const mockChecks = [
  { check: { status: 'success' as EnumCheckStatus }, required: true, bypassable: false },
  { check: { status: 'failure' as EnumCheckStatus }, required: false, bypassable: false }
]

const mockViolationsData = {
  data: {
    rule_violations: [
      { violations: [{ code: 'rule1', description: 'Violation 1' }] },
      { violations: [{ code: 'rule2', description: 'Violation 2' }] }
    ]
  }
}

const mockReviewDecision = 'approved' as EnumPullReqReviewDecision
const mockReviewedSHA = 'sha1'
const mockSourceSHA = 'sha2'

// Mock data for findWaitingDecisions
const mockEntriesForWaitingDecisions: TypesCodeOwnerEvaluationEntry[] = [
  {
    owner_evaluations: [
      { review_decision: undefined }, // Empty decision
      { review_decision: 'request_changes' as EnumPullReqReviewDecision }
    ]
  },
  {
    owner_evaluations: [{ review_decision: 'approved' }]
  },
  {
    owner_evaluations: [
      { review_decision: undefined }, // Empty decision
      { review_decision: 'reviewed' as EnumPullReqReviewDecision }
    ]
  }
]

// Mock data for findChangeReqDecisions
const mockEntriesForChangeReq: TypesCodeOwnerEvaluationEntry[] = [
  {
    owner_evaluations: [
      { review_decision: 'approve' as EnumPullReqReviewDecision },
      { review_decision: 'request_changes' as EnumPullReqReviewDecision }
    ]
  },
  {
    owner_evaluations: [{ review_decision: 'approve' as EnumPullReqReviewDecision }]
  },
  {
    owner_evaluations: [{ review_decision: 'reviewed' as EnumPullReqReviewDecision }]
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
    const result = findChangeReqDecisions(mockEntriesForChangeReq, 'approve')
    expect(result).toEqual([
      {
        owner_evaluations: [{ review_decision: 'approve' }]
      },
      {
        owner_evaluations: [{ review_decision: 'approve' }]
      }
    ])
  })
})

describe('findWaitingDecisions', () => {
  it('should find waiting decisions from entries', () => {
    const result = findWaitingDecisions(mockEntriesForWaitingDecisions)
    expect(result).toEqual([])
  })
})

describe('normalizeGitFilePath', () => {
  it('should normalize file paths with spaces', () => {
    const result = normalizeGitFilePath('path/with space/file.txt')
    expect(result).toBe('path/with space/file.txt')
  })
})

describe('generateAlphaNumericHash', () => {
  it('should generate an alphanumeric hash of specified length', () => {
    const result = generateAlphaNumericHash(5)
    expect(result).toHaveLength(5)
  })
})

describe('getErrorMessage', () => {
  it('should return an error message from an error object', () => {
    const error = new Error('Test error')
    const result = getErrorMessage(error)
    expect(result).toBe('Test error')
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
