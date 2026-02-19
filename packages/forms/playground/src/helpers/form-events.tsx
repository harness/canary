import { Button, Layout } from '@harnessio/ui/components'

interface LogEntry {
  label: string
  log: string
}

interface FormEventsProps {
  logs: LogEntry[]
  onClearLogs: () => void
}

export function FormEvents({ logs, onClearLogs }: FormEventsProps) {
  return (
    <Layout.Vertical gap="sm">
      <Button variant="secondary" onClick={onClearLogs} className="self-start">
        Clear logs
      </Button>
      <div className="p-cn-md rounded-cn-3 border">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={index}>
              <pre className="bg-muted mt-cn-sm text-cn-muted rounded p-2" style={{ fontWeight: 'bold' }}>
                {log.label}
              </pre>
              <pre className="whitespace-pre-wrap text-sm">{log.log}</pre>
            </div>
          ))
        ) : (
          <p className="text-muted">No logs</p>
        )}
      </div>
    </Layout.Vertical>
  )
}
