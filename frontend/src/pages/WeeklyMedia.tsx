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
import FilterListIcon from '@mui/icons-material/FilterList'
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

const mediaTypeConfig: Record<MediaType, { label: string; icon: React.ReactNode; color: string }> = {
    podcast: {
        label: 'Podcast',
        icon: <PodcastsIcon sx={{ fontSize: 24 }} />,
        color: 'from-purple-500 to-purple-700',
    },
    article: {
        label: 'Article',
        icon: <ArticleIcon sx={{ fontSize: 24 }} />,
        color: 'from-blue-500 to-blue-700',
    },
    whitepaper: {
        label: 'Whitepaper',
        icon: <DescriptionIcon sx={{ fontSize: 24 }} />,
        color: 'from-emerald-500 to-emerald-700',
    },
    video: {
        label: 'Video',
        icon: <VideocamIcon sx={{ fontSize: 24 }} />,
        color: 'from-red-500 to-red-700',
    },
    book: {
        label: 'Book',
        icon: <MenuBookIcon sx={{ fontSize: 24 }} />,
        color: 'from-amber-500 to-amber-700',
    },
}

/**
 * Transforms API response to frontend MediaItem format.
 */
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

interface MediaCardProps {
    item: MediaItem
    index: number
}

function MediaCard({ item, index }: MediaCardProps) {
    const [copied, setCopied] = useState(false)
    const config = mediaTypeConfig[item.type]

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: item.title,
                    text: item.description,
                    url: item.url,
                })
            } else {
                await navigator.clipboard.writeText(item.url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }
        } catch (error) {
            // User cancelled or error occurred
            console.error('Share failed:', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="group relative"
        >
            <div className="h-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700">
                {/* Type indicator header */}
                <div className={`h-2 bg-gradient-to-r ${config.color}`} />

                <div className="p-6">
                    {/* Header with type and date */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color} text-white`}>
                                {config.icon}
                            </div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {config.label}
                            </span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            {new Date(item.dateAdded).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {item.title}
                    </h3>

                    {/* Source */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        {item.source}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                        >
                            <OpenInNewIcon sx={{ fontSize: 16 }} />
                            Open
                        </a>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="Share"
                        >
                            {copied ? (
                                <CheckIcon sx={{ fontSize: 18 }} />
                            ) : 'share' in navigator ? (
                                <ShareIcon sx={{ fontSize: 18 }} />
                            ) : (
                                <ContentCopyIcon sx={{ fontSize: 18 }} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function WeeklyMedia() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all')

    // Debounce search query to avoid excessive API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
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
            const transformedItems = data.map(transformApiItem)
            setMediaItems(transformedItems)
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
        <section className="min-h-screen pt-32 pb-24 bg-white/80 dark:bg-slate-950/80 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 gradient-mesh opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 mb-6"
                        >
                            Curated Content
                        </motion.span>
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
                            <span className="gradient-text">Weekly Media</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            A collection of podcasts, articles, whitepapers, and other content I find valuable and worth sharing
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-10 space-y-4">
                        {/* Search bar */}
                        <div className="relative max-w-xl mx-auto">
                            <SearchIcon
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                sx={{ fontSize: 20 }}
                            />
                            <input
                                type="text"
                                placeholder="Search by title, source, or tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Type filter */}
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <FilterListIcon className="text-slate-400 mr-2" sx={{ fontSize: 20 }} />
                            {mediaTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setSelectedType(type.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedType === type.value
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {isLoading ? 'Loading...' : `Showing ${mediaItems.length} items`}
                        </p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                                <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 32 }} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                Failed to load content
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={fetchMediaItems}
                                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {/* Loading State */}
                    {isLoading && !error && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className="h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Media Grid */}
                    {!isLoading && !error && (
                        <AnimatePresence mode="popLayout">
                            {mediaItems.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {mediaItems.map((item, index) => (
                                        <MediaCard key={item.id} item={item} index={index} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                                        <SearchIcon className="text-slate-400" sx={{ fontSize: 32 }} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                        No results found
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Try adjusting your search or filter criteria
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
