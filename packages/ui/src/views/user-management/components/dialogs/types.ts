import { IDataHandlers } from '@/views/user-management/types/data-handlers'

export enum DialogLabels {
  DELETE_USER = 'deleteUser',
  EDIT_USER = 'editUser',
  TOGGLE_ADMIN = 'toggleAdmin',
  RESET_PASSWORD = 'resetPassword',
  CREATE_USER = 'createUser'
}

export interface IDialogsProps {
  handlers: IDataHandlers
}
