import { Link } from '@/components'

export function Agreements() {
  return (
    <span className="relative z-10 mt-auto text-center text-1 leading-tight text-cn-foreground-3">
      By joining, you agree to{' '}
      <Link size="sm" variant="secondary" to="https://harness.io/subscriptionterms">
        Terms of Service
      </Link>{' '}
      and&nbsp;
      <Link size="sm" variant="secondary" to="https://harness.io/privacy">
        Privacy Policy
      </Link>
    </span>
  )
}
