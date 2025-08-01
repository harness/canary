import { atom } from 'jotai'

import { TypesCheck, TypesDefaultReviewerApprovalsResponse } from '@harnessio/code-service-client'
import { PrincipalInfoWithReviewDecision, PullRequestChangesSectionProps } from '@harnessio/ui/views'

export enum PullReqReviewDecision {
  approved = 'approved',
  changeReq = 'changereq',
  pending = 'pending',
  outdated = 'outdated',
  approve = 'approve'
}

export interface TypeCheckData {
  bypassable: boolean
  required: boolean
  check: TypesCheck
}

export declare type DiffLineParts = {
  prefix: string
  content: string
}
export declare enum LineType {
  INSERT = 'insert',
  DELETE = 'delete',
  CONTEXT = 'context'
}
export interface DiffLineDeleted {
  type: LineType.DELETE
  oldNumber: number
  newNumber: undefined
}
export interface DiffLineInserted {
  type: LineType.INSERT
  oldNumber: undefined
  newNumber: number
}
export interface DiffLineContext {
  type: LineType.CONTEXT
  oldNumber: number
  newNumber: number
}
export declare type DiffLineContent = {
  content: string
}
export declare type DiffLine = (DiffLineDeleted | DiffLineInserted | DiffLineContext) & DiffLineContent

export interface DiffBlock {
  oldStartLine: number
  oldStartLine2?: number
  newStartLine: number
  header: string
  lines: DiffLine[]
}

export interface DiffFileName {
  oldName: string
  newName: string
}
export interface DiffFile extends DiffFileName {
  addedLines: number
  deletedLines: number
  isCombined: boolean
  isGitDiff: boolean
  language: string
  blocks: DiffBlock[]
  oldMode?: string | string[]
  newMode?: string
  deletedFileMode?: string
  newFileMode?: string
  isDeleted?: boolean
  isNew?: boolean
  isCopy?: boolean
  isRename?: boolean
  isBinary?: boolean
  isTooBig?: boolean
  unchangedPercentage?: number
  changedPercentage?: number
  checksumBefore?: string | string[]
  checksumAfter?: string
  mode?: string
  raw?: string
}

export interface DiffFileEntry extends DiffFile {
  fileId: string
  filePath: string
  containerId: string
  contentId: string
  fileViews?: Map<string, string>
}

export const changesInfoAtom = atom<{ path?: string; raw?: string; fileViews?: Map<string, string> }>({})

export interface ApprovalItem {
  id: number
  state?: string
  method: string
  title: string
  items?: ApprovalItems[]
}

export interface ApprovalItems {
  items: ApprovalItem[]
}

export type extractInfoForPRPanelChangesProps = Pick<
  PullRequestChangesSectionProps,
  | 'approvedEvaluations'
  | 'reqNoChangeReq'
  | 'minApproval'
  | 'minReqLatestApproval'
  | 'latestApprovalArr'
  | 'changeReqReviewer'
  | 'changeReqEvaluations'
  | 'defaultReviewersData'
  | 'codeOwnersData'
> & {
  mergeBlockedViaRule?: boolean
}

export interface TypesDefaultReviewerApprovalsResponseWithRevDecision extends TypesDefaultReviewerApprovalsResponse {
  principals?: PrincipalInfoWithReviewDecision[] | null // Override the 'principals' field
}

export enum CodeOwnerReqDecision {
  CHANGEREQ = 'changereq',
  APPROVED = 'approved',
  WAIT_FOR_APPROVAL = ''
}
