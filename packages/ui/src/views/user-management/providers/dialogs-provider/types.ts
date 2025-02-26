import { DialogLabels } from '@/views/user-management/components/dialogs'

export type DialogState = {
  [K in DialogLabels]: boolean
}

export interface DialogsContextType {
  dialogsOpenState: DialogState
  openDialog: (dialogType: DialogLabels) => void
  closeDialog: (dialogType: DialogLabels) => void
}
