/**
 * Ensure this should come from @harnessio/code-service-client instead
 */
export enum SSEEvent {
  // Execution events
  EXECUTION_UPDATED = 'execution_updated',
  EXECUTION_RUNNING = 'execution_running',
  EXECUTION_COMPLETED = 'execution_completed',
  EXECUTION_CANCELED = 'execution_canceled',

  // Repository import/export events
  REPO_IMPORTED = 'repository_import_completed',
  REPO_EXPORT_COMPLETED = 'repository_export_completed',

  // Pull request events
  PULLREQ_UPDATED = 'pullreq_updated',
  PULLREQ_REVIEWER_ADDED = 'pullreq_reviewer_added',
  PULLREQ_REVIEWER_REMOVED = 'pullreq_reviewer_removed',
  PULLREQ_COMMENT_CREATED = 'pullreq_comment_created',
  PULLREQ_COMMENT_EDITED = 'pullreq_comment_edited',
  PULLREQ_COMMENT_UPDATED = 'pullreq_comment_updated',
  PULLREQ_COMMENT_STATUS_RESOLVED = 'pullreq_comment_status_resolved',
  PULLREQ_COMMENT_STATUS_REACTIVATED = 'pullreq_comment_status_reactivated',
  PULLREQ_OPENED = 'pullreq_opened',
  PULLREQ_CLOSED = 'pullreq_closed',
  PULLREQ_MARKED_AS_DRAFT = 'pullreq_marked_as_draft',
  PULLREQ_READY_FOR_REVIEW = 'pullreq_ready_for_review',

  // Branch events
  BRANCH_MERGABLE_UPDATED = 'branch_mergable_updated',
  BRANCH_CREATED = 'branch_created',
  BRANCH_UPDATED = 'branch_updated',
  BRANCH_DELETED = 'branch_deleted',

  // Tag events
  TAG_CREATED = 'tag_created',
  TAG_UPDATED = 'tag_updated',
  TAG_DELETED = 'tag_deleted',

  // Status events
  STATUS_CHECK_REPORT_UPDATED = 'status_check_report_updated',

  // Log events
  LOG_LINE_APPENDED = 'log_line_appended',

  // Rule events
  RULE_CREATED = 'rule_created',
  RULE_UPDATED = 'rule_updated',
  RULE_DELETED = 'rule_deleted',

  // Webhook events
  WEBHOOK_CREATED = 'webhook_created',
  WEBHOOK_UPDATED = 'webhook_updated',
  WEBHOOK_DELETED = 'webhook_deleted'
}

export interface CreateFormType {
  name: string
  branch: string
  yamlPath: string
}

export enum orderSortDate {
  ASC = 'asc',
  DESC = 'desc'
}

export enum PageResponseHeader {
  xTotal = 'x-total',
  xTotalPages = 'x-total-pages',
  xPerPage = 'x-per-page',
  xNextPage = 'x-next-page',
  xPrevPage = 'x-prev-page'
}
