import { ChangeEvent, FC, useState } from 'react'

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  IconProps,
  Spacer,
  Text,
  Textarea
} from '@/components'

interface DetailItem {
  id: string
  iconName: 'tube-sign' | 'open-pr' | 'tag' | 'branch' | IconProps['name']
  name: string
  count: number
}

interface SummaryPanelProps {
  title: string
  details: DetailItem[]
  timestamp?: string
  description?: string
  onChangeDescription?: () => void
  isEditingDescription?: boolean
  setIsEditingDescription: (value: boolean) => void
  saveDescription: (description: string) => void
}

const SummaryPanel: FC<SummaryPanelProps> = ({
  title,
  details,
  timestamp,
  description,
  onChangeDescription,
  isEditingDescription,
  setIsEditingDescription,
  saveDescription
}) => {
  const [newDesc, setNewDesc] = useState(description)
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <Text size={4} weight={'medium'} truncate>
          {title}
        </Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm_icon">
              <Icon name="ellipsis" size={12} className="text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-1.5" onClick={onChangeDescription}>
              <Icon name="plus" size={12} className="text-tertiary-background" />
              <Text>{description?.length ? 'Edit Description' : 'Add description'}</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Spacer size={2} />
      {description?.length && !isEditingDescription ? <Text className="line-clamp-3">{description}</Text> : <></>}
      {isEditingDescription && (
        <div>
          <Textarea
            defaultValue={description}
            className="text-primary h-28"
            value={newDesc}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setNewDesc(e?.target?.value)
            }}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              onClick={() => setIsEditingDescription(false)}
              className="text-primary"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                saveDescription(newDesc || '')
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
      <Spacer size={2} />
      {timestamp && (
        <Text size={1} color={'tertiaryBackground'}>
          Created {timestamp}
        </Text>
      )}
      <Spacer size={5} />
      <div className="flex flex-col gap-3">
        {details &&
          details.map(item => (
            <div key={item.id} className="flex items-center gap-1.5">
              <Icon name={item.iconName} size={14} className="text-tertiary-background" />
              <Text>{item.name}</Text>
              <Badge variant="outline" size="sm">
                {item.count}
              </Badge>
            </div>
          ))}
      </div>
    </div>
  )
}

export default SummaryPanel
