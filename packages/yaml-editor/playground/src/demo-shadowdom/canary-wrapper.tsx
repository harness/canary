import ShadowRootWrapper from './shadow-root-wrapper'

export const CanaryWrapper: React.FC = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <ShadowRootWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>{children}</div>
      </ShadowRootWrapper>
    </div>
  )
}
