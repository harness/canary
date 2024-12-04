import { useLocation, useNavigate } from 'react-router-dom'

import { Button, Spacer, SpotlightsBG, Text } from '@harnessio/canary'

export default function WIP() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <SpotlightsBG.Root className="h-screen w-screen">
      <SpotlightsBG.Content>
        <Text size={6} weight="medium" align="center">
          Work in progress
        </Text>
        <Spacer size={1} />
        <Text size={3} align="center" className="text-tertiary-background">
          We&apos;re working on {location.pathname || 'this page.'}
        </Text>
        <Spacer size={6} />
        <Button variant="default" className="justify-self-center" onClick={handleGoBack}>
          Go back
        </Button>
      </SpotlightsBG.Content>
    </SpotlightsBG.Root>
  )
}
