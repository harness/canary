import { Toaster, type ToasterProps } from 'sonner'

type ToasterV2Props = Pick<ToasterProps, 'richColors' | 'position' | 'duration'>

export function ToasterV2({ richColors = false, position = 'bottom-right', duration = 5000 }: ToasterV2Props) {
  return (
    <Toaster
      richColors={richColors}
      position={position}
      duration={duration}
      visibleToasts={3}
      className="cn-toast-wrapper"
      // offset={{ right: 0, bottom: 0 }}
      //   Toast styles will be applied through design system
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
