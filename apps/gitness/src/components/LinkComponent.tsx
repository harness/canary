import { Link } from 'react-router-dom'

import { TLinkComponent } from '@harnessio/ui/views'

export const LinkComponent: TLinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to}>{children}</Link>
)
