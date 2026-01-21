import { Component } from 'react'

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

  componentDidCatch() {
    const error = new Error(`Form input [${this.props.inputType}] has failed at path [${this.props.path}].`)
    this.props.inputErrorHandler ? this.props.inputErrorHandler(error) : console.error(error)
  }

  render() {
    if (this.state.hasError) {
      // NOTE: consider development mode
      return <></>
    }

    return this.props.children
  }
}
