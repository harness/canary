interface DiffViewerSubstituteProps {
  data?: string
}

export const DiffViewerSubstitute = ({ data }: DiffViewerSubstituteProps) => (
  <div
    className="diff-viewer-placeholder"
    style={{
      height: 'var(--block-height)',
      minHeight: '100px',
      overflow: 'hidden'
    }}
  >
    <pre
      style={{
        height: '100%',
        margin: '0',
        padding: '0',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        color: 'transparent',
        background: 'transparent'
      }}
    >
      {data}
    </pre>
  </div>
)
