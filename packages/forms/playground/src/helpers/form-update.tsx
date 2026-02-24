import { Button, Layout } from '@harnessio/ui/components'

interface FormUpdateProps {
  values: any
  resetValues?: any
  onUpdate: (values: any) => void
  label?: string
}

export function FormUpdate({ values, onUpdate, label = 'Update values', resetValues = {} }: FormUpdateProps) {
  return (
    <Layout.Vertical gap="sm">
      <Button variant="secondary" onClick={() => onUpdate(resetValues)} className="self-start">
        {label}
      </Button>
      <div className="p-cn-md rounded-cn-3 border">
        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(values, undefined, 2)}</pre>
      </div>
    </Layout.Vertical>
  )
}
