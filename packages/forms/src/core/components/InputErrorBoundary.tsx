import { Component } from 'react'

interface InputErrorBoundaryProps {
  path: string
  inputType: string
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

  componentDidCatch(error: unknown, info: unknown) {
    console.error(`Form Input [${this.props.inputType}] has failed at path [${this.props.path}].`, error, info)
  }

  render() {
    if (this.state.hasError) {
      // NOTE: consider development mode
      return <></>
    }

    return this.props.children
  }
}
