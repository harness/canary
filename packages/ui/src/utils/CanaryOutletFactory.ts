export enum CanaryOutletName {
  BUTTON_SPINNER = 1,
  SPLIT_ICON = 2
}

type Nullable<T> = T | null | undefined
type Renderer<V> = (value: V, extra?: ExtraValue) => React.ReactNode
type ExtraValue = any // eslint-disable-line @typescript-eslint/no-explicit-any

export type CanaryOutletRenderer = Renderer<Nullable<ExtraValue>>

/**
 * This factory is used to register and retrieve outlets for the Canary components which require runtime customizations. It provides a flexible
 * mechanism to add custom content to the components without changing too much of the existing code or adding cross-dependency.
 *
 * Important Notes:
 *  (1) This factory, and its outlet place-holders must not effect anything in Canary components by default. The default behavior of
 *      an outlet is to render nothing.
 *
 *  (2) When implementing a renderer for an outlet, make sure you check all the condition for the outlet to
 *      be rendered, or not. Only render the outlet if all the conditions are met, or not render it at all.
 */
export class CanaryOutletFactory {
  static #outlets = {} as Record<CanaryOutletName, CanaryOutletRenderer>

  static registerOutlet<T>(location: CanaryOutletName, renderer: Renderer<T>): void {
    if (CanaryOutletFactory.#outlets[location]) {
      console.warn('CanaryOutletFactory: Outlet overriden for location', location) // eslint-disable-line no-console
    }
    CanaryOutletFactory.#outlets[location] = renderer
  }

  static getOutlet<T>(location: CanaryOutletName, value: T, extra?: ExtraValue): React.ReactNode {
    try {
      return CanaryOutletFactory.#outlets[location]?.(value, extra)
    } catch (e) {
      console.error('CanaryOutletFactory: Failed to render outlet', e) // eslint-disable-line no-console
    }
  }
}
