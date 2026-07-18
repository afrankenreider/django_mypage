import { motion } from 'framer-motion'

/**
 * Loading fallback component displayed during lazy-loaded route transitions.
 * Provides a smooth loading experience with animated skeleton.
 */
export default function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0c]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
            >
                {/* Animated loading spinner */}
                <div className="relative w-12 h-12">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#d2d2d7] dark:border-[#2c2c2e]"
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1d1d1f] dark:border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-[#86868b] dark:text-[#a1a1a6]"
                >
                    Loading...
                </motion.p>
            </motion.div>
        </div>
    )
}
