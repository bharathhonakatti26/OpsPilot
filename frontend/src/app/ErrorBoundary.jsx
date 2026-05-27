import { Component } from 'react'
import { env } from '../utils/env.js'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error(`${env.appName} UI error`, error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We could not render this view. Please refresh the page.</p>
          <button className="btn btn-secondary" onClick={() => location.reload()}>
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
