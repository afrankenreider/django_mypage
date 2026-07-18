import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SchoolIcon from '@mui/icons-material/School'
import CalculateIcon from '@mui/icons-material/Calculate'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import TimelineIcon from '@mui/icons-material/Timeline'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ImageIcon from '@mui/icons-material/Image'
import ArticleIcon from '@mui/icons-material/Article'
import SearchIcon from '@mui/icons-material/Search'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import BiotechIcon from '@mui/icons-material/Biotech'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import CancelIcon from '@mui/icons-material/Cancel'
import PeopleIcon from '@mui/icons-material/People'
import StorefrontIcon from '@mui/icons-material/Storefront'
import PlaceIcon from '@mui/icons-material/Place'

const clusterColors = [
    '#1d1d1f',
    '#248a3d',
    '#b25000',
    '#d70015',
    '#6e6e73',
    '#7a4f01',
    '#3d7d47',
    '#8e8e93',
]

const centroidColors = [
    '#000000',
    '#196c2e',
    '#8a3d00',
    '#a50011',
    '#424245',
    '#5c3a00',
    '#245c2e',
    '#636366',
]

interface Point {
    x: number
    y: number
    cluster?: number
}

interface Centroid {
    x: number
    y: number
}

interface IterationState {
    iteration: number
    centroids: number[][]
    assignments: number[]
}

interface KMeansResult {
    converged: boolean
    iterations: number
    final_centroids: number[][]
    final_assignments: number[]
    inertia: number
    silhouette_score: number
    history: IterationState[]
}

interface Dataset {
    name: string
    description: string
    k: number
    points: number[][]
}

// Custom tooltip component - memoized for performance
const CustomTooltip = memo(({ active, payload, datasetKey }: any) => {
    if (active && payload && payload.length) {
        const point = payload[0].payload
        const labels = datasetLabels[datasetKey] || { x: 'X', y: 'Y' }
        return (
            <div className="bg-[#1d1d1f]/95 backdrop-blur-sm border border-[#424245]/50 rounded-xl px-5 py-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#424245]/50">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: point.cluster !== undefined ? clusterColors[point.cluster % clusterColors.length] : '#a1a1a6' }}
                    />
                    <p className="text-[#d2d2d7] font-semibold text-sm">
                        {point.cluster !== undefined ? `Cluster ${point.cluster + 1}` : 'Unassigned'}
                    </p>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[#d2d2d7] text-sm flex justify-between gap-4">
                        <span className="text-[#86868b]">{labels.x}:</span>
                        <span className="font-mono font-medium">{point.x.toFixed(1)}</span>
                    </p>
                    <p className="text-[#d2d2d7] text-sm flex justify-between gap-4">
                        <span className="text-[#86868b]">{labels.y}:</span>
                        <span className="font-mono font-medium">{point.y.toFixed(1)}</span>
                    </p>
                </div>
            </div>
        )
    }
    return null
})
CustomTooltip.displayName = 'CustomTooltip'

