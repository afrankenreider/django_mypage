import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import PsychologyIcon from '@mui/icons-material/Psychology'
import TuneIcon from '@mui/icons-material/Tune'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

// Types
interface StockQuote {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume: number
    marketCap: number
    dayHigh: number
    dayLow: number
    previousClose?: number
    open?: number
    '52WeekHigh'?: number
    '52WeekLow'?: number
    peRatio?: number | null
    eps?: number | null
    dividend?: number | null
    dividendYield?: number | null
    sector?: string
    industry?: string
    error?: string
}

interface HistoricalDataPoint {
    timestamp: string
    open: number
    high: number
    low: number
    close: number
    volume: number
}

interface ChartDataPoint {
    date: string
    price: number
    volume: number
}

// ML Prediction Types
interface HyperparameterConfig {
    name: string
    description: string
    type: 'integer' | 'float'
    default: number
    min: number
    max: number
    step?: number
}

interface MLModelConfig {
    name: string
    description: string
    hyperparameters: Record<string, HyperparameterConfig>
}

interface PredictionPoint {
    date: string
    predicted_price: number
    confidence_lower: number
    confidence_upper: number
}

interface PredictionResult {
    symbol: string
    model: string
    forecast_horizon: number
    training_points: number
    execution_time_seconds: number
    predictions: PredictionPoint[]
    model_info: Record<string, any>
    last_actual_price: number
    last_actual_date: string
    disclaimer: string
}

interface PredictionChartPoint {
    date: string
    price?: number
    predicted?: number
    confidenceLower?: number
    confidenceUpper?: number
    isPrediction?: boolean
}

// API base URL
const API_BASE = '/api/stocks'

// Default watchlist
const DEFAULT_WATCHLIST = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']

// ML Model default configurations (fetched from API, but fallback here)
const DEFAULT_ML_MODELS: Record<string, MLModelConfig> = {
    arima: {
        name: 'ARIMA',
        description: 'AutoRegressive Integrated Moving Average - A classical time series forecasting model.',
        hyperparameters: {
            p: { name: 'AR Order (p)', description: 'Number of autoregressive terms', type: 'integer', default: 5, min: 1, max: 10 },
            d: { name: 'Differencing (d)', description: 'Degree of differencing', type: 'integer', default: 1, min: 0, max: 2 },
            q: { name: 'MA Order (q)', description: 'Number of moving average terms', type: 'integer', default: 0, min: 0, max: 5 },
        },
    },
    xgboost: {
        name: 'XGBoost',
        description: 'Extreme Gradient Boosting - A powerful ensemble method using gradient boosted trees.',
        hyperparameters: {
            n_estimators: { name: 'Number of Trees', description: 'Number of boosting rounds', type: 'integer', default: 100, min: 10, max: 200 },
            max_depth: { name: 'Max Depth', description: 'Maximum tree depth', type: 'integer', default: 3, min: 1, max: 6 },
            learning_rate: { name: 'Learning Rate', description: 'Step size shrinkage', type: 'float', default: 0.1, min: 0.01, max: 0.3, step: 0.01 },
            subsample: { name: 'Subsample Ratio', description: 'Fraction of samples for training', type: 'float', default: 0.8, min: 0.5, max: 1.0, step: 0.1 },
        },
    },
    catboost: {
        name: 'CatBoost',
        description: 'Categorical Boosting - A gradient boosting library with reduced overfitting.',
        hyperparameters: {
            iterations: { name: 'Iterations', description: 'Number of boosting iterations', type: 'integer', default: 100, min: 10, max: 200 },
            depth: { name: 'Tree Depth', description: 'Depth of the trees', type: 'integer', default: 4, min: 1, max: 6 },
            learning_rate: { name: 'Learning Rate', description: 'Step size shrinkage', type: 'float', default: 0.1, min: 0.01, max: 0.3, step: 0.01 },
            l2_leaf_reg: { name: 'L2 Regularization', description: 'L2 regularization coefficient', type: 'integer', default: 3, min: 1, max: 10 },
        },
    },
    lightgbm: {
        name: 'LightGBM',
        description: 'Light Gradient Boosting Machine - A fast, efficient gradient boosting framework.',
        hyperparameters: {
            n_estimators: { name: 'Number of Trees', description: 'Number of boosting rounds', type: 'integer', default: 100, min: 10, max: 200 },
            max_depth: { name: 'Max Depth', description: 'Maximum tree depth', type: 'integer', default: 3, min: 1, max: 6 },
            learning_rate: { name: 'Learning Rate', description: 'Step size shrinkage', type: 'float', default: 0.1, min: 0.01, max: 0.3, step: 0.01 },
            num_leaves: { name: 'Number of Leaves', description: 'Maximum leaves per tree', type: 'integer', default: 31, min: 10, max: 50 },
        },
    },
}

// Forecast horizon options
const FORECAST_HORIZONS = [
    { label: '3 Days', value: 3 },
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
]

