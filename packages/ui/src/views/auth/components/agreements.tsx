import { Link, Text } from '@/components'

export function Agreements() {
  return (
    <Text className="relative z-10 mt-auto" variant="caption-soft" as="span" align="center" color="foreground-3">
      By joining, you agree to{' '}
      <Link size="sm" variant="secondary" to="https://harness.io/subscriptionterms">
        Terms of Service
      </Link>{' '}
      and&nbsp;
      <Link size="sm" variant="secondary" to="https://harness.io/privacy">
        Privacy Policy
      </Link>
    </Text>
  )
}
