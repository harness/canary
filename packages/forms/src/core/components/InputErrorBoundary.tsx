import { Component, ErrorInfo } from 'react'

interface InputErrorBoundaryProps {
  path: string
  inputType: string
  inputErrorHandler?: (error: Error) => void
  children: React.ReactNode
}

interface InputErrorBoundaryState {
  hasError: boolean
}

export class InputErrorBoundary extends Component<InputErrorBoundaryProps, InputErrorBoundaryState> {
  state: InputErrorBoundaryState = {
    hasError: false
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err: Error, errorInfo: ErrorInfo) {
    console.error(err, errorInfo)
    const error = new Error(
      `Form input [${this.props.inputType}] has failed at path [${this.props.path}]. Error: ${err}, Error info: ${errorInfo}`
    )
    this.props.inputErrorHandler?.(error)
  }

  render() {
    if (this.state.hasError) {
      // NOTE: consider development mode
      return <></>
    }

    return this.props.children
  }
}
