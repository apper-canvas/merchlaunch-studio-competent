import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { orderService } from '@/services/api/orderService'
import { campaignService } from '@/services/api/campaignService'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const [ordersData, campaignsData] = await Promise.all([
        orderService.getAll(),
        campaignService.getAll()
      ])
      
      setOrders(ordersData)
      setCampaigns(campaignsData)
    } catch (error) {
      setError('Failed to load orders. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getCampaignDetails = (campaignId) => {
    return campaigns.find(campaign => campaign.Id === campaignId)
  }

  const getFilteredOrders = () => {
    if (selectedFilter === 'all') return orders
    
    return orders.filter(order => {
      const campaign = getCampaignDetails(order.campaignId)
      return campaign?.productType === selectedFilter
    })
  }

  const handleExportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer Name', 'Email', 'Product', 'Size', 'Quantity', 'Total', 'Date'].join(','),
      ...getFilteredOrders().map(order => {
        const campaign = getCampaignDetails(order.campaignId)
        return [
          order.Id,
          order.customerName,
          order.customerEmail,
          campaign?.productType || 'Unknown',
          order.size,
          order.quantity,
          `$${(order.quantity * (campaign?.pricing || 0)).toFixed(2)}`,
          format(new Date(order.timestamp), 'yyyy-MM-dd HH:mm')
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Orders exported successfully!')
  }

  const filters = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'tshirt', label: 'T-Shirts', count: orders.filter(order => getCampaignDetails(order.campaignId)?.productType === 'tshirt').length },
    { id: 'mug', label: 'Mugs', count: orders.filter(order => getCampaignDetails(order.campaignId)?.productType === 'mug').length }
  ]

  const totalRevenue = getFilteredOrders().reduce((sum, order) => {
    const campaign = getCampaignDetails(order.campaignId)
    return sum + (order.quantity * (campaign?.pricing || 0))
  }, 0)

  const totalItems = getFilteredOrders().reduce((sum, order) => sum + order.quantity, 0)

  if (isLoading) {
    return <Loading variant="skeleton" message="Loading orders..." />
  }

  if (error) {
    return <Error message={error} onRetry={fetchData} />
  }

  if (orders.length === 0) {
    return (
      <Empty
        title="No orders yet"
        description="Orders will appear here once customers start placing preorders for your merchandise campaigns"
        icon="ShoppingBag"
        actionLabel="View Campaigns"
        onAction={() => window.location.href = '/campaigns'}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">
            Orders Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage all your merchandise preorders
          </p>
        </div>
        
        <Button 
          onClick={handleExportOrders}
          variant="outline" 
          icon="Download"
        >
          Export Orders
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-secondary">{getFilteredOrders().length}</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <ApperIcon name="ShoppingBag" size={20} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-secondary">{totalItems}</p>
            </div>
            <div className="p-2 bg-success/10 rounded-lg">
              <ApperIcon name="Package" size={20} className="text-success" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-secondary">${totalRevenue.toFixed(2)}</p>
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
                ${getFilteredOrders().length > 0 ? (totalRevenue / getFilteredOrders().length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="p-2 bg-info/10 rounded-lg">
              <ApperIcon name="TrendingUp" size={20} className="text-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </Card>

      {/* Orders List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-secondary">Order Details</th>
                <th className="text-left px-6 py-4 font-medium text-secondary">Customer</th>
                <th className="text-left px-6 py-4 font-medium text-secondary">Product</th>
                <th className="text-right px-6 py-4 font-medium text-secondary">Total</th>
                <th className="text-right px-6 py-4 font-medium text-secondary">Date</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredOrders().map((order, index) => {
                const campaign = getCampaignDetails(order.campaignId)
                const orderTotal = order.quantity * (campaign?.pricing || 0)
                
                return (
                  <tr key={order.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                          <ApperIcon 
                            name={campaign?.productType === 'tshirt' ? 'Shirt' : 'Coffee'} 
                            size={20} 
                            className="text-primary" 
                          />
                        </div>
                        <div>
                          <p className="font-medium text-secondary">#{order.Id}</p>
                          <p className="text-sm text-gray-600">{order.size} • Qty: {order.quantity}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-secondary">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="primary">
                          {campaign?.productType === 'tshirt' ? 'T-Shirt' : 'Mug'}
                        </Badge>
                        <span className="text-sm text-gray-600">${campaign?.pricing || 0}/unit</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-lg text-success">${orderTotal.toFixed(2)}</p>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-secondary">
                        {format(new Date(order.timestamp), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(order.timestamp), 'HH:mm')}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Orders