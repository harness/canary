import { cn } from '@utils/cn'
import { Toaster, type ToasterProps } from 'sonner'

type ToasterV2Props = Pick<ToasterProps, 'richColors' | 'position' | 'duration' | 'className'>

export function ToasterV2({
  richColors = false,
  position = 'bottom-right',
  duration = 5000,
  className
}: ToasterV2Props) {
  return (
    <Toaster
      richColors={richColors}
      position={position}
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
