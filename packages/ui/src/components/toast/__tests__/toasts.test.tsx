import React from 'react'

import { vi } from 'vitest'

import { toast } from '../toasts'

const { customMock, dismissMock } = vi.hoisted(() => ({
  customMock: vi.fn(),
  dismissMock: vi.fn()
}))

vi.mock('sonner', () => ({
  toast: {
    custom: customMock,
    dismiss: dismissMock
  }
}))

vi.mock('../custom-toast', () => ({
  CustomToast: (props: any) => {
    return <span data-testid="mock-custom-toast" {...props} />
  }
}))

const invokeRenderWithId = (id: string) => {
  const [renderFn] = customMock.mock.calls.at(-1)!
  const element = renderFn(id)
  return (element as React.ReactElement).props
}

describe('toast helpers', () => {
  beforeEach(() => {
    customMock.mockReset()
    dismissMock.mockReset()
  })

  it('creates a default toast with provided options', () => {
    toast({ title: 'Saved', description: 'All changes saved', options: { duration: 5000, dismissible: false } })

    expect(customMock).toHaveBeenCalledTimes(1)
    const [, config] = customMock.mock.calls[0]
    expect(config).toEqual({ duration: 5000, dismissible: false })

    const props = invokeRenderWithId('toast-1')
    expect(props).toMatchObject({
      toastId: 'toast-1',
      title: 'Saved',
      description: 'All changes saved',
      closeButton: false
    })

    props.onClose()
    expect(dismissMock).toHaveBeenCalledWith('toast-1')

    customMock.mockClear()
    dismissMock.mockClear()

    toast({ title: 'Saved', description: 'All changes saved' })

    const [, defaultConfig] = customMock.mock.calls[0]
    expect(defaultConfig).toEqual({ duration: 10000, dismissible: true })

    const defaultProps = invokeRenderWithId('toast-default')
    expect(defaultProps).toMatchObject({
      toastId: 'toast-default',
      title: 'Saved',
      description: 'All changes saved'
    })

    defaultProps.onClose()
    expect(dismissMock).toHaveBeenCalledWith('toast-default')
  })

  it.each`
    helper           | variant
    ${toast.info}    | ${'info'}
    ${toast.success} | ${'success'}
    ${toast.danger}  | ${'danger'}
  `('creates $variant toast with default behaviour', ({ helper, variant }) => {
    helper({ title: 'Notice', description: 'Something happened' })

    const [, defaultConfig] = customMock.mock.calls.at(-1)!
    expect(defaultConfig).toEqual({ duration: 10000, dismissible: true })

    const defaultProps = invokeRenderWithId('toast-default-variant')
    expect(defaultProps).toMatchObject({
      toastId: 'toast-default-variant',
      title: 'Notice',
      description: 'Something happened',
      variant
    })
    defaultProps.onClose()
    expect(dismissMock).toHaveBeenCalledWith('toast-default-variant')

    customMock.mockClear()
    dismissMock.mockClear()

    helper({
      title: 'Notice',
      description: 'Something happened',
      options: { duration: 2000, dismissible: false }
    })

    const [, customConfig] = customMock.mock.calls.at(-1)!
    expect(customConfig).toEqual({ duration: 2000, dismissible: false })

    const props = invokeRenderWithId('toast-variant')
    expect(props).toMatchObject({
      toastId: 'toast-variant',
      title: 'Notice',
      description: 'Something happened',
      variant,
      closeButton: false
    })

    props.onClose()
    expect(dismissMock).toHaveBeenCalledWith('toast-variant')
  })

  it('creates a loading toast that is not dismissible', () => {
    toast.loading({ title: 'Processing' })

    const [, config] = customMock.mock.calls.at(-1)!
    expect(config).toEqual({ duration: Number.POSITIVE_INFINITY, dismissible: false })

    const props = invokeRenderWithId('loading-toast')
    expect(props).toMatchObject({
      toastId: 'loading-toast',
      title: 'Processing',
      closeButton: false,
      variant: 'loading'
    })

    props.onClose()
    expect(dismissMock).toHaveBeenCalledWith('loading-toast')
  })

  it('creates a promise toast with provided messages and options', () => {
    const promise = Promise.resolve()
    toast.promise(promise, {
      loadingMessage: 'Sending',
      successMessage: 'Success',
      errorMessage: 'Failure'
    })

    const [, defaultConfig] = customMock.mock.calls.at(-1)!
    expect(defaultConfig).toEqual({ dismissible: true, duration: Number.POSITIVE_INFINITY })

    const defaultProps = invokeRenderWithId('promise-default')
    expect(defaultProps).toMatchObject({
      toastId: 'promise-default',
      title: 'Sending',
      variant: 'loading',
      promise,
      successMessage: 'Success',
      errorMessage: 'Failure'
    })
    defaultProps.onClose()
    expect(dismissMock).toHaveBeenCalledWith('promise-default')

    customMock.mockClear()
    dismissMock.mockClear()

    toast.promise(promise, {
      loadingMessage: 'Sending',
      successMessage: 'Success',
      errorMessage: 'Failure',
      options: { dismissible: false }
    })

    const [, config] = customMock.mock.calls.at(-1)!
    expect(config).toEqual({ dismissible: false, duration: Number.POSITIVE_INFINITY })

    const props = invokeRenderWithId('promise-toast')
    expect(props).toMatchObject({
      toastId: 'promise-toast',
      title: 'Sending',
      closeButton: false,
      variant: 'loading',
      promise,
      successMessage: 'Success',
      errorMessage: 'Failure'
    })

    props.onClose()
    expect(dismissMock).toHaveBeenCalledWith('promise-toast')
  })

  it('exposes dismiss helper from sonner', () => {
    toast.dismiss('external-id')
    expect(dismissMock).toHaveBeenCalledWith('external-id')
  })
})
