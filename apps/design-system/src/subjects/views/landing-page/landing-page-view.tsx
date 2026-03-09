import { Link, useNavigate } from 'react-router-dom'

import { LandingPageView } from '@harnessio/views'

export const LandingPagePreview = () => {
  const navigate = useNavigate()
  return (
    <LandingPageView spaces={[]} getProjectPath={() => ''} toCreateProject={() => ''} navigate={navigate} Link={Link} />
  )
}
