import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '@utils/cn'
import { cva, VariantProps } from 'class-variance-authority'

const linkVariants = cva(
  'whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-foreground-1 hover:decoration-foreground-1',
        secondary: 'text-foreground-4 hover:decoration-foreground-4',
        accent: 'text-foreground-accent hover:decoration-foreground-accent'
      }
    }
  }
)

export type StyledLinkProps = LinkProps & React.RefAttributes<HTMLAnchorElement> & VariantProps<typeof linkVariants>

export const StyledLink = ({ className, variant = 'default', ...props }: StyledLinkProps) => {
  return <Link className={cn(linkVariants({ variant }), className)} {...props} />
}
