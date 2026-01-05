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

// API base URL
const API_BASE = '/api/stocks'

// Default watchlist
const DEFAULT_WATCHLIST = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA']

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
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-3 shadow-xl">
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="text-slate-100 font-semibold text-lg">
                    ${payload[0].value?.toFixed(2)}
                </p>
                {payload[1] && (
                    <p className="text-slate-400 text-xs mt-1">
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
                ? 'bg-slate-800 border-2 border-slate-600'
                : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
                }`}
        >
            {/* Remove button */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
                title="Remove from watchlist"
            >
                <DeleteIcon sx={{ fontSize: 16 }} />
            </button>

            <div className="flex items-start justify-between mb-2 pr-6">
                <div>
                    <h3 className="font-semibold text-white">{quote.symbol}</h3>
                    <p className="text-xs text-slate-400 truncate max-w-[120px]">
                        {quote.name}
                    </p>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <p className="text-xl font-bold text-white">
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
        <section className="min-h-screen pt-24 pb-16 bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowBackIcon sx={{ fontSize: 20 }} />
                        <span>Back to Projects</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                                <CandlestickChartIcon sx={{ fontSize: 40 }} />
                                Finance Dashboard
                            </h1>
                            <p className="text-slate-400 mt-2">
                                Real-time stock tracking and analysis
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {lastUpdated && (
                                <span className="text-xs text-slate-500">
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </span>
                            )}
                            <button
                                onClick={fetchQuotes}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50"
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
                            className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl flex items-center gap-3 text-red-300"
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
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Watchlist</h2>
                                <button
                                    onClick={() => setIsAddingStock(true)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
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
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
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
                                                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-slate-600"
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                onClick={addStock}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsAddingStock(false)
                                                    setSearchQuery('')
                                                }}
                                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
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
                                                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-400">{symbol}</span>
                                                        <button
                                                            onClick={() => removeStock(symbol)}
                                                            className="p-1 text-slate-500 hover:text-red-400"
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 16 }} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">
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
                                    <div className="text-center py-8 text-slate-500">
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
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                            {selectedQuote && !selectedQuote.error ? (
                                <>
                                    {/* Stock Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-2xl font-bold text-white">
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
                                            <p className="text-slate-400">{selectedQuote.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-white">
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
                                                    ? 'bg-slate-700 text-white'
                                                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
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
                                            <div className="h-full flex items-center justify-center text-slate-500">
                                                No chart data available
                                            </div>
                                        )}
                                    </div>

                                    {/* Stock Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
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
                                </>
                            ) : (
                                <div className="h-[600px] flex flex-col items-center justify-center text-slate-500">
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
                            className="mt-6 p-4 bg-slate-900/30 border border-slate-800 rounded-xl flex items-start gap-3"
                        >
                            <InfoIcon className="text-slate-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-slate-400">
                                <p className="font-medium text-slate-300 mb-1">
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
    <div className="p-3 bg-slate-800/30 rounded-lg">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-white truncate">{value}</p>
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
