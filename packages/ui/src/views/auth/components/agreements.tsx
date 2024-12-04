import { Link } from 'react-router-dom'

import { Text } from '@/components'

export function Agreements() {
  return (
    <Text className="relative z-10 mt-auto leading-tight" size={0} color="foreground-5" align="center">
      By joining, you agree to{' '}
      <Link
        className="whitespace-nowrap text-foreground-1 underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-foreground-1"
        to="/"
      >
        Terms of Service
      </Link>{' '}
      and&nbsp;
      <Link
        className="whitespace-nowrap text-foreground-1 underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-foreground-1"
        to="/"
      >
        Privacy Policy
      </Link>
    </Text>
  )
}
