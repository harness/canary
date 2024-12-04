import { Link } from 'react-router-dom'

import { Button, Spacer, SpotlightsBG, Text } from '@harnessio/canary'

export default function Error() {
  return (
    <SpotlightsBG.Root className="h-screen">
      <SpotlightsBG.Content>
        <Text size={6} weight="bold" align="center">
          Oops, we can&apos;t find it!
        </Text>
        <Spacer size={1} />
        <Text size={3} align="center" className="text-tertiary-background">
          Please check your link and try again.
        </Text>
        <Spacer size={6} />
        <Button asChild variant="default" className="justify-self-center">
          <Link to="/">Home page</Link>
        </Button>
      </SpotlightsBG.Content>
    </SpotlightsBG.Root>
  )
}
