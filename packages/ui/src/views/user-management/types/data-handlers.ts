/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUpdateUserData {
  email: string
  displayName: string
  userID: string
}

export interface ICreateUserData {
  uid: string
  email: string
  display_name: string
}

export interface IDataHandlers {
  handleUpdateUser: (data: IUpdateUserData) => Promise<any>
  handleDeleteUser: (userUid: string) => Promise<any>
  handleUpdateUserAdmin: (userUid: string, isAdmin: boolean) => Promise<any>
  handleUpdatePassword: (userId: string) => Promise<any>
  handleCreateUser: (data: ICreateUserData) => Promise<any>
}
