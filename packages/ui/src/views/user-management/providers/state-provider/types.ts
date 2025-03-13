import { PropsWithChildren } from 'react'

export interface ILoadingStates {
  isFetchingUsers: boolean
  isUpdatingUser: boolean
  isDeletingUser: boolean
  isUpdatingUserAdmin: boolean
  isCreatingUser: boolean
}

export interface IErrorStates {
  fetchUsersError: string
  updateUserError: string
  deleteUserError: string
  updateUserAdminError: string
  createUserError: string
}

export interface StateContextType {
  loadingStates: ILoadingStates
  errorStates: IErrorStates
}

export interface StateProviderProps extends PropsWithChildren<StateContextType> {}
