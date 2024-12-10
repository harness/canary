import HarnessStep from '../assets/harness-step.svg'
import RunStep from '../assets/run-step.svg'

export function getIcon(idx: number) {
  return (
    <div style={{ margin: '10px' }}>
      {idx % 2 ? (
        <HarnessStep width="30" height="30" style={{ color: '#00ADE4' }} />
      ) : (
        <RunStep width="30" height="30" style={{ color: '#CCC' }} />
      )}
    </div>
  )
}
