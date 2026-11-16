import { useState, useEffect, useCallback, useId, useRef } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ShareIcon from '@mui/icons-material/Share'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import ArticleIcon from '@mui/icons-material/Article'
import DescriptionIcon from '@mui/icons-material/Description'
import VideocamIcon from '@mui/icons-material/Videocam'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { enterIndex } from '../utils/motion'

type MediaType = 'podcast' | 'article' | 'whitepaper' | 'video' | 'book'

interface MediaItem {
    id: number
    title: string
    source: string
    type: MediaType
    url: string
    description: string
    dateAdded: string
    tags: string[]
}

interface ApiMediaItem {
    id: number
    title: string
    source: string
    media_type: MediaType
    url: string
    description: string
    date_added: string
    tags: string[]
}

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const mediaTypeConfig: Record<MediaType, { label: string; icon: React.ReactNode }> = {
    podcast: { label: 'Podcast', icon: <PodcastsIcon aria-hidden="true" sx={{ fontSize: 18 }} /> },
    article: { label: 'Article', icon: <ArticleIcon aria-hidden="true" sx={{ fontSize: 18 }} /> },
    whitepaper: { label: 'Whitepaper', icon: <DescriptionIcon aria-hidden="true" sx={{ fontSize: 18 }} /> },
    video: { label: 'Video', icon: <VideocamIcon aria-hidden="true" sx={{ fontSize: 18 }} /> },
    book: { label: 'Book', icon: <MenuBookIcon aria-hidden="true" sx={{ fontSize: 18 }} /> },
}

function transformApiItem(apiItem: ApiMediaItem): MediaItem {
    return {
        id: apiItem.id,
        title: apiItem.title,
        source: apiItem.source,
        type: apiItem.media_type,
        url: apiItem.url,
        description: apiItem.description,
        dateAdded: apiItem.date_added,
        tags: apiItem.tags || [],
    }
}

const mediaTypes: Array<{ value: MediaType | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'article', label: 'Articles' },
    { value: 'whitepaper', label: 'Whitepapers' },
    { value: 'video', label: 'Videos' },
    { value: 'book', label: 'Books' },
]

const canShare = typeof navigator !== 'undefined' && 'share' in navigator
const FEEDBACK_DURATION_MS = 2000

interface MediaRowProps {
    item: MediaItem
    index: number
}

