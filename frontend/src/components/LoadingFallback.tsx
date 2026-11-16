/**
 * Shown while a lazy-loaded route downloads. The native indeterminate
 * progress element announces the busy state on its own.
 */
export default function LoadingFallback() {
    return (
        <div className="flex min-h-[60dvh] items-center justify-center">
            <progress className="loading-spinner" aria-label="Loading page" />
        </div>
    )
}
