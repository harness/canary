export function CanvasButton(props: React.PropsWithChildren<{ onClick: () => void }>) {
  const { children, onClick } = props

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded border bg-muted text-primary"
    >
      {children}
    </div>
  )
}
