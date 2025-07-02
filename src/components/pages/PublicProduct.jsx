import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ProductPreview from '@/components/molecules/ProductPreview'
import OrderForm from '@/components/molecules/OrderForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { campaignService } from '@/services/api/campaignService'
import { orderService } from '@/services/api/orderService'

const PublicProduct = () => {
  const { campaignId } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [orders, setOrders] = useState([])
  const [previewView, setPreviewView] = useState('front')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const [campaignData, ordersData] = await Promise.all([
        campaignService.getById(parseInt(campaignId)),
        orderService.getAll()
      ])
      
      if (!campaignData) {
        setError('Campaign not found')
        return
      }
      
      setCampaign(campaignData)
      setOrders(ordersData.filter(order => order.campaignId === parseInt(campaignId)))
    } catch (error) {
      setError('Failed to load campaign. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [campaignId])

  const handleOrderSubmit = async (orderData) => {
    try {
      const newOrder = await orderService.create(orderData)
      setOrders(prev => [...prev, newOrder])
      return newOrder
    } catch (error) {
      throw new Error('Failed to place order')
    }
  }

  const totalOrders = orders.reduce((sum, order) => sum + order.quantity, 0)
  const totalRevenue = orders.reduce((sum, order) => sum + (order.quantity * campaign?.pricing || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Loading message="Loading product..." />
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Error 
            message={error || 'Campaign not found'}
            showRetry={false}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shirt" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-secondary">
                  MerchLaunch
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Studio</p>
              </div>
            </div>
            
            <Badge variant="primary" icon="ShoppingCart">
              Preorder Campaign
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Preview */}
          <div className="space-y-6">
            <ProductPreview
              design={campaign.designData}
              productType={campaign.productType}
              view={previewView}
              onViewChange={setPreviewView}
            />
            
            {/* Campaign Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">
                Campaign Progress
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Total Raised</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Minimum for production:</span>
                  <span className="font-medium">25 items</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((totalOrders / 25) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalOrders >= 25 ? 'Ready for production!' : `${25 - totalOrders} more needed`}
                </p>
              </div>
            </Card>
          </div>

          {/* Order Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary mb-2">
                Custom {campaign.productType === 'tshirt' ? 'T-Shirt' : 'Mug'} Design
              </h1>
              <p className="text-gray-600">
                Limited preorder campaign - support this design and get yours when we reach the minimum quantity!
              </p>
            </div>

            <OrderForm
              campaign={campaign}
              onOrderSubmit={handleOrderSubmit}
            />

            {/* Product Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">
                Product Details
              </h3>
              
              <div className="space-y-3">
                {campaign.productType === 'tshirt' ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Shirt" size={16} className="text-gray-400" />
                      <span className="text-sm">100% Cotton, Unisex Fit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Palette" size={16} className="text-gray-400" />
                      <span className="text-sm">High-quality screen printing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Truck" size={16} className="text-gray-400" />
                      <span className="text-sm">2-3 weeks production + shipping</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Coffee" size={16} className="text-gray-400" />
                      <span className="text-sm">11oz Ceramic Mug</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Sparkles" size={16} className="text-gray-400" />
                      <span className="text-sm">Dishwasher & microwave safe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Truck" size={16} className="text-gray-400" />
                      <span className="text-sm">2-3 weeks production + shipping</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Guarantee */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/20">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name="Shield" size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary mb-1">Preorder Guarantee</h4>
                  <p className="text-sm text-gray-600">
                    You'll only be charged when this campaign reaches its minimum quantity of 25 items. 
                    If we don't hit the target, you won't be charged at all.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PublicProduct