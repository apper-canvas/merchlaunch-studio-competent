import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { campaignService } from '@/services/api/campaignService'
import { orderService } from '@/services/api/orderService'

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const [campaignsData, ordersData] = await Promise.all([
        campaignService.getAll(),
        orderService.getAll()
      ])
      
      setCampaigns(campaignsData)
      setOrders(ordersData)
    } catch (error) {
      setError('Failed to load campaigns. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return
    }

    try {
      await campaignService.delete(campaignId) 
      setCampaigns(prev => prev.filter(campaign => campaign.Id !== campaignId))
      toast.success('Campaign deleted successfully')
    } catch (error) {
      toast.error('Failed to delete campaign')
    }
  }

  const getCampaignStats = (campaignId) => {
    const campaignOrders = orders.filter(order => order.campaignId === campaignId)
    const totalOrders = campaignOrders.length
    const totalRevenue = campaignOrders.reduce((sum, order) => 
      sum + (order.quantity * getCampaignPrice(campaignId)), 0
    )
    
    return { totalOrders, totalRevenue }
  }

  const getCampaignPrice = (campaignId) => {
    const campaign = campaigns.find(c => c.Id === campaignId)
    return campaign?.pricing || 0
  }

  const getStatusColor = (orderCount) => {
    if (orderCount === 0) return 'secondary'
    if (orderCount < 10) return 'warning' 
    if (orderCount < 25) return 'primary'
    return 'success'
  }

  const getStatusText = (orderCount) => {
    if (orderCount === 0) return 'No Orders'
    if (orderCount < 10) return 'Getting Started'
    if (orderCount < 25) return 'Building Momentum'
    return 'Ready to Print'
  }

  if (isLoading) {
    return <Loading variant="skeleton" message="Loading your campaigns..." />
  }

  if (error) {
    return <Error message={error} onRetry={fetchData} />
  }

  if (campaigns.length === 0) {
    return (
      <Empty
        title="No campaigns yet"
        description="Create your first custom merchandise campaign and start collecting preorders from your audience"
        icon="Palette"
        actionLabel="Create First Campaign"
        onAction={() => window.location.href = '/'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">
            My Campaigns
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your merchandise campaigns and track performance
          </p>
        </div>
        
        <Link to="/">
          <Button variant="primary" icon="Plus">
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-secondary">{campaigns.length}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="FolderOpen" size={20} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-secondary">{orders.length}</p>
            </div>
            <div className="p-2 bg-success/10 rounded-lg">
              <ApperIcon name="ShoppingBag" size={20} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary">
                ${orders.reduce((sum, order) => sum + (order.quantity * getCampaignPrice(order.campaignId)), 0).toFixed(2)}
              </p>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">
              <ApperIcon name="DollarSign" size={20} className="text-accent" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-secondary">
                ${orders.length > 0 ? (orders.reduce((sum, order) => sum + (order.quantity * getCampaignPrice(order.campaignId)), 0) / orders.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="p-2 bg-info/10 rounded-lg">
              <ApperIcon name="TrendingUp" size={20} className="text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => {
          const stats = getCampaignStats(campaign.Id)
          
          return (
            <motion.div
              key={campaign.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="elevated" className="overflow-hidden">
                {/* Campaign Preview */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                  <img
                    src={campaign.productType === 'tshirt' ? '/api/placeholder/200/240' : '/api/placeholder/200/200'}
                    alt={`${campaign.productType} design`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Campaign Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary" icon={campaign.productType === 'tshirt' ? 'Shirt' : 'Coffee'}>
                      {campaign.productType === 'tshirt' ? 'T-Shirt' : 'Mug'}
                    </Badge>
                    <Badge variant={getStatusColor(stats.totalOrders)}>
                      {getStatusText(stats.totalOrders)}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-secondary mb-2">
                    Custom {campaign.productType === 'tshirt' ? 'T-Shirt' : 'Mug'} Design
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Orders</p>
                      <p className="font-bold text-lg">{stats.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-bold text-lg text-success">${stats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(campaign.shareUrl)
                        toast.success('Share link copied!')
                      }}
                      variant="outline"
                      size="sm"
                      icon="Share"
                      className="flex-1"
                    >
                      Share
                    </Button>
                    <Button
                      onClick={() => handleDeleteCampaign(campaign.Id)}
                      variant="outline"
                      size="sm"
                      icon="Trash2"
                      className="text-error hover:text-error hover:border-error"
                    >
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center">
                    <ApperIcon name="Calendar" size={12} className="mr-1" />
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default MyCampaigns