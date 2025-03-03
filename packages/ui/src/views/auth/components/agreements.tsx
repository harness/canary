import { Text } from '@/components'
import { useRouterContext } from '@/context'

export function Agreements() {
  const { Link } = useRouterContext()
  return (
    <Text className="relative z-10 mt-auto leading-tight" size={0} color="foreground-5" align="center">
      By joining, you agree to{' '}
      <Link
        className="whitespace-nowrap text-foreground-1 underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-foreground-1"
        to="https://harness.io/privacy"
      >
        Terms of Service
      </Link>{' '}
      and&nbsp;
      <Link
        className="whitespace-nowrap text-foreground-1 underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:decoration-foreground-1"
        to="https://harness.io/subscriptionterms"
      >
        Privacy Policy
      </Link>
    </Text>
  )
}
