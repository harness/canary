import { DiffModeEnum } from '@git-diff-view/react'
import { atom } from 'jotai'
import { z } from 'zod'

import {
  EnumPullReqReviewDecision,
  ReviewerListPullReqOkResponse,
  TypesCheck,
  TypesPullReq,
  TypesPullReqActivity,
  TypesUser
} from '@harnessio/code-service-client'

export enum orderSortDate {
  ASC = 'asc',
  DESC = 'desc'
}

export enum CodeCommentState {
  ACTIVE = 'active',
  RESOLVED = 'resolved'
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
  outdated = 'outdated',
  approve = 'approve'
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

export interface DiffFileEntry extends DiffFile {
  fileId: string
  filePath: string
  containerId: string
  contentId: string
  fileViews?: Map<string, string>
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

export interface DiffBlock {
  oldStartLine: number
  oldStartLine2?: number
  newStartLine: number
  header: string
  lines: DiffLine[]
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

export interface DiffViewerExchangeState {
  collapsed?: boolean
  useFullDiff?: boolean
  fullDiff?: DiffFileEntry
  comments?: Map<number, CommentRestorationTrackingState>
  commentsVisibilityAtLineNumber?: Map<number, boolean>
}
export interface CommentRestorationTrackingState extends DiffCommentItem<TypesPullReqActivity> {
  uncommittedText?: string
  showReplyPlaceHolder?: boolean
  uncommittedEditComments?: Map<number, string>
}
export interface DiffCommentItem<T = unknown> {
  inner: T
  left: boolean
  right: boolean
  lineNumberStart: number
  lineNumberEnd: number
  span: number
  commentItems: CommentItem<T>[]
  _commentItems?: CommentItem<T>[]
  filePath: string
  codeBlockContent?: string
  destroy: (() => void) | undefined
}
export interface CommentItem<T = unknown> {
  id: number
  author: string
  created: string | number
  edited: string | number
  updated: string | number
  deleted: string | number
  outdated: boolean
  content: string
  payload?: T // optional payload for callers to handle on callback calls
}

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

export type ButtonEnum = 'success' | 'muted' | 'default' | 'error' | 'warning' | null | undefined
export interface FilterViewProps {
  active?: string
  currentUser: TypesUser
  pullRequestMetadata?: TypesPullReq | undefined
  reviewers?: ReviewerListPullReqOkResponse
  submitReview?: (decision: PullReqReviewDecision) => void
  refetchReviewers?: () => void
  loading?: boolean
  diffMode: DiffModeEnum
  setDiffMode: (value: DiffModeEnum) => void
}

export type EnumPullReqReviewDecisionExtended = EnumPullReqReviewDecision | 'outdated'

export const formSchema = z.object({
  title: z.string().min(1, { message: 'Please provide a pull request title' }),
  description: z.string().optional()
})
export type FormFields = z.infer<typeof formSchema> // Automatically generate a type from the schema
export const changesInfoAtom = atom<{ path?: string; raw?: string; fileViews?: Map<string, string> }>({})

export interface TypesDiffStats {
  additions?: number | null
  commits?: number | null
  deletions?: number | null
  files_changed?: number | null
}
