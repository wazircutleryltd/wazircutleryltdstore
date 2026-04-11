'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Inbox, RefreshCcw } from 'lucide-react';

export const LoadingState = ({ message = "Loading...", minHeight = "h-64" }) => (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center space-y-4`}>
        <motion.div
            animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
            }}
            transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 border-4 border-[#D6AF66]/20 border-t-[#D6AF66] rounded-full shadow-lg shadow-[#D6AF66]/10"
        />
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 font-medium outfit-font tracking-wide"
        >
            {message}
        </motion.p>
    </div>
);

export const ErrorState = ({ 
    message = "Something went wrong. Please try again.", 
    minHeight = "h-64",
    onRetry = () => window.location.reload()
}) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full ${minHeight} flex flex-col items-center justify-center p-6 text-center`}
    >
        <div className="bg-red-50 p-4 rounded-full mb-4 shadow-inner">
            <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Unexpected Error</h3>
        <p className="text-gray-500 max-w-xs mb-6 outfit-font">{message}</p>
        <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D6AF66] text-white rounded-xl font-semibold hover:bg-[#C19A5A] transition-all active:scale-95 shadow-lg shadow-[#D6AF66]/20 cursor-pointer"
        >
            <RefreshCcw className="h-4 w-4" />
            Try Again
        </button>
    </motion.div>
);

export const NoDataState = ({ 
    message = "No data found", 
    description = "We couldn't find what you're looking for.",
    minHeight = "h-64" 
}) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full ${minHeight} flex flex-col items-center justify-center p-6 text-center`}
    >
        <div className="bg-gray-50 p-6 rounded-3xl mb-4 border border-gray-100 shadow-sm">
            <Inbox className="h-12 w-12 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-400 max-w-xs outfit-font">{description}</p>
    </motion.div>
);
