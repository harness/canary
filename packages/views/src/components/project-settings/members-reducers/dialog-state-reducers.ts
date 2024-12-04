import { upperFirst } from 'lodash-es'

import { DialogState, ProjectDialogAction } from '../interfaces'

export const initialDialogState: DialogState = {
  isDialogEditOpen: false,
  isDialogDeleteOpen: false,
  editMember: null,
  deleteMember: null,
  isSubmitting: false,
  submitted: false,
  isDeleting: false,
  deleteSuccess: false
}

export function dialogStateReducer(state: DialogState, action: ProjectDialogAction): DialogState {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return {
        ...state,
        [`isDialog${upperFirst(action.dialogType)}Open`]: true,
        editMember: action.member,
        deleteMember: action.member
      }
    case 'CLOSE_DIALOG':
      return { ...state, [`isDialog${upperFirst(action.dialogType)}Open`]: false, submitted: false }
    case 'START_SUBMITTING':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, submitted: true }
    case 'RESET_SUBMIT':
      return { ...state, submitted: false }
    case 'START_DELETING':
      return { ...state, isDeleting: true }
    case 'DELETE_SUCCESS':
      return { ...state, isDeleting: false, deleteSuccess: true }
    case 'RESET_DELETE':
      return { ...state, deleteSuccess: false }
    default:
      return state
  }
}
