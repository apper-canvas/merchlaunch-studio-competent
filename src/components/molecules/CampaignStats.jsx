import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const CampaignStats = ({ 
  campaign, 
  orders = [],
  className = '' 
}) => {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.quantity * campaign.pricing), 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  // Size distribution for t-shirts
  const sizeDistribution = campaign.productType === 'tshirt' 
    ? orders.reduce((acc, order) => {
        acc[order.size] = (acc[order.size] || 0) + order.quantity
        return acc
      }, {})
    : {}

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: 'ShoppingBag',
      color: 'primary',
      change: '+12%'
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: 'DollarSign',
      color: 'success',
      change: '+8%'
    },
    {
      label: 'Avg Order',
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: 'TrendingUp',
      color: 'accent',
      change: '+3%'
    },
    {
      label: 'Conversion',
      value: '12.5%',
      icon: 'Target',
      color: 'primary',
      change: '+2%'
    }
  ]

  return (
    <div className={className}>
      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                  <ApperIcon 
                    name={stat.icon} 
                    size={20} 
                    className={`text-${stat.color}`} 
                  />
                </div>
                <Badge variant="success" size="sm">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Size Distribution (T-shirts only) */}
      {campaign.productType === 'tshirt' && Object.keys(sizeDistribution).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2" />
            Size Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(sizeDistribution).map(([size, count]) => {
              const percentage = (count / totalOrders) * 100
              return (
                <div key={size} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-secondary w-8">{size}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-gradient-to-r from-primary to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-secondary">{count}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

export default CampaignStats