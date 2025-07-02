import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = 'Something went wrong',
  onRetry,
  showRetry = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-center py-12 ${className}`}
    >
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h3 className="text-xl font-bold text-secondary mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <div className="space-y-3">
            <Button
              onClick={onRetry}
              variant="primary"
              icon="RefreshCw"
              className="w-full"
            >
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If the problem persists, please contact support
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

export default Error