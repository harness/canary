import { upperFirst } from 'lodash-es'
import { DialogState, DialogAction } from '../interfaces'

export const initialDialogState: DialogState = {
  isDialogDeleteOpen: false,
  isDialogEditOpen: false,
  isDialogRemoveAdminOpen: false,
  isDialogSetAdminOpen: false,
  isDialogResetPasswordOpen: false,
  isDeleting: false,
  deleteSuccess: false,
  isSubmitting: false,
  submitted: false,
  isRemoving: false,
  removeSuccess: false,
  isResetting: false,
  resetSuccess: false,
  submitSuccess: false,
  selectedUser: null
}

export function dialogStateReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return {
        ...state,
        [`isDialog${upperFirst(action.dialogType)}Open`]: true,
        selectedUser: action.user
      }
    case 'CLOSE_DIALOG':
      return {
        ...state,
        [`isDialog${upperFirst(action.dialogType)}Open`]: false
      }
    case 'START_DELETING':
      return { ...state, isDeleting: true }
    case 'DELETE_SUCCESS':
      return { ...state, isDeleting: false, deleteSuccess: true }
    case 'RESET_DELETE':
      return { ...state, deleteSuccess: false }

    case 'START_SUBMITTING':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, submitted: true }
    case 'RESET_SUBMIT':
      return { ...state, submitted: false }

    case 'START_REMOVING':
      return { ...state, isRemoving: true }
    case 'REMOVE_SUCCESS':
      return { ...state, isRemoving: false, removeSuccess: true }
    case 'RESET_REMOVE':
      return { ...state, removeSuccess: false }

    case 'START_RESETTING':
      return { ...state, isResetting: true }
    case 'RESET_PASSWORD_SUCCESS':
      return { ...state, isResetting: false, resetSuccess: true }
    case 'RESET_PASSWORD_RESET':
      return { ...state, resetSuccess: false }
    default:
      return state
  }
}