// Fallback calculation for client-side
function calculateKMeans(points: Point[], k: number, maxIterations: number = 100): KMeansResult {
    const n = points.length

    // Initialize centroids randomly from existing points
    const initialIndices = new Set<number>()
    while (initialIndices.size < k) {
        initialIndices.add(Math.floor(Math.random() * n))
    }

    let centroids: Centroid[] = Array.from(initialIndices).map(i => ({ ...points[i] }))
    const history: IterationState[] = []

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        // Assign points to nearest centroid
        const assignments = points.map(point => {
            let minDist = Infinity
            let cluster = 0

            centroids.forEach((centroid, i) => {
                const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2)
                if (dist < minDist) {
                    minDist = dist
                    cluster = i
                }
            })

            return cluster
        })

        // Store history
        history.push({
            iteration,
            centroids: centroids.map(c => [c.x, c.y]),
            assignments: [...assignments],
        })

        // Calculate new centroids
        const newCentroids: Centroid[] = []
        for (let i = 0; i < k; i++) {
            const clusterPoints = points.filter((_, idx) => assignments[idx] === i)
            if (clusterPoints.length > 0) {
                const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0)
                const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0)
                newCentroids.push({
                    x: sumX / clusterPoints.length,
                    y: sumY / clusterPoints.length,
                })
            } else {
                // Reinitialize empty cluster
                newCentroids.push({ ...points[Math.floor(Math.random() * n)] })
            }
        }

        // Check convergence
        const converged = centroids.every((c, i) =>
            Math.abs(c.x - newCentroids[i].x) < 0.001 && Math.abs(c.y - newCentroids[i].y) < 0.001
        )

        centroids = newCentroids

        if (converged) {
            // Add final state
            const finalAssignments = points.map(point => {
                let minDist = Infinity
                let cluster = 0

                centroids.forEach((centroid, i) => {
                    const dist = Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2)
                    if (dist < minDist) {
                        minDist = dist
                        cluster = i
                    }
                })

                return cluster
            })

            history.push({
                iteration: iteration + 1,
                centroids: centroids.map(c => [c.x, c.y]),
                assignments: finalAssignments,
            })
            break
        }
    }

    const finalState = history[history.length - 1]
    let inertia = 0

    points.forEach((point, i) => {
        const cluster = finalState.assignments[i]
        const centroid = finalState.centroids[cluster]
        inertia += (point.x - centroid[0]) ** 2 + (point.y - centroid[1]) ** 2
    })

    return {
        converged: history.length < maxIterations,
        iterations: history.length - 1,
        final_centroids: finalState.centroids,
        final_assignments: finalState.assignments,
        inertia: Math.round(inertia * 10000) / 10000,
        silhouette_score: 0, // Simplified - not calculated client-side
        history,
    }
}

const sampleDatasets: Record<string, Dataset> = {
    customer_segments: {
        name: 'Customer Segments',
        description: 'Annual income vs. spending score from retail analytics',
        k: 3,
        points: [
            // High income, high spending (Premium customers)
            [85, 90], [88, 85], [92, 88], [78, 82], [95, 92], [82, 78], [90, 95],
            [75, 80], [98, 88], [80, 85], [87, 91], [93, 87],
            // Low income, high spending (Careful spenders)
            [15, 85], [18, 90], [12, 78], [22, 82], [20, 88], [25, 75], [17, 80],
            [28, 85], [14, 92], [23, 78],
            // Medium income, low spending (Budget conscious)
            [45, 20], [52, 25], [48, 18], [55, 22], [42, 28], [58, 15], [50, 30],
            [47, 24], [53, 19], [44, 26], [56, 21], [49, 17],
        ],
    },
    retail_products: {
        name: 'Retail Products',
        description: 'Price point vs. sales volume for product categorization',
        k: 4,
        points: [
            // Premium products (high price, low volume)
            [85, 15], [90, 12], [88, 18], [92, 10], [80, 20], [95, 8],
            // Mass market (low price, high volume)
            [15, 85], [18, 90], [12, 88], [20, 82], [22, 78], [10, 92],
            // Mid-tier products
            [45, 50], [50, 55], [48, 45], [52, 52], [55, 48], [42, 58],
            // Niche products (mid price, low volume)
            [55, 18], [60, 15], [58, 22], [62, 12], [50, 25], [65, 10],
        ],
    },
    geographic_locations: {
        name: 'Store Locations',
        description: 'Geographic coordinates for retail store clustering',
        k: 3,
        points: [
            // Downtown district
            [25, 75], [28, 72], [22, 78], [30, 70], [27, 76], [24, 73], [26, 79],
            [29, 74], [23, 71], [31, 77],
            // Suburban area
            [70, 65], [73, 68], [68, 62], [75, 70], [72, 64], [67, 67], [76, 66],
            [71, 69], [74, 63], [69, 71],
            // Industrial zone
            [55, 25], [58, 28], [52, 22], [60, 30], [57, 24], [54, 27], [61, 26],
            [56, 29], [53, 23], [59, 31],
        ],
    },
}

