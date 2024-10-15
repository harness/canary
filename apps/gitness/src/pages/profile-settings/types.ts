export interface AlertDeleteParams {
  identifier: string
  type: string
}

export enum ApiErrorType {
  KeyFetch = 'keyFetch',
  TokenFetch = 'tokenFetch',
  KeyCreate = 'keyCreate',
  TokenCreate = 'tokenCreate',
  TokenDelete = 'tokenDelete',
  KeyDelete = 'keyDelete'
}