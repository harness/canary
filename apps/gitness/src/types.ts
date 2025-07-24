/**
 * Ensure this should come from @harnessio/code-service-client instead
 */
export enum SSEEvent {
  EXECUTION_UPDATED = 'execution_updated',
  EXECUTION_COMPLETED = 'execution_completed',
  EXECUTION_CANCELED = 'execution_canceled',
  EXECUTION_RUNNING = 'execution_running',
  PULLREQ_UPDATED = 'pullreq_updated',
  REPO_IMPORTED = 'repository_import_completed'
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
