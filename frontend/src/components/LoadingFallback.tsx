import { motion } from 'framer-motion'

/**
 * Loading fallback component displayed during lazy-loaded route transitions.
 * Provides a smooth loading experience with animated skeleton.
 */
export default function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
            >
                {/* Animated loading spinner */}
                <div className="relative w-12 h-12">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-800"
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-900 dark:border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-slate-500 dark:text-slate-400"
                >
                    Loading...
                </motion.p>
            </motion.div>
        </div>
    )
}
