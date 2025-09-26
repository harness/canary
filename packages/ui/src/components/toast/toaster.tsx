import { cn } from '@utils/cn'
import { Toaster as SonnerToaster, type ToasterProps as SonnerToasterProps } from 'sonner'

type ToasterProps = Pick<SonnerToasterProps, 'richColors' | 'position' | 'duration' | 'className'>

export function Toaster({ duration = 5000, className }: ToasterProps) {
  return (
    <SonnerToaster
      richColors={false}
      position="bottom-right"
      duration={duration}
      visibleToasts={3}
      className={cn('cn-toast-wrapper', className)}
      toastOptions={{
        style: {
          background: 'transparent',
          border: 'none',
          padding: 0,
          boxShadow: 'none',
          right: 0,
          height: 'auto',
          overflow: 'hidden'
        }
      }}
    />
  )
}