// Time periods
const TIME_PERIODS = [
    { label: '1D', value: '1d', interval: '5m' },
    { label: '5D', value: '5d', interval: '15m' },
    { label: '1M', value: '1mo', interval: '1d' },
    { label: '3M', value: '3mo', interval: '1d' },
    { label: '6M', value: '6mo', interval: '1d' },
    { label: '1Y', value: '1y', interval: '1d' },
    { label: '5Y', value: '5y', interval: '1wk' },
]

// Custom Tooltip
const CustomTooltip = memo(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="apple-card-solid px-4 py-3 shadow-xl">
                <p className="text-[#86868b] text-xs mb-1">{label}</p>
                <p className="text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-lg">
                    ${payload[0].value?.toFixed(2)}
                </p>
                {payload[1] && (
                    <p className="text-[#86868b] text-xs mt-1">
                        Vol: {(payload[1].value / 1000000).toFixed(2)}M
                    </p>
                )}
            </div>
        )
    }
    return null
})
CustomTooltip.displayName = 'CustomTooltip'

// Stock Card Component
const StockCard = memo(({
    quote,
    isSelected,
    onClick,
    onRemove,
}: {
    quote: StockQuote
    isSelected: boolean
    onClick: () => void
    onRemove: () => void
}) => {
    const isPositive = quote.change >= 0

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${isSelected
                ? 'bg-white dark:bg-white/10 border-2 border-[#1d1d1f] dark:border-[#f5f5f7]'
                : 'bg-white/70 dark:bg-white/[0.055] border hairline hover:bg-white dark:hover:bg-white/10'
                }`}
        >
            {/* Remove button */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:bg-white/10 dark:hover:text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors"
                title="Remove from watchlist"
            >
                <DeleteIcon sx={{ fontSize: 16 }} />
            </button>

            <div className="flex items-start justify-between mb-2 pr-6">
                <div>
                    <h3 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{quote.symbol}</h3>
                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] truncate max-w-[120px]">
                        {quote.name}
                    </p>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <p className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    ${quote.price?.toFixed(2)}
                </p>
                <div
                    className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}
                >
                    {isPositive ? (
                        <TrendingUpIcon sx={{ fontSize: 16 }} />
                    ) : (
                        <TrendingDownIcon sx={{ fontSize: 16 }} />
                    )}
                    <span>
                        {isPositive ? '+' : ''}
                        {quote.changePercent?.toFixed(2)}%
                    </span>
                </div>
            </div>
        </motion.div>
    )
})
StockCard.displayName = 'StockCard'

// Main Component
export default function FinanceDashboard() {
    // State
    const [watchlist, setWatchlist] = useState<string[]>(() => {
        const saved = localStorage.getItem('stockWatchlist')
        return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST
    })
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({})
    const [selectedStock, setSelectedStock] = useState<string>(watchlist[0] || 'AAPL')
    const [historicalData, setHistoricalData] = useState<ChartDataPoint[]>([])
    const [selectedPeriod, setSelectedPeriod] = useState(TIME_PERIODS[2]) // Default to 1M
    const [isLoading, setIsLoading] = useState(true)
    const [isChartLoading, setIsChartLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddingStock, setIsAddingStock] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    // ML Prediction State
    const [showPredictions, setShowPredictions] = useState(false)
    const [selectedModel, setSelectedModel] = useState<string>('arima')
    const [forecastHorizon, setForecastHorizon] = useState(7)
    const [hyperparameters, setHyperparameters] = useState<Record<string, number>>({})
    const [isPredicting, setIsPredicting] = useState(false)
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
    const [predictionError, setPredictionError] = useState<string | null>(null)
    const [showHyperparameters, setShowHyperparameters] = useState(false)
    const [mlModels] = useState<Record<string, MLModelConfig>>(DEFAULT_ML_MODELS)

    // Save watchlist to localStorage
    useEffect(() => {
        localStorage.setItem('stockWatchlist', JSON.stringify(watchlist))
    }, [watchlist])

    // Fetch quotes for all stocks in watchlist
    const fetchQuotes = useCallback(async () => {
        if (watchlist.length === 0) return

        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(`${API_BASE}/quotes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symbols: watchlist }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch quotes')
            }

            const data = await response.json()
            setQuotes(data.quotes || {})
            setLastUpdated(new Date())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stock data')
        } finally {
            setIsLoading(false)
        }
    }, [watchlist])

    // Fetch historical data for selected stock
    const fetchHistoricalData = useCallback(async () => {
        if (!selectedStock) return

        try {
            setIsChartLoading(true)
            const response = await fetch(
                `${API_BASE}/history/?symbol=${selectedStock}&period=${selectedPeriod.value}&interval=${selectedPeriod.interval}`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch historical data')
            }

            const data = await response.json()
            const chartData: ChartDataPoint[] = (data.data || []).map(
                (point: HistoricalDataPoint) => ({
                    date: formatDate(point.timestamp, selectedPeriod.value),
                    price: point.close,
                    volume: point.volume,
                })
            )
            setHistoricalData(chartData)
        } catch (err) {
            console.error('Failed to fetch historical data:', err)
        } finally {
            setIsChartLoading(false)
        }
    }, [selectedStock, selectedPeriod])

    // Reset hyperparameters when model changes
    useEffect(() => {
        const modelConfig = mlModels[selectedModel]
        if (modelConfig) {
            const defaults: Record<string, number> = {}
            Object.entries(modelConfig.hyperparameters).forEach(([key, config]) => {
                defaults[key] = config.default
            })
            setHyperparameters(defaults)
        }
    }, [selectedModel, mlModels])

    // Clear predictions when stock changes
    useEffect(() => {
        setPredictionResult(null)
        setPredictionError(null)
    }, [selectedStock])

    // Fetch ML predictions
    const fetchPredictions = useCallback(async () => {
        if (!selectedStock) return

        try {
            setIsPredicting(true)
            setPredictionError(null)

            const response = await fetch(`${API_BASE}/predict/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: selectedStock,
                    model: selectedModel,
                    forecast_horizon: forecastHorizon,
                    hyperparams: hyperparameters,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Prediction failed')
            }

            const data: PredictionResult = await response.json()
            setPredictionResult(data)
        } catch (err) {
            setPredictionError(err instanceof Error ? err.message : 'Prediction failed')
            setPredictionResult(null)
        } finally {
            setIsPredicting(false)
        }
    }, [selectedStock, selectedModel, forecastHorizon, hyperparameters])

    // Combine historical and prediction data for chart
    const combinedChartData = useMemo((): PredictionChartPoint[] => {
        if (!showPredictions || !predictionResult) {
            return historicalData.map((d) => ({
                date: d.date,
                price: d.price,
            }))
        }

        // Take last 30 days of historical data for context
        const recentHistory = historicalData.slice(-30).map((d) => ({
            date: d.date,
            price: d.price,
            isPrediction: false,
        }))

        // Add prediction data
        const predictions = predictionResult.predictions.map((p) => ({
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            predicted: p.predicted_price,
            confidenceLower: p.confidence_lower,
            confidenceUpper: p.confidence_upper,
            isPrediction: true,
        }))

        return [...recentHistory, ...predictions]
    }, [historicalData, predictionResult, showPredictions])

    // Format date based on period
    const formatDate = (timestamp: string, period: string): string => {
        const date = new Date(timestamp)
        if (period === '1d') {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            })
        } else if (period === '5d') {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                hour: '2-digit',
            })
        } else if (['1mo', '3mo'].includes(period)) {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit',
            })
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchQuotes()
    }, [fetchQuotes])

    // Fetch historical data when selection changes
    useEffect(() => {
        fetchHistoricalData()
    }, [fetchHistoricalData])

    // Auto-refresh every 60 seconds
    useEffect(() => {
        const interval = setInterval(fetchQuotes, 60000)
        return () => clearInterval(interval)
    }, [fetchQuotes])

    // Add stock to watchlist
    const addStock = async () => {
        const symbol = searchQuery.toUpperCase().trim()
        if (!symbol || watchlist.includes(symbol)) {
            setSearchQuery('')
            setIsAddingStock(false)
            return
        }

        try {
            // Verify the stock exists
            const response = await fetch(`${API_BASE}/quote/?symbol=${symbol}`)
            if (!response.ok) {
                alert(`Could not find stock: ${symbol}`)
                return
            }

            const data = await response.json()
            if (data.error) {
                alert(`Could not find stock: ${symbol}`)
                return
            }

            setWatchlist((prev) => [...prev, symbol])
            setQuotes((prev) => ({ ...prev, [symbol]: data }))
            setSelectedStock(symbol)
            setSearchQuery('')
            setIsAddingStock(false)
        } catch (err) {
            alert('Failed to add stock. Please try again.')
        }
    }

    // Remove stock from watchlist
    const removeStock = (symbol: string) => {
        setWatchlist((prev) => prev.filter((s) => s !== symbol))
        if (selectedStock === symbol) {
            const remaining = watchlist.filter((s) => s !== symbol)
            setSelectedStock(remaining[0] || '')
        }
    }

    // Get selected stock details
    const selectedQuote = quotes[selectedStock]

    // Calculate period-based performance from historical data
    const periodPerformance = useMemo(() => {
        if (historicalData.length < 2) {
            return { change: 0, changePercent: 0, isPositive: true }
        }
        const startPrice = historicalData[0].price
        const endPrice = historicalData[historicalData.length - 1].price
        const change = endPrice - startPrice
        const changePercent = (change / startPrice) * 100
        return {
            change,
            changePercent,
            isPositive: change >= 0
        }
    }, [historicalData])

    // Chart color based on period performance
    const chartColor = periodPerformance.isPositive
        ? '#10b981'  // Emerald 500 - positive
        : '#ef4444'  // Red 500 - negative

    return (
        <section className="apple-page pt-28 pb-16">
            <div className="apple-section max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        to="/projects"
                        className="text-link mb-6"
                    >
                        <ArrowBackIcon sx={{ fontSize: 20 }} />
                        <span>Back to Projects</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="display-heading text-3xl md:text-4xl flex items-center gap-3">
                                <CandlestickChartIcon sx={{ fontSize: 40 }} />
                                Finance Dashboard
                            </h1>
                            <p className="apple-copy mt-2">
                                A personal market tracker for my watchlist, historical charts, and forecast experiments.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {lastUpdated && (
                                <span className="text-xs text-[#86868b]">
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </span>
                            )}
                            <button
                                onClick={fetchQuotes}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1d1d1f] hover:bg-black dark:bg-[#f5f5f7] dark:hover:bg-white dark:text-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-lg transition-colors disabled:opacity-50"
                            >
                                <RefreshIcon
                                    className={isLoading ? 'animate-spin' : ''}
                                    sx={{ fontSize: 18 }}
                                />
                                Refresh
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Error Banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-4 rounded-xl border hairline bg-white p-4 text-[#1d1d1f] dark:bg-[#161617] dark:text-[#f5f5f7] flex items-center gap-3"
                        >
                            <WarningIcon />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Watchlist Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-4 xl:col-span-3"
                    >
                        <div className="apple-card p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Watchlist</h2>
                                <button
                                    onClick={() => setIsAddingStock(true)}
                                    className="p-2 bg-[#1d1d1f] hover:bg-black dark:bg-[#f5f5f7] dark:hover:bg-white dark:text-[#1d1d1f] rounded-lg text-[#d2d2d7] hover:text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors"
                                    title="Add stock"
                                >
                                    <AddIcon sx={{ fontSize: 20 }} />
                                </button>
                            </div>

                            {/* Add Stock Form */}
                            <AnimatePresence>
                                {isAddingStock && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-4"
                                    >
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <SearchIcon
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]"
                                                    sx={{ fontSize: 18 }}
                                                />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(e.target.value.toUpperCase())
                                                    }
                                                    onKeyDown={(e) => e.key === 'Enter' && addStock()}
                                                    placeholder="Enter symbol..."
                                                    className="w-full pl-10 pr-4 py-2 bg-black/5 dark:bg-white/10 border hairline rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-slate-500 focus:outline-none focus:hairline"
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                onClick={addStock}
                                                className="px-4 py-2 bg-[#1d1d1f] hover:bg-black dark:bg-[#f5f5f7] dark:hover:bg-white dark:text-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7] rounded-lg transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingStock(false)
                                                    setSearchQuery('')
                                                }}
                                                className="px-3 py-2 bg-[#1d1d1f] hover:bg-black dark:bg-[#f5f5f7] dark:hover:bg-white dark:text-[#1d1d1f] text-[#d2d2d7] rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Stock Cards */}
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                <AnimatePresence>
                                    {watchlist.map((symbol) => {
                                        const quote = quotes[symbol]
                                        if (!quote || quote.error) {
                                            return (
                                                <motion.div
                                                    key={symbol}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="p-4 bg-slate-900/50 border hairline rounded-xl"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[#86868b] dark:text-[#a1a1a6]">{symbol}</span>
                                                        <button
                                                            onClick={() => removeStock(symbol)}
                                                            className="p-1 text-[#86868b] hover:text-red-400"
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-[#86868b] mt-1">
                                                        {isLoading ? 'Loading...' : 'Unable to load data'}
                                                    </p>
                                                </motion.div>
                                            )
                                        }

                                        return (
                                            <StockCard
                                                key={symbol}
                                                quote={quote}
                                                isSelected={selectedStock === symbol}
                                                onClick={() => setSelectedStock(symbol)}
                                                onRemove={() => removeStock(symbol)}
                                            />
                                        )
                                    })}
                                </AnimatePresence>

                                {watchlist.length === 0 && (
                                    <div className="text-center py-8 text-[#86868b]">
                                        <ShowChartIcon sx={{ fontSize: 48 }} className="mb-3 opacity-50" />
                                        <p>No stocks in watchlist</p>
                                        <p className="text-sm mt-1">
                                            Click the + button to add stocks
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Chart Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-8 xl:col-span-9"
                    >
                        <div className="apple-card p-6">
                            {selectedQuote && !selectedQuote.error ? (
                                <>
                                    {/* Stock Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                                    {selectedQuote.symbol}
                                                </h2>
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${periodPerformance.isPositive
                                                        ? 'bg-emerald-900/50 text-emerald-400'
                                                        : 'bg-red-900/50 text-red-400'
                                                        }`}
                                                >
                                                    {periodPerformance.isPositive ? '+' : ''}
                                                    {periodPerformance.changePercent?.toFixed(2)}%
                                                </span>
                                            </div>
                                            <p className="text-[#86868b] dark:text-[#a1a1a6]">{selectedQuote.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                                ${selectedQuote.price?.toFixed(2)}
                                            </p>
                                            <p
                                                className={`text-sm ${periodPerformance.isPositive
                                                    ? 'text-emerald-400'
                                                    : 'text-red-400'
                                                    }`}
                                            >
                                                {periodPerformance.isPositive ? '+' : ''}$
                                                {periodPerformance.change?.toFixed(2)} ({selectedPeriod.label})
                                            </p>
                                        </div>
                                    </div>

                                    {/* Time Period Selector */}
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        {TIME_PERIODS.map((period) => (
                                            <button
                                                key={period.value}
                                                onClick={() => setSelectedPeriod(period)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedPeriod.value === period.value
                                                    ? 'bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] text-[#1d1d1f] dark:text-[#f5f5f7]'
                                                    : 'bg-black/5 dark:bg-white/10 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/5 dark:bg-white/10'
                                                    }`}
                                            >
                                                {period.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Chart */}
                                    <div className="h-[400px] w-full">
                                        {isChartLoading ? (
                                            <div className="h-full flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500" />
                                            </div>
                                        ) : historicalData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={historicalData}
                                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#334155"
                                                        opacity={0.4}
                                                    />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#475569"
                                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                                        tickLine={{ stroke: '#475569' }}
                                                    />
                                                    <YAxis
                                                        stroke="#475569"
                                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                                        tickLine={{ stroke: '#475569' }}
                                                        domain={['auto', 'auto']}
                                                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                                                    />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="price"
                                                        stroke={chartColor}
                                                        strokeWidth={2}
                                                        fill={chartColor}
                                                        fillOpacity={0.1}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-[#86868b]">
                                                No chart data available
                                            </div>
                                        )}
                                    </div>

                                    {/* Stock Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t hairline">
                                        <DetailCard
                                            label="Open"
                                            value={`$${selectedQuote.open?.toFixed(2) || '-'}`}
                                        />
                                        <DetailCard
                                            label="Previous Close"
                                            value={`$${selectedQuote.previousClose?.toFixed(2) || '-'}`}
                                        />
                                        <DetailCard
                                            label="Day High"
                                            value={`$${selectedQuote.dayHigh?.toFixed(2) || '-'}`}
                                        />
                                        <DetailCard
                                            label="Day Low"
                                            value={`$${selectedQuote.dayLow?.toFixed(2) || '-'}`}
                                        />
                                        <DetailCard
                                            label="52W High"
                                            value={`$${selectedQuote['52WeekHigh']?.toFixed(2) || '-'}`}
                                        />
                                        <DetailCard
                                            label="52W Low"
                                            value={`$${selectedQuote['52WeekLow']?.toFixed(2) || '-'}`}
                                        />
                                        <DetailCard
                                            label="Volume"
                                            value={formatVolume(selectedQuote.volume)}
                                        />
                                        <DetailCard
                                            label="Market Cap"
                                            value={formatMarketCap(selectedQuote.marketCap)}
                                        />
                                        <DetailCard
                                            label="P/E Ratio"
                                            value={selectedQuote.peRatio?.toFixed(2) || '-'}
                                        />
                                        <DetailCard
                                            label="EPS"
                                            value={
                                                selectedQuote.eps
                                                    ? `$${selectedQuote.eps.toFixed(2)}`
                                                    : '-'
                                            }
                                        />
                                        <DetailCard
                                            label="Dividend Yield"
                                            value={
                                                selectedQuote.dividendYield
                                                    ? `${(selectedQuote.dividendYield * 100).toFixed(2)}%`
                                                    : '-'
                                            }
                                        />
                                        <DetailCard
                                            label="Sector"
                                            value={selectedQuote.sector || '-'}
                                        />
                                    </div>

                                    {/* ML Predictions Panel */}
                                    <div className="mt-6 pt-6 border-t hairline">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <PsychologyIcon className="text-purple-400" />
                                                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                                                    ML Price Predictions
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => setShowPredictions(!showPredictions)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showPredictions
                                                        ? 'bg-purple-600 text-[#1d1d1f] dark:text-[#f5f5f7]'
                                                        : 'bg-black/5 dark:bg-white/10 text-[#d2d2d7] hover:bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f]'
                                                    }`}
                                            >
                                                {showPredictions ? (
                                                    <>
                                                        <CloseIcon sx={{ fontSize: 18 }} />
                                                        Hide Predictions
                                                    </>
                                                ) : (
                                                    <>
                                                        <PsychologyIcon sx={{ fontSize: 18 }} />
                                                        Show Predictions
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {showPredictions && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {/* Educational Disclaimer - BOLD AND PROMINENT */}
                                                    <div className="mb-6 p-4 bg-amber-900/40 border-2 border-amber-500 rounded-xl">
                                                        <div className="flex items-start gap-3">
                                                            <WarningIcon className="text-amber-400 shrink-0 mt-0.5" sx={{ fontSize: 24 }} />
                                                            <div>
                                                                <p className="text-amber-300 font-bold text-base mb-2">
                                                                    FOR EDUCATIONAL PURPOSES ONLY
                                                                </p>
                                                                <p className="text-amber-200/90 text-sm leading-relaxed">
                                                                    These ML predictions are for <strong>learning and testing purposes ONLY</strong>.
                                                                    They should <strong>NOT</strong> be used as financial advice or for making
                                                                    investment decisions. Past performance does not guarantee future results.
                                                                    Always consult a qualified financial advisor before making investment decisions.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Model Configuration */}
                                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                                        {/* Model Selection */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] mb-2">
                                                                ML Model
                                                            </label>
                                                            <select
                                                                value={selectedModel}
                                                                onChange={(e) => setSelectedModel(e.target.value)}
                                                                className="w-full px-4 py-2 bg-black/5 dark:bg-white/10 border hairline rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:border-purple-500"
                                                            >
                                                                {Object.entries(mlModels).map(([key, model]) => (
                                                                    <option key={key} value={key}>
                                                                        {model.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <p className="text-xs text-[#86868b] mt-1">
                                                                {mlModels[selectedModel]?.description}
                                                            </p>
                                                        </div>

                                                        {/* Forecast Horizon */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-[#86868b] dark:text-[#a1a1a6] mb-2">
                                                                Forecast Horizon
                                                            </label>
                                                            <select
                                                                value={forecastHorizon}
                                                                onChange={(e) => setForecastHorizon(Number(e.target.value))}
                                                                className="w-full px-4 py-2 bg-black/5 dark:bg-white/10 border hairline rounded-lg text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:border-purple-500"
                                                            >
                                                                {FORECAST_HORIZONS.map((horizon) => (
                                                                    <option key={horizon.value} value={horizon.value}>
                                                                        {horizon.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <p className="text-xs text-[#86868b] mt-1">
                                                                Days to predict into the future
                                                            </p>
                                                        </div>

                                                        {/* Run Prediction Button */}
                                                        <div className="flex flex-col justify-end">
                                                            <button
                                                                onClick={fetchPredictions}
                                                                disabled={isPredicting}
                                                                className="flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-[#1d1d1f] dark:text-[#f5f5f7] rounded-lg font-medium transition-colors"
                                                            >
                                                                {isPredicting ? (
                                                                    <>
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                                                        Running...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <PlayArrowIcon sx={{ fontSize: 20 }} />
                                                                        Run Prediction
                                                                    </>
                                                                )}
                                                            </button>
                                                            <p className="text-xs text-[#86868b] mt-1 text-center">
                                                                Max 30 seconds to train
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Hyperparameters Toggle */}
                                                    <div className="mb-6">
                                                        <button
                                                            onClick={() => setShowHyperparameters(!showHyperparameters)}
                                                            className="flex items-center gap-2 text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors text-sm"
                                                        >
                                                            <TuneIcon sx={{ fontSize: 18 }} />
                                                            <span>Advanced: Hyperparameters</span>
                                                            {showHyperparameters ? (
                                                                <ExpandLessIcon sx={{ fontSize: 18 }} />
                                                            ) : (
                                                                <ExpandMoreIcon sx={{ fontSize: 18 }} />
                                                            )}
                                                        </button>

                                                        <AnimatePresence>
                                                            {showHyperparameters && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    className="mt-4 p-4 bg-black/5 dark:bg-white/10 rounded-lg"
                                                                >
                                                                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                                                        {Object.entries(mlModels[selectedModel]?.hyperparameters || {}).map(
                                                                            ([key, config]) => (
                                                                                <div key={key}>
                                                                                    <label className="block text-xs font-medium text-[#86868b] dark:text-[#a1a1a6] mb-1">
                                                                                        {config.name}
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={hyperparameters[key] ?? config.default}
                                                                                        onChange={(e) =>
                                                                                            setHyperparameters((prev) => ({
                                                                                                ...prev,
                                                                                                [key]: Number(e.target.value),
                                                                                            }))
                                                                                        }
                                                                                        min={config.min}
                                                                                        max={config.max}
                                                                                        step={config.step || 1}
                                                                                        className="w-full px-3 py-1.5 bg-[#1d1d1f] dark:bg-[#f5f5f7] dark:text-[#1d1d1f] border hairline rounded text-[#1d1d1f] dark:text-[#f5f5f7] text-sm focus:outline-none focus:border-purple-500"
                                                                                    />
                                                                                    <p className="text-xs text-[#86868b] mt-0.5">
                                                                                        Range: {config.min} - {config.max}
                                                                                    </p>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-[#86868b] mt-3">
                                                                        Values are constrained to prevent excessive resource usage.
                                                                    </p>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Prediction Error */}
                                                    {predictionError && (
                                                        <div className="mb-6 p-4 rounded-xl border hairline bg-white p-4 text-[#1d1d1f] dark:bg-[#161617] dark:text-[#f5f5f7] flex items-center gap-3">
                                                            <WarningIcon />
                                                            <span>{predictionError}</span>
                                                        </div>
                                                    )}

                                                    {/* Prediction Results */}
                                                    {predictionResult && (
                                                        <div className="space-y-4">
                                                            {/* Prediction Chart */}
                                                            <div className="bg-black/5 dark:bg-white/10 rounded-xl p-4">
                                                                <h4 className="text-sm font-medium text-[#d2d2d7] mb-4">
                                                                    Price Forecast - {mlModels[selectedModel]?.name} ({forecastHorizon} days)
                                                                </h4>
                                                                <div className="h-[300px] w-full">
                                                                    <ResponsiveContainer width="100%" height="100%">
                                                                        <AreaChart
                                                                            data={combinedChartData}
                                                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                                                        >
                                                                            <CartesianGrid
                                                                                strokeDasharray="3 3"
                                                                                stroke="#334155"
                                                                                opacity={0.4}
                                                                            />
                                                                            <XAxis
                                                                                dataKey="date"
                                                                                stroke="#475569"
                                                                                tick={{ fill: '#64748b', fontSize: 11 }}
                                                                                tickLine={{ stroke: '#475569' }}
                                                                            />
                                                                            <YAxis
                                                                                stroke="#475569"
                                                                                tick={{ fill: '#64748b', fontSize: 11 }}
                                                                                tickLine={{ stroke: '#475569' }}
                                                                                domain={['auto', 'auto']}
                                                                                tickFormatter={(value) => `$${value.toFixed(0)}`}
                                                                            />
                                                                            <Tooltip
                                                                                content={({ active, payload, label }) => {
                                                                                    if (active && payload && payload.length) {
                                                                                        const data = payload[0].payload
                                                                                        return (
                                                                                            <div className="apple-card-solid px-4 py-3 shadow-xl">
                                                                                                <p className="text-[#86868b] text-xs mb-1">{label}</p>
                                                                                                {data.price && (
                                                                                                    <p className="text-emerald-400 font-semibold">
                                                                                                        Actual: ${data.price?.toFixed(2)}
                                                                                                    </p>
                                                                                                )}
                                                                                                {data.predicted && (
                                                                                                    <>
                                                                                                        <p className="text-purple-400 font-semibold">
                                                                                                            Predicted: ${data.predicted?.toFixed(2)}
                                                                                                        </p>
                                                                                                        <p className="text-[#86868b] text-xs mt-1">
                                                                                                            Range: ${data.confidenceLower?.toFixed(2)} - ${data.confidenceUpper?.toFixed(2)}
                                                                                                        </p>
                                                                                                    </>
                                                                                                )}
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                    return null
                                                                                }}
                                                                            />
                                                                            {/* Historical Price */}
                                                                            <Area
                                                                                type="monotone"
                                                                                dataKey="price"
                                                                                stroke="#10b981"
                                                                                strokeWidth={2}
                                                                                fill="#10b981"
                                                                                fillOpacity={0.1}
                                                                                name="Historical"
                                                                            />
                                                                            {/* Confidence Interval */}
                                                                            <Area
                                                                                type="monotone"
                                                                                dataKey="confidenceUpper"
                                                                                stroke="transparent"
                                                                                fill="#a855f7"
                                                                                fillOpacity={0.1}
                                                                            />
                                                                            <Area
                                                                                type="monotone"
                                                                                dataKey="confidenceLower"
                                                                                stroke="transparent"
                                                                                fill="#1e1b4b"
                                                                                fillOpacity={1}
                                                                            />
                                                                            {/* Predicted Price */}
                                                                            <Area
                                                                                type="monotone"
                                                                                dataKey="predicted"
                                                                                stroke="#a855f7"
                                                                                strokeWidth={2}
                                                                                strokeDasharray="5 5"
                                                                                fill="#a855f7"
                                                                                fillOpacity={0.2}
                                                                                name="Predicted"
                                                                            />
                                                                        </AreaChart>
                                                                    </ResponsiveContainer>
                                                                </div>
                                                                <div className="flex items-center gap-6 mt-3 text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-4 h-0.5 bg-emerald-500" />
                                                                        <span className="text-[#86868b] dark:text-[#a1a1a6]">Historical</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-4 h-0.5 bg-purple-500 border-dashed" style={{ borderTop: '2px dashed #a855f7' }} />
                                                                        <span className="text-[#86868b] dark:text-[#a1a1a6]">Predicted</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-4 h-3 bg-purple-500/20 rounded" />
                                                                        <span className="text-[#86868b] dark:text-[#a1a1a6]">95% Confidence</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Model Info */}
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                {/* Prediction Summary */}
                                                                <div className="bg-black/5 dark:bg-white/10 rounded-xl p-4">
                                                                    <h4 className="text-sm font-medium text-[#d2d2d7] mb-3">
                                                                        Prediction Summary
                                                                    </h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        <div className="flex justify-between">
                                                                            <span className="text-[#86868b] dark:text-[#a1a1a6]">Last Actual Price:</span>
                                                                            <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">
                                                                                ${predictionResult.last_actual_price.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-[#86868b] dark:text-[#a1a1a6]">Final Predicted:</span>
                                                                            <span className="text-purple-400 font-medium">
                                                                                ${predictionResult.predictions[predictionResult.predictions.length - 1]?.predicted_price.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-[#86868b] dark:text-[#a1a1a6]">Training Points:</span>
                                                                            <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">{predictionResult.training_points}</span>
                                                                        </div>
                                                                        <div className="flex justify-between">
                                                                            <span className="text-[#86868b] dark:text-[#a1a1a6]">Execution Time:</span>
                                                                            <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">{predictionResult.execution_time_seconds}s</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Model Metrics */}
                                                                <div className="bg-black/5 dark:bg-white/10 rounded-xl p-4">
                                                                    <h4 className="text-sm font-medium text-[#d2d2d7] mb-3">
                                                                        Model Metrics
                                                                    </h4>
                                                                    <div className="space-y-2 text-sm">
                                                                        {Object.entries(predictionResult.model_info)
                                                                            .filter(([key]) => key !== 'feature_importance')
                                                                            .map(([key, value]) => (
                                                                                <div key={key} className="flex justify-between">
                                                                                    <span className="text-[#86868b] dark:text-[#a1a1a6] capitalize">
                                                                                        {key.replace(/_/g, ' ')}:
                                                                                    </span>
                                                                                    <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">
                                                                                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Prediction Table */}
                                                            <div className="bg-black/5 dark:bg-white/10 rounded-xl p-4 overflow-x-auto">
                                                                <h4 className="text-sm font-medium text-[#d2d2d7] mb-3">
                                                                    Daily Predictions
                                                                </h4>
                                                                <table className="w-full text-sm">
                                                                    <thead>
                                                                        <tr className="text-[#86868b] dark:text-[#a1a1a6] text-left">
                                                                            <th className="pb-2 font-medium">Date</th>
                                                                            <th className="pb-2 font-medium text-right">Predicted</th>
                                                                            <th className="pb-2 font-medium text-right">Lower (95%)</th>
                                                                            <th className="pb-2 font-medium text-right">Upper (95%)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {predictionResult.predictions.map((pred, idx) => (
                                                                            <tr key={idx} className="border-t hairline/50">
                                                                                <td className="py-2 text-[#d2d2d7]">
                                                                                    {new Date(pred.date).toLocaleDateString('en-US', {
                                                                                        weekday: 'short',
                                                                                        month: 'short',
                                                                                        day: 'numeric',
                                                                                    })}
                                                                                </td>
                                                                                <td className="py-2 text-right text-purple-400 font-medium">
                                                                                    ${pred.predicted_price.toFixed(2)}
                                                                                </td>
                                                                                <td className="py-2 text-right text-[#86868b]">
                                                                                    ${pred.confidence_lower.toFixed(2)}
                                                                                </td>
                                                                                <td className="py-2 text-right text-[#86868b]">
                                                                                    ${pred.confidence_upper.toFixed(2)}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* Reminder Disclaimer */}
                                                            <div className="p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
                                                                <p className="text-amber-300/80 text-xs text-center font-medium">
                                                                    Reminder: These predictions are for educational purposes only and should not be used for investment decisions.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            ) : (
                                <div className="h-[600px] flex flex-col items-center justify-center text-[#86868b]">
                                    <ShowChartIcon sx={{ fontSize: 64 }} className="mb-4 opacity-50" />
                                    <p className="text-xl">Select a stock to view details</p>
                                    <p className="text-sm mt-2">
                                        Add stocks to your watchlist to get started
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Info Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-6 p-4 bg-slate-900/30 border hairline rounded-xl flex items-start gap-3"
                        >
                            <InfoIcon className="text-[#86868b] shrink-0 mt-0.5" />
                            <div className="text-sm text-[#86868b] dark:text-[#a1a1a6]">
                                <p className="font-medium text-[#d2d2d7] mb-1">
                                    About This Dashboard
                                </p>
                                <p>
                                    Stock data is provided by Yahoo Finance and refreshes automatically
                                    every minute. Data may be delayed up to 15 minutes for some
                                    exchanges. This dashboard is for educational and informational
                                    purposes only and should not be considered financial advice.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// Helper Components
const DetailCard = memo(({ label, value }: { label: string; value: string }) => (
    <div className="p-3 bg-black/5 dark:bg-white/10/30 rounded-lg">
        <p className="text-xs text-[#86868b] mb-1">{label}</p>
        <p className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">{value}</p>
    </div>
))
DetailCard.displayName = 'DetailCard'

// Helper Functions
function formatVolume(volume: number): string {
    if (!volume) return '-'
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
    return volume.toString()
}

function formatMarketCap(marketCap: number): string {
    if (!marketCap) return '-'
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
}
