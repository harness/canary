import { Button, Icon, Text } from '@components/index'

interface LabelsListProps {
  labels?: { key?: string; id?: number; color?: string }[]
  handleDelete?: (id: number) => void
  addLabelError?: string
  removeLabelError?: string
}

const LabelsList: React.FC<LabelsListProps> = ({ labels, handleDelete, addLabelError, removeLabelError }) => (
  <div className="flex flex-col gap-3">
    {addLabelError || removeLabelError ? (
      <Text size={1} className="text-destructive">
        {addLabelError ?? removeLabelError}
      </Text>
    ) : (
      <></>
    )}
    {labels?.length ? (
      labels?.map(({ key, id, color }) => (
        <div key={id} className="mr-1 flex items-center space-x-2">
          <div className="outline outline-1 p-0.5" style={{ outlineColor: color }}>
            <span className="px-1" style={{ color: color }}>
              {key}
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                handleDelete?.(id ?? 0)
              }}
            >
              <Icon name="close" size={12} className="text-tertiary-background" />
            </Button>
          </div>
        </div>
      ))
    ) : (
      <Text size={2} weight="medium" color="foreground-5">
        No labels
      </Text>
    )}
  </div>
)

export { LabelsList }
