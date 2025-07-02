import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  icon = 'Package',
  actionLabel = 'Get Started',
  onAction,
  showAction = true,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-secondary mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 flex items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Zap" size={16} />
          <span>Quick Setup</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Shield" size={16} />
          <span>Secure Platform</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Users" size={16} />
          <span>Trusted by Creators</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty