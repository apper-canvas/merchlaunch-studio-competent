import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Loading = ({ 
  variant = 'default',
  message = 'Loading...',
  className = '' 
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 bg-gradient-to-r from-primary to-indigo-600 rounded-lg flex items-center justify-center mb-4"
      >
        <ApperIcon name="Loader2" size={24} className="text-white" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-secondary mb-2">
        {message}
      </h3>
      
      <div className="flex space-x-1">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: index * 0.2 
            }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        ))}
      </div>
    </div>
  )
}

export default Loading