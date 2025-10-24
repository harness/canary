export const afterFrames = (cb: () => void, frames = 2) => {
  let cancelled = false
  const step = () => {
    requestAnimationFrame(() => {
      if (cancelled) return
      frames -= 1
      frames <= 0 ? cb() : step()
    })
  }
  step()
  return () => {
    cancelled = true
  }
}