// Dataset icons - as a function to avoid JSX at module level
const getDatasetIcon = (key: string): React.ReactNode => {
    switch (key) {
        case 'customer_segments':
            return <PeopleIcon sx={{ fontSize: 18 }} />
        case 'retail_products':
            return <StorefrontIcon sx={{ fontSize: 18 }} />
        case 'geographic_locations':
            return <PlaceIcon sx={{ fontSize: 18 }} />
        default:
            return null
    }
}

// Dataset labels for charts
const datasetLabels: Record<string, { x: string; y: string }> = {
    customer_segments: { x: 'Annual Income ($K)', y: 'Spending Score' },
    retail_products: { x: 'Price Point ($)', y: 'Sales Volume (units)' },
    geographic_locations: { x: 'Longitude (normalized)', y: 'Latitude (normalized)' },
}

export default function KMeansDemo() {
    const [selectedDataset, setSelectedDataset] = useState<string>('customer_segments')
    const [result, setResult] = useState<KMeansResult | null>(null)
    const [customPoints, setCustomPoints] = useState<Point[]>([])
    const [isCustomMode, setIsCustomMode] = useState(false)
    const [k, setK] = useState(3)
    const [activeSection, setActiveSection] = useState<string>('intro')
    const [currentIteration, setCurrentIteration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const chartRef = useRef<any>(null)

    const currentDataset = sampleDatasets[selectedDataset]
    const customBounds = { xMin: 0, xMax: 100, yMin: 0, yMax: 100 }

    // Calculate k-means when dataset changes
    useEffect(() => {
        if (!isCustomMode) {
            const dataset = sampleDatasets[selectedDataset]
            if (dataset) {
                const points = dataset.points.map(([x, y]) => ({ x, y }))
                const calcResult = calculateKMeans(points, dataset.k)
                setResult(calcResult)
                setK(dataset.k)
                setCurrentIteration(calcResult.history.length - 1)
            }
        }
    }, [selectedDataset, isCustomMode])

    // Serialize custom points for stable dependency
    const customPointsKey = useMemo(() =>
        JSON.stringify(customPoints.map(p => [p.x, p.y])),
        [customPoints]
    )

    // Calculate k-means for custom points
    useEffect(() => {
        if (isCustomMode && customPoints.length >= k) {
            const calcResult = calculateKMeans(customPoints, k)
            setResult(calcResult)
            setCurrentIteration(calcResult.history.length - 1)
        } else if (isCustomMode && customPoints.length < k) {
            setResult(null)
            setCurrentIteration(0)
        }
    }, [customPointsKey, isCustomMode, k])

    // Animation for playing through iterations
    useEffect(() => {
        if (!isPlaying || !result) return

        const totalIterations = result.history.length - 1
        const intervalId = setInterval(() => {
            setCurrentIteration(prev => {
                if (prev >= totalIterations) {
                    setIsPlaying(false)
                    return totalIterations
                }
                return prev + 1
            })
        }, 800)

        return () => clearInterval(intervalId)
    }, [isPlaying, result?.history?.length])

    // Get current iteration state
    const currentState = useMemo(() => {
        if (!result || !result.history[currentIteration]) return null
        return result.history[currentIteration]
    }, [result, currentIteration])

    // Prepare chart data with current iteration assignments
    const chartData: Point[] = useMemo(() => {
        if (isCustomMode) {
            return customPoints.map((p, i) => ({
                ...p,
                cluster: currentState?.assignments[i],
            }))
        }
        if (!currentDataset) return []
        return currentDataset.points.map(([x, y], i) => ({
            x,
            y,
            cluster: currentState?.assignments[i],
        }))
    }, [isCustomMode, customPoints, currentDataset, currentState])

    // Centroid data for current iteration
    const centroidData = useMemo(() => {
        if (!currentState) return []
        return currentState.centroids.map(([x, y], i) => ({ x, y, cluster: i }))
    }, [currentState])

    // Handle click on chart to add custom point
    const handleChartClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isCustomMode) return

        const chartWrapper = e.currentTarget
        const rect = chartWrapper.getBoundingClientRect()
        const margin = { top: 20, right: 40, bottom: 60, left: 70 }

        const clickX = e.clientX - rect.left - margin.left
        const clickY = e.clientY - rect.top - margin.top

        const chartWidth = rect.width - margin.left - margin.right
        const chartHeight = rect.height - margin.top - margin.bottom

        if (clickX < 0 || clickX > chartWidth || clickY < 0 || clickY > chartHeight) return

        const xValue = customBounds.xMin + (clickX / chartWidth) * (customBounds.xMax - customBounds.xMin)
        const yValue = customBounds.yMax - (clickY / chartHeight) * (customBounds.yMax - customBounds.yMin)

        const newPoint: Point = {
            x: Math.round(xValue * 10) / 10,
            y: Math.round(yValue * 10) / 10,
        }

        setCustomPoints(prev => [...prev, newPoint])
    }, [isCustomMode, customBounds])

    const clearCustomPoints = () => {
        setCustomPoints([])
        setResult(null)
        setCurrentIteration(0)
    }

    const removeLastPoint = () => {
        setCustomPoints(prev => prev.slice(0, -1))
    }

    const sections = [
        { id: 'intro', label: 'Introduction', icon: SchoolIcon },
        { id: 'math', label: 'How It Works', icon: CalculateIcon },
        { id: 'interactive', label: 'Interactive Demo', icon: TouchAppIcon },
        { id: 'usecases', label: 'Applications', icon: TipsAndUpdatesIcon },
    ]

    return (
        <section className="apple-page pt-28 pb-24 relative overflow-hidden">
            {/* Ambient analytics backdrop */}
            <div className="absolute inset-0 studio-grid opacity-50" />

            <div className="apple-section max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link
                        to="/projects"
                        className="text-link mb-8 group"
                    >
                        <ArrowBackIcon className="group-hover:-translate-x-1 transition-transform" sx={{ fontSize: 20 }} />
                        Back to Projects
                    </Link>

                    <div className="mb-14 max-w-3xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-sm font-medium text-[#6e6e73] dark:bg-white/10 dark:text-[#a1a1a6] mb-6"
                        >
                            <TimelineIcon sx={{ fontSize: 18 }} />
                            Project walkthrough
                        </motion.span>
                        <h1 className="display-heading text-5xl md:text-6xl lg:text-7xl mb-6">
                            K-Means <span className="ink-text">Clustering</span>
                        </h1>
                        <p className="apple-copy max-w-2xl text-lg sm:text-xl">
                            I use this demo to explain clustering decisions in a practical way, including where k-means works well and where it does not.
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Project sections">
                        {sections.map((section) => {
                            const Icon = section.icon
                            return (
                                <button
                                    type="button"
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    aria-pressed={activeSection === section.id}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${activeSection === section.id
                                        ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-lg'
                                        : 'bg-[#e8e8ed] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-[#d2d2d7] dark:hover:bg-[#424245]'
                                        }`}
                                >
                                    <Icon sx={{ fontSize: 18 }} />
                                    {section.label}
                                </button>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Introduction Section */}
                {activeSection === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">What is K-Means Clustering?</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-[#6e6e73] dark:text-[#a1a1a6] text-lg leading-relaxed mb-6">
                                    K-means clustering groups similar data points into K clusters. It is useful when you have unlabeled data and want a quick first pass at segmentation.
                                </p>
                                <p className="text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed mb-6">
                                    The algorithm works by iteratively assigning each point to the nearest cluster center (centroid) and then updating the centroids based on the points assigned to them. This process continues until the cluster assignments stabilize.
                                </p>

                                <div className="grid md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                            <TrackChangesIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Goal</h3>
                                        <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                            Minimize the total distance between points and their assigned cluster centers
                                        </p>
                                    </div>
                                    <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                            <BarChartIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Input</h3>
                                        <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                            Data points and K (number of clusters you want to find)
                                        </p>
                                    </div>
                                    <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                            <TrackChangesIcon sx={{ fontSize: 24 }} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Output</h3>
                                        <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                            Cluster assignments for each point and K cluster centroids
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Key Characteristics</h2>
                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-6">
                                Understanding what makes k-means unique and when to use it.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircleIcon className="text-green-600 dark:text-green-400" sx={{ fontSize: 16 }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Fast & Scalable</h4>
                                            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Computationally efficient, works well with large datasets
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircleIcon className="text-green-600 dark:text-green-400" sx={{ fontSize: 16 }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Simple to Understand</h4>
                                            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Intuitive concept—group similar things together
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircleIcon className="text-green-600 dark:text-green-400" sx={{ fontSize: 16 }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Guaranteed Convergence</h4>
                                            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Algorithm always converges to a solution
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <WarningIcon className="text-amber-600 dark:text-amber-400" sx={{ fontSize: 16 }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Must Choose K</h4>
                                            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                                You need to specify the number of clusters beforehand
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <WarningIcon className="text-amber-600 dark:text-amber-400" sx={{ fontSize: 16 }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Sensitive to Initialization</h4>
                                            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Different starting centroids can give different results
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <WarningIcon className="text-amber-600 dark:text-amber-400" sx={{ fontSize: 16 }} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Assumes Spherical Clusters</h4>
                                            <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Works best when clusters are roughly circular/spherical
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* How It Works Section */}
                {activeSection === 'math' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">The Algorithm Steps</h2>

                            <div className="space-y-6">
                                <div className="apple-card-solid rounded-xl border hairline p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white flex items-center justify-center font-bold flex-shrink-0">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Initialize Centroids</h3>
                                            <p className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Randomly select K data points as initial cluster centers. This initialization affects the final result.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="apple-card-solid rounded-xl p-6 border border-green-100 dark:border-green-800">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Assign Points to Clusters</h3>
                                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-3">
                                                For each data point, calculate the distance to all centroids and assign it to the nearest one.
                                            </p>
                                            <div className="bg-white/60 dark:bg-[#2c2c2e]/60 rounded-lg p-4 font-mono text-sm text-[#424245] dark:text-[#d2d2d7]">
                                                distance = √[(x₁ - x₂)² + (y₁ - y₂)²]
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="apple-card-solid rounded-xl p-6 border border-amber-100 dark:border-amber-800">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white flex items-center justify-center font-bold flex-shrink-0">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Update Centroids</h3>
                                            <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-3">
                                                Calculate new centroid positions as the mean of all points in each cluster.
                                            </p>
                                            <div className="bg-white/60 dark:bg-[#2c2c2e]/60 rounded-lg p-4 font-mono text-sm text-[#424245] dark:text-[#d2d2d7]">
                                                centroid_x = (Σ x_i) / n<br />
                                                centroid_y = (Σ y_i) / n
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="apple-card-solid rounded-xl border hairline p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white flex items-center justify-center font-bold flex-shrink-0">
                                            4
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Check Convergence</h3>
                                            <p className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                If centroids haven't moved (or moved very little), the algorithm has converged. Otherwise, repeat steps 2-4.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Measuring Quality</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">Inertia (WCSS)</h3>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-4 text-sm">
                                        <strong>Within-Cluster Sum of Squares</strong> measures how compact the clusters are. Lower is better.
                                    </p>
                                    <div className="bg-white dark:bg-[#1d1d1f] rounded-lg p-4 font-mono text-sm text-[#424245] dark:text-[#d2d2d7] mb-3">
                                        WCSS = Σ (distance to centroid)²
                                    </div>
                                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                                        Used in the "elbow method" to find optimal K
                                    </p>
                                </div>

                                <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">Silhouette Score</h3>
                                    <p className="text-[#6e6e73] dark:text-[#a1a1a6] mb-4 text-sm">
                                        Measures how similar points are to their own cluster vs. other clusters. Range: -1 to 1.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">0.7 - 1.0: Excellent</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]" />
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">0.5 - 0.7: Good</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]" />
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">0.25 - 0.5: Fair</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]" />
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">&lt; 0.25: Poor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1d1d1f] dark:bg-white rounded-2xl p-8 text-center shadow-xl">
                            <h2 className="text-2xl font-bold text-white dark:text-[#1d1d1f] mb-4">See it run</h2>
                            <p className="text-[#d2d2d7] dark:text-[#6e6e73] mb-6 max-w-xl mx-auto">
                                Watch the algorithm iterate step by step in the interactive demo.
                            </p>
                            <button
                                onClick={() => setActiveSection('interactive')}
                                className="px-8 py-3 bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-xl font-semibold hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-colors shadow-lg"
                            >
                                Try Interactive Demo →
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Interactive Demo Section */}
                {activeSection === 'interactive' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                    {isCustomMode ? 'Custom Data' : currentDataset?.name}
                                </h2>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setIsCustomMode(!isCustomMode)
                                            if (!isCustomMode) {
                                                setCustomPoints([])
                                                setResult(null)
                                            }
                                            setIsPlaying(false)
                                        }}
                                        className="px-4 py-2 bg-[#e8e8ed] dark:bg-[#2c2c2e] text-[#424245] dark:text-[#d2d2d7] rounded-lg hover:bg-[#d2d2d7] dark:hover:bg-[#424245] transition-colors font-medium"
                                    >
                                        {isCustomMode ? 'Use Sample Data' : 'Create Custom'}
                                    </button>
                                </div>
                            </div>

                            {!isCustomMode && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {Object.entries(sampleDatasets).map(([key, dataset]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedDataset(key)
                                                setIsPlaying(false)
                                            }}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedDataset === key
                                                ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] shadow-lg'
                                                : 'bg-[#e8e8ed] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-[#d2d2d7] dark:hover:bg-[#424245]'
                                                }`}
                                        >
                                            {getDatasetIcon(key)}
                                            {dataset.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {isCustomMode && (
                                <div className="mb-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <label className="text-[#424245] dark:text-[#d2d2d7] font-medium">
                                            Number of clusters (K):
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="8"
                                            value={k}
                                            onChange={(e) => setK(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                                            className="w-20 px-3 py-2 bg-[#e8e8ed] dark:bg-[#2c2c2e] border border-[#d2d2d7] dark:border-[#6e6e73] rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7]"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={removeLastPoint}
                                            disabled={customPoints.length === 0}
                                            className="px-4 py-2 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Remove Last Point
                                        </button>
                                        <button
                                            onClick={clearCustomPoints}
                                            disabled={customPoints.length === 0}
                                            className="px-4 py-2 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Clear All Points
                                        </button>
                                    </div>

                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Click on the chart to add points. You need at least {k} points to run k-means.
                                        {customPoints.length > 0 && ` (${customPoints.length} points added)`}
                                    </p>
                                </div>
                            )}

                            <div
                                className={`h-[500px] bg-[#e8e8ed] dark:bg-[#2c2c2e]/60 rounded-2xl p-4 border border-[#d2d2d7] dark:border-[#424245]/50 ${isCustomMode ? 'cursor-crosshair' : ''
                                    }`}
                                onClick={handleChartClick}
                                ref={chartRef}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 30, right: 16, bottom: 60, left: 40 }}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--hairline)"
                                            strokeWidth={1}
                                        />
                                        <XAxis
                                            type="number"
                                            dataKey="x"
                                            name="X"
                                            domain={isCustomMode ? [customBounds.xMin, customBounds.xMax] : ['auto', 'auto']}
                                            stroke="var(--text-secondary)"
                                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                            tickLine={{ stroke: '#a1a1a6' }}
                                            axisLine={{ stroke: 'var(--hairline)', strokeWidth: 1 }}
                                            label={{
                                                value: isCustomMode ? 'X Value' : (datasetLabels[selectedDataset]?.x || 'X'),
                                                position: 'insideBottom',
                                                offset: -15,
                                                fill: 'var(--text-secondary)',
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}
                                        />
                                        <YAxis
                                            type="number"
                                            dataKey="y"
                                            name="Y"
                                            domain={isCustomMode ? [customBounds.yMin, customBounds.yMax] : ['auto', 'auto']}
                                            stroke="var(--text-secondary)"
                                            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                            tickLine={{ stroke: '#a1a1a6' }}
                                            axisLine={{ stroke: 'var(--hairline)', strokeWidth: 1 }}
                                            label={{
                                                value: isCustomMode ? 'Y Value' : (datasetLabels[selectedDataset]?.y || 'Y'),
                                                angle: -90,
                                                position: 'insideLeft',
                                                offset: 10,
                                                fill: 'var(--text-secondary)',
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}
                                        />
                                        <Tooltip content={<CustomTooltip datasetKey={isCustomMode ? null : selectedDataset} />} />

                                        {/* Data points with enhanced styling */}
                                        <Scatter name="Data Points" data={chartData}>
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.cluster !== undefined ? clusterColors[entry.cluster % clusterColors.length] : '#a1a1a6'}
                                                    stroke={entry.cluster !== undefined ? centroidColors[entry.cluster % centroidColors.length] : 'var(--text-secondary)'}
                                                    strokeWidth={1.5}
                                                />
                                            ))}
                                        </Scatter>

                                        {/* Centroids with star shape */}
                                        {centroidData.length > 0 && (
                                            <Scatter
                                                name="Centroids"
                                                data={centroidData}
                                                shape="star"
                                                legendType="star"
                                            >
                                                {centroidData.map((entry, index) => (
                                                    <Cell
                                                        key={`centroid-${index}`}
                                                        fill={centroidColors[entry.cluster % centroidColors.length]}
                                                        stroke="#ffffff"
                                                        strokeWidth={2}
                                                    />
                                                ))}
                                            </Scatter>
                                        )}
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Animation Controls */}
                            {result && result.history.length > 1 && (
                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            disabled={currentIteration >= result.history.length - 1 && !isPlaying}
                                            className="flex items-center gap-2 rounded-lg bg-[#1d1d1f] px-4 py-2 text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#f5f5f7] dark:text-[#1d1d1f] dark:hover:bg-white"
                                        >
                                            {isPlaying ? (
                                                <>
                                                    <PauseIcon sx={{ fontSize: 20 }} />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <PlayArrowIcon sx={{ fontSize: 20 }} />
                                                    {currentIteration >= result.history.length - 1 ? 'Replay' : 'Play'}
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => {
                                                setCurrentIteration(prev => Math.min(prev + 1, result.history.length - 1))
                                                setIsPlaying(false)
                                            }}
                                            disabled={currentIteration >= result.history.length - 1}
                                            className="px-4 py-2 bg-[#86868b] text-white rounded-lg hover:bg-[#6e6e73] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                        >
                                            <SkipNextIcon sx={{ fontSize: 20 }} />
                                            Next Step
                                        </button>

                                        <button
                                            onClick={() => {
                                                setCurrentIteration(0)
                                                setIsPlaying(false)
                                            }}
                                            className="px-4 py-2 bg-[#d2d2d7] dark:bg-[#424245] text-[#424245] dark:text-[#d2d2d7] rounded-lg hover:bg-[#a1a1a6] dark:hover:bg-[#6e6e73] transition-colors flex items-center gap-2"
                                        >
                                            <RestartAltIcon sx={{ fontSize: 20 }} />
                                            Reset
                                        </button>

                                        <div className="flex-1" />

                                        <div className="text-[#6e6e73] dark:text-[#a1a1a6] font-medium">
                                            Iteration {currentIteration} / {result.history.length - 1}
                                        </div>
                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max={result.history.length - 1}
                                        value={currentIteration}
                                        onChange={(e) => {
                                            setCurrentIteration(parseInt(e.target.value))
                                            setIsPlaying(false)
                                        }}
                                        className="w-full"
                                    />
                                </div>
                            )}

                            {/* Results */}
                            {result && (
                                <div className="mt-6 grid md:grid-cols-4 gap-4">
                                    <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mb-1">Iterations</div>
                                        <div className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{result.iterations}</div>
                                    </div>
                                    <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mb-1">Converged</div>
                                        <div className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center">
                                            {result.converged ? (
                                                <CheckCircleIcon className="text-green-500" sx={{ fontSize: 28 }} />
                                            ) : (
                                                <CancelIcon className="text-red-500" sx={{ fontSize: 28 }} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mb-1">Inertia</div>
                                        <div className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">{result.inertia.toFixed(2)}</div>
                                    </div>
                                    <div className="bg-[#f5f5f7] dark:bg-[#2c2c2e]/50 rounded-xl p-4 border border-[#d2d2d7] dark:border-[#424245]">
                                        <div className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mb-1">Silhouette</div>
                                        <div className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                            {result.silhouette_score.toFixed(3)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isCustomMode && customPoints.length < k && (
                                <div className="mt-6 rounded-xl border hairline bg-black/[0.03] p-4 dark:bg-white/[0.06]">
                                    <p className="text-[#424245] dark:text-[#d2d2d7]">
                                        Add {k - customPoints.length} more point{k - customPoints.length !== 1 ? 's' : ''} to run k-means clustering.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Applications Section */}
                {activeSection === 'usecases' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Real-World Applications</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                        <ShoppingCartIcon sx={{ fontSize: 24 }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Customer Segmentation</h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Group customers by behavior, demographics, or purchase patterns for targeted marketing
                                    </p>
                                </div>
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                        <ImageIcon sx={{ fontSize: 24 }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Image Compression</h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Reduce color palettes by clustering similar colors, decreasing file size
                                    </p>
                                </div>
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                        <ArticleIcon sx={{ fontSize: 24 }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Document Classification</h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Organize articles, emails, or documents into topics automatically
                                    </p>
                                </div>
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                        <SearchIcon sx={{ fontSize: 24 }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Anomaly Detection</h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Identify outliers that don't fit well into any cluster (fraud, defects)
                                    </p>
                                </div>
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                        <LocationCityIcon sx={{ fontSize: 24 }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Geographic Clustering</h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Find optimal locations for stores, warehouses, or service centers
                                    </p>
                                </div>
                                <div className="bg-[#e8e8ed] dark:bg-[#2c2c2e]/50 rounded-xl p-6 border border-[#d2d2d7] dark:border-[#424245]">
                                    <div className="w-12 h-12 bg-[#1d1d1f] dark:bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg text-white dark:text-[#1d1d1f]">
                                        <BiotechIcon sx={{ fontSize: 24 }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">Gene Expression</h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Group genes with similar expression patterns in biological research
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f5f5f7] dark:bg-[#1d1d1f]/50 backdrop-blur-sm rounded-3xl border border-[#d2d2d7]/50 dark:border-[#2c2c2e]/50 p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">When to Use K-Means</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                                        <CheckCircleIcon sx={{ fontSize: 24 }} />
                                        Good Use Cases
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                You have a rough idea of how many groups exist
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Clusters are roughly spherical/circular in shape
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                You need fast results on large datasets
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Features are on similar scales (or can be normalized)
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Cluster sizes are relatively balanced
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                                        <CancelIcon sx={{ fontSize: 24 }} />
                                        Consider Alternatives When
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                You don't know how many clusters to expect
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Clusters have complex, non-spherical shapes
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Clusters vary greatly in density or size
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                You need hierarchical relationships between clusters
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-500 mt-1">•</span>
                                            <span className="text-[#6e6e73] dark:text-[#a1a1a6]">
                                                Data contains many outliers or noise
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1d1d1f] rounded-2xl border border-[#d2d2d7] dark:border-[#2c2c2e] p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">Tips for Better Results</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                                        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">1.</span>
                                        Normalize Your Data
                                    </h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Scale features to similar ranges so no single feature dominates distance calculations
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                                        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">2.</span>
                                        Use the Elbow Method
                                    </h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Plot inertia vs. K and look for the "elbow" point where improvement slows
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                                        <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">3.</span>
                                        Run Multiple Times
                                    </h3>
                                    <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
                                        Try different random seeds and pick the result with the lowest inertia
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1d1d1f] dark:bg-white rounded-2xl p-8 text-center shadow-xl">
                            <h2 className="text-2xl font-bold text-white dark:text-[#1d1d1f] mb-4">Try it in the playground</h2>
                            <p className="text-[#d2d2d7] dark:text-[#6e6e73] mb-6 max-w-xl mx-auto">
                                Experiment with different datasets and K values to see how the algorithm behaves.
                            </p>
                            <button
                                onClick={() => setActiveSection('interactive')}
                                className="px-8 py-3 bg-white dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-xl font-semibold hover:bg-[#e8e8ed] dark:hover:bg-[#2c2c2e] transition-colors shadow-lg"
                            >
                                Open interactive demo →
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
