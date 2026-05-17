import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    podcast: { label: 'Podcast', icon: <PodcastsIcon sx={{ fontSize: 18 }} /> },
    article: { label: 'Article', icon: <ArticleIcon sx={{ fontSize: 18 }} /> },
    whitepaper: { label: 'Whitepaper', icon: <DescriptionIcon sx={{ fontSize: 18 }} /> },
    video: { label: 'Video', icon: <VideocamIcon sx={{ fontSize: 18 }} /> },
    book: { label: 'Book', icon: <MenuBookIcon sx={{ fontSize: 18 }} /> },
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

interface MediaRowProps {
    item: MediaItem
    index: number
}

function MediaRow({ item, index }: MediaRowProps) {
    const [copied, setCopied] = useState(false)
    const config = mediaTypeConfig[item.type]

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: item.title, text: item.description, url: item.url })
            } else {
                await navigator.clipboard.writeText(item.url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch (error) {
            console.error('Share failed:', error)
        }
    }

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: index * 0.03, duration: 0.35 }}
            className="grid gap-5 py-7 md:grid-cols-[150px_1fr_auto] md:items-start"
        >
            <div className="flex items-center gap-2 text-sm text-[#86868b]">
                {config.icon}
                <span>{config.label}</span>
            </div>
            <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
                    <span className="text-sm text-[#86868b]">{item.source}</span>
                </div>
                <p className="apple-copy mt-3 max-w-3xl">{item.description}</p>
                {item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded-full bg-black/5 px-3 py-1 text-xs text-[#6e6e73] dark:bg-white/10 dark:text-[#a1a1a6]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 md:justify-end">
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link rounded-full px-2 py-2"
                >
                    Open
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                </a>
                <button
                    onClick={handleShare}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border hairline text-[#6e6e73] transition-colors hover:bg-white hover:text-[#1d1d1f] dark:text-[#a1a1a6] dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="Share"
                >
                    {copied ? <CheckIcon sx={{ fontSize: 18 }} /> : 'share' in navigator ? <ShareIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 18 }} />}
                </button>
            </div>
        </motion.article>
    )
}

export default function WeeklyMedia() {
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

    const mediaTypes: Array<{ value: MediaType | 'all'; label: string }> = [
        { value: 'all', label: 'All' },
        { value: 'podcast', label: 'Podcasts' },
        { value: 'article', label: 'Articles' },
        { value: 'whitepaper', label: 'Whitepapers' },
        { value: 'video', label: 'Videos' },
        { value: 'book', label: 'Books' },
    ]

    return (
        <section className="apple-page pt-28 pb-24">
            <div className="apple-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
                >
                    <div>
                        <p className="eyebrow mb-6">Weekly media</p>
                        <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">
                            A running list of useful things.
                        </h1>
                    </div>
                    <p className="apple-copy max-w-2xl text-xl">
                        Podcasts, articles, whitepapers, videos, and books worth saving for another read.
                    </p>
                </motion.div>

                <div className="mt-14 space-y-5">
                    <div className="relative max-w-2xl">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" sx={{ fontSize: 19 }} />
                        <input
                            type="text"
                            placeholder="Search title, source, or tag"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full border hairline bg-white/70 py-3 pl-11 pr-4 text-[#1d1d1f] outline-none transition-colors placeholder:text-[#86868b] focus:bg-white dark:bg-white/10 dark:text-white dark:focus:bg-white/15"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {mediaTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setSelectedType(type.value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    selectedType === type.value
                                        ? 'bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]'
                                        : 'border hairline text-[#6e6e73] hover:bg-white hover:text-[#1d1d1f] dark:text-[#a1a1a6] dark:hover:bg-white/10 dark:hover:text-white'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between border-b hairline pb-4 text-sm text-[#86868b]">
                    <span>{isLoading ? 'Loading' : `${mediaItems.length} items`}</span>
                    <span>Updated from the Django API</span>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                        <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 34 }} />
                        <h3 className="mt-4 text-xl font-semibold">Failed to load content</h3>
                        <p className="apple-copy mt-2">{error}</p>
                        <button onClick={fetchMediaItems} className="quiet-link mt-6">
                            Try again
                        </button>
                    </motion.div>
                )}

                {isLoading && !error && (
                    <div className="divide-y divide-black/10 dark:divide-white/10">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="py-7">
                                <div className="h-4 w-32 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
                                <div className="mt-4 h-6 max-w-xl animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
                                <div className="mt-3 h-4 max-w-3xl animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && (
                    <AnimatePresence mode="popLayout">
                        {mediaItems.length > 0 ? (
                            <motion.div layout className="divide-y divide-black/10 dark:divide-white/10">
                                {mediaItems.map((item, index) => (
                                    <MediaRow key={item.id} item={item} index={index} />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                                <SearchIcon className="text-[#86868b]" sx={{ fontSize: 34 }} />
                                <h3 className="mt-4 text-xl font-semibold">No results found</h3>
                                <p className="apple-copy mt-2">Try adjusting your search or filter criteria.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </section>
    )
}
