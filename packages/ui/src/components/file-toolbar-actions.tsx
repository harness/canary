import { FC } from 'react'

import { ButtonGroup, ButtonGroupButtonProps, IconV2, useCopyButton } from '@/components'

export interface FileToolbarActionsProps {
  onDownloadClick: () => void
  onEditClick: () => void
  copyContent: string
  showEdit?: boolean
  additionalButtonsProps?: ButtonGroupButtonProps[]
}

export const FileToolbarActions: FC<FileToolbarActionsProps> = ({
  onDownloadClick,
  onEditClick,
  copyContent,
  showEdit = false,
  additionalButtonsProps = []
}) => {
  const { copyButtonProps, CopyIcon } = useCopyButton({ copyData: copyContent })
  return (
    <ButtonGroup
      size="sm"
      iconOnly
      buttonsProps={[
        {
          ...(copyButtonProps as ButtonGroupButtonProps),
          children: CopyIcon
        },
        ...(showEdit
          ? [
              {
                children: <IconV2 name="edit-pencil" />,
                'aria-label': 'Edit',
                onClick: onEditClick,
                tooltipProps: {
                  content: 'Edit'
                }
              }
            ]
          : []),
        {
          children: <IconV2 name="download" />,
          'aria-label': 'Download',
          onClick: onDownloadClick,
          tooltipProps: {
            content: 'Download'
          }
        },
        ...additionalButtonsProps
      ]}
    />
  )
}
