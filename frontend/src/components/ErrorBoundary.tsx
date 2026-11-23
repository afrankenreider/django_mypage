import { Component, ErrorInfo, ReactNode } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

/**
 * Error boundary component to catch and handle rendering errors gracefully.
 * Particularly useful for interactive chart components that may fail due to
 * invalid data or edge cases.
 */
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null })
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div role="alert" className="flex flex-col items-center justify-center p-8 bg-well rounded-2xl border border-line">
                    <div className="w-16 h-16 bg-negative/12 rounded-full flex items-center justify-center mb-4">
                        <ErrorOutlineIcon aria-hidden="true" className="text-negative" sx={{ fontSize: 32 }} />
                    </div>
                    <h2 className="text-lg font-semibold text-ink mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-muted text-center mb-4 max-w-md">
                        An error occurred while rendering this component. Please try refreshing.
                    </p>
                    {this.state.error && (
                        <details className="mb-4 w-full max-w-md">
                            <summary className="text-sm text-muted cursor-pointer hover:text-ink">
                                View error details
                            </summary>
                            <pre className="mt-2 p-3 bg-well rounded-lg text-xs text-muted overflow-x-auto">
                                {this.state.error.message}
                            </pre>
                        </details>
                    )}
                    <button
                        type="button"
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-signal text-signal-ink rounded-lg font-medium hover:bg-signal-hover transition-colors"
                    >
                        <RefreshIcon aria-hidden="true" sx={{ fontSize: 18 }} />
                        Try again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
