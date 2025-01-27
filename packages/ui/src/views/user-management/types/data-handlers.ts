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
  handleUpdateUser: (data: IUpdateUserData) => Promise<void>
  handleDeleteUser: (userUid: string) => Promise<void>
  handleUpdateUserAdmin: (userUid: string, isAdmin: boolean) => Promise<void>
  handleUpdatePassword: (userId: string) => Promise<void>
  handleCreateUser: (data: ICreateUserData) => Promise<void>
}
