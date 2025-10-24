import { useEffect } from 'react'

export function useEventListener<K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
  element: HTMLElement = window as unknown as HTMLElement,
  options?: boolean | AddEventListenerOptions,
  parametersCheck = () => true
) {
  useEffect(() => {
    if (parametersCheck() && element) {
      element.addEventListener(type, listener, options)
      return () => {
        element.removeEventListener(type, listener)
      }
    }
  }, [element, type, listener, options, parametersCheck])
}

export function useCustomEventListener<T>(
  name: string,
  listener: (event: Omit<CustomEvent, 'detail'> & { detail: T }) => void,
  parametersCheck = () => true
) {
  useEventListener(
    name as keyof HTMLElementEventMap,
    listener as (event: Event) => void,
    window as unknown as HTMLElement,
    false,
    parametersCheck
  )
}

export function dispatchCustomEvent<T>(name: string, detail: T) {
  window.dispatchEvent(new CustomEvent(name, { detail }))
}
