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
  handleUpdateUser: (data: IUpdateUserData) => Promise<unknown>
  handleDeleteUser: (userUid: string) => Promise<unknown>
  handleUpdateUserAdmin: (userUid: string, isAdmin: boolean) => Promise<unknown>
  handleUpdatePassword: (userId: string) => Promise<unknown>
  handleCreateUser: (data: ICreateUserData) => Promise<unknown>
}