function MediaRow({ item, index }: MediaRowProps) {
    const [feedback, setFeedback] = useState<'copied' | 'failed' | null>(null)
    const feedbackTimer = useRef<number>()
    const config = mediaTypeConfig[item.type]

    useEffect(() => () => window.clearTimeout(feedbackTimer.current), [])

    const report = (result: 'copied' | 'failed') => {
        // Restart the timer on repeat clicks instead of stacking timeouts.
        window.clearTimeout(feedbackTimer.current)
        setFeedback(result)
        feedbackTimer.current = window.setTimeout(() => setFeedback(null), FEEDBACK_DURATION_MS)
    }

    const handleShare = async () => {
        try {
            if (canShare) {
                await navigator.share({ title: item.title, text: item.description, url: item.url })
            } else {
                await navigator.clipboard.writeText(item.url)
                report('copied')
            }
        } catch (error) {
            // Dismissing the share sheet is not a failure.
            if (error instanceof DOMException && error.name === 'AbortError') return
            console.error('Share failed:', error)
            report('failed')
        }
    }

    const ShareActionIcon = feedback === 'copied' ? CheckIcon : canShare ? ShareIcon : ContentCopyIcon

    return (
        <li
            className="enter grid gap-5 py-7 md:grid-cols-[150px_1fr_auto] md:items-start"
            style={enterIndex(Math.min(index, 8))}
        >
            <p className="flex items-center gap-2 text-sm text-muted">
                {config.icon}
                {config.label}
            </p>
            <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
                    <p className="text-sm text-muted">{item.source}</p>
                </div>
                <p className="apple-copy mt-3 max-w-[70ch]">{item.description}</p>
                {item.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                        {item.tags.slice(0, 4).map((tag) => (
                            <li key={tag} className="rounded-full bg-[var(--hover)] px-3 py-1 text-xs text-body">
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex items-center gap-2 md:justify-end">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link min-h-11 rounded-full px-2"
                >
                    Open
                    <span className="visually-hidden">: {item.title} (opens in a new tab)</span>
                    <OpenInNewIcon aria-hidden="true" sx={{ fontSize: 16 }} />
                </a>
                <button
                    type="button"
                    onClick={handleShare}
                    className="social-link"
                    aria-label={`${canShare ? 'Share' : 'Copy link to'} ${item.title}`}
                >
                    <ShareActionIcon aria-hidden="true" sx={{ fontSize: 18 }} />
                </button>
                {/* Live region sits outside the button so the result is announced reliably. */}
                <span role="status" className={feedback ? 'text-sm text-muted' : 'visually-hidden'}>
                    {feedback === 'copied' && 'Link copied'}
                    {feedback === 'failed' && 'Could not copy'}
                </span>
            </div>
        </li>
    )
}

export default function WeeklyMedia() {
    const searchId = useId()
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const fetchMediaItems = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            if (debouncedSearch) {
                params.append('search', debouncedSearch)
            }
            if (selectedType !== 'all') {
                params.append('media_type', selectedType)
            }

            const queryString = params.toString()
            const url = `${API_BASE_URL}/api/weekly-media/${queryString ? `?${queryString}` : ''}`
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Failed to fetch media items: ${response.statusText}`)
            }

            const data: ApiMediaItem[] = await response.json()
            setMediaItems(data.map(transformApiItem))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
            setError(errorMessage)
            console.error('Error fetching media items:', err)
        } finally {
            setIsLoading(false)
        }
    }, [debouncedSearch, selectedType])

    useEffect(() => {
        fetchMediaItems()
    }, [fetchMediaItems])

    return (
        <div className="apple-page pb-24 pt-14 sm:pt-16">
            <div className="apple-section">
                <header className="enter grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-10">
                    <h1 className="display-heading display-page">A running list of useful things.</h1>
                    <p className="apple-copy max-w-2xl text-xl">
                        Podcasts, articles, whitepapers, videos, and books worth saving for another read.
                    </p>
                </header>

                <search className="enter mt-12 block space-y-5" style={enterIndex(1)}>
                    <div className="relative max-w-2xl">
                        <label htmlFor={searchId} className="visually-hidden">
                            Search media by title, source, or tag
                        </label>
                        <SearchIcon
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                            sx={{ fontSize: 19 }}
                        />
                        <input
                            id={searchId}
                            type="search"
                            placeholder="Search title, source, or tag"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="min-h-12 w-full rounded-full border border-control bg-[var(--surface-strong)] py-3 pl-11 pr-4 text-ink placeholder:text-muted"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
                        {mediaTypes.map((type) => {
                            const isSelected = selectedType === type.value
                            return (
                                <button
                                    key={type.value}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => setSelectedType(type.value)}
                                    className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                                        isSelected
                                            ? 'border-transparent bg-ink text-page'
                                            : 'border-control text-body hover:bg-[var(--hover)] hover:text-ink'
                                    }`}
                                >
                                    {type.label}
                                </button>
                            )
                        })}
                    </div>
                </search>

                <div className="mt-10 flex items-center justify-between gap-4 border-b hairline pb-4 text-sm text-muted">
                    <p>
                        {/* Only the result count is announced; "Loading" is not worth a live update. */}
                        <span role="status">
                            {!isLoading && !error && `${mediaItems.length} ${mediaItems.length === 1 ? 'item' : 'items'}`}
                        </span>
                        {isLoading && 'Loading'}
                    </p>
                    <p>Updated from the Django API</p>
                </div>

                {error && (
                    <div role="alert" className="py-16 text-center">
                        <ErrorOutlineIcon aria-hidden="true" className="text-red-600 dark:text-red-400" sx={{ fontSize: 34 }} />
                        <h2 className="mt-4 text-xl font-semibold">Failed to load content</h2>
                        <p className="apple-copy mt-2">{error}</p>
                        <button type="button" onClick={fetchMediaItems} className="quiet-link mt-6">
                            Try again
                        </button>
                    </div>
                )}

                {isLoading && !error && (
                    <div className="divide-y divide-[var(--hairline)]" aria-hidden="true">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="py-7">
                                <div className="h-4 w-32 animate-pulse rounded-full bg-[var(--hairline)]" />
                                <div className="mt-4 h-6 max-w-xl animate-pulse rounded-full bg-[var(--hairline)]" />
                                <div className="mt-3 h-4 max-w-3xl animate-pulse rounded-full bg-[var(--hairline)]" />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && mediaItems.length > 0 && (
                    <ul className="divide-y divide-[var(--hairline)]">
                        {mediaItems.map((item, index) => (
                            <MediaRow key={item.id} item={item} index={index} />
                        ))}
                    </ul>
                )}

                {!isLoading && !error && mediaItems.length === 0 && (
                    <div className="py-16 text-center">
                        <SearchIcon aria-hidden="true" className="text-muted" sx={{ fontSize: 34 }} />
                        <h2 className="mt-4 text-xl font-semibold">No results found</h2>
                        <p className="apple-copy mt-2">Try a different search term or type.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
