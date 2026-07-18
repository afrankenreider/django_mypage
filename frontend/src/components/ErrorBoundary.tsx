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
                <div className="flex flex-col items-center justify-center p-8 bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e]">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 32 }} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-center mb-4 max-w-md">
                        An error occurred while rendering this component. Please try refreshing.
                    </p>
                    {this.state.error && (
                        <details className="mb-4 w-full max-w-md">
                            <summary className="text-sm text-[#86868b] dark:text-[#a1a1a6] cursor-pointer hover:text-[#424245] dark:hover:text-[#d2d2d7]">
                                View error details
                            </summary>
                            <pre className="mt-2 p-3 bg-[#e8e8ed] dark:bg-[#2c2c2e] rounded-lg text-xs text-[#6e6e73] dark:text-[#a1a1a6] overflow-x-auto">
                                {this.state.error.message}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={this.handleReset}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-lg font-medium hover:bg-[#2c2c2e] dark:hover:bg-[#e8e8ed] transition-colors"
                    >
                        <RefreshIcon sx={{ fontSize: 18 }} />
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
