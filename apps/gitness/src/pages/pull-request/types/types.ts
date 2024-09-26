import { TypesCheck } from '@harnessio/code-service-client'

export enum orderSortDate {
  ASC = 'asc',
  DESC = 'desc'
}

export enum PRCommentFilterType {
  SHOW_EVERYTHING = 'showEverything',
  ALL_COMMENTS = 'allComments',
  MY_COMMENTS = 'myComments',
  RESOLVED_COMMENTS = 'resolvedComments',
  UNRESOLVED_COMMENTS = 'unresolvedComments'
}

export enum PullReqReviewDecision {
  approved = 'approved',
  changeReq = 'changereq',
  pending = 'pending',
  outdated = 'outdated'
}
export interface TypeCheckData {
  bypassable: boolean
  required: boolean
  check: TypesCheck
}

export enum PullRequestState {
  OPEN = 'open',
  MERGED = 'merged',
  CLOSED = 'closed'
}

// Define the type for the response data
export interface ResponseData {
  id: number
  text: string
  parent_id?: number
  [key: string]: unknown // Add other fields as necessary
}
export interface CommentData {
  text: string
  parent_id?: number
}
