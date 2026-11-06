// renderHook compatibility helper for @testing-library/react@12 (React 17), which predates the built-in
// renderHook. Renders a headless component that calls the hook and exposes its latest return value.

import { render } from '@testing-library/react'

export function renderHookCompat<P, T>(useHook: (props: P) => T, initialProps: P) {
  const result: { current: T } = { current: undefined as unknown as T }

  const Harness = ({ hookProps }: { hookProps: P }) => {
    result.current = useHook(hookProps)
    return null
  }

  const utils = render(<Harness hookProps={initialProps} />)

  return {
    result,
    rerender: (props: P) => utils.rerender(<Harness hookProps={props} />),
    unmount: utils.unmount
  }
}
