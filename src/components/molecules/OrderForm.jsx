import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const OrderForm = ({ 
  campaign, 
  onOrderSubmit,
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    size: 'M',
    quantity: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sizes = campaign?.productType === 'tshirt' 
    ? ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    : ['Standard']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.customerEmail.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    
    try {
      const orderData = {
        ...formData,
        campaignId: campaign.Id,
        timestamp: new Date().toISOString(),
        totalAmount: campaign.pricing * formData.quantity
      }
      
      await onOrderSubmit(orderData)
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        size: campaign?.productType === 'tshirt' ? 'M' : 'Standard',
        quantity: 1
      })
      
      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = (campaign?.pricing || 0) * formData.quantity

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-secondary">Place Your Order</h3>
        <Badge variant="primary" icon="ShoppingCart">
          Preorder
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.customerName}
          onChange={(e) => handleInputChange('customerName', e.target.value)}
          placeholder="Enter your full name"
          required
          icon="User"
        />

        <Input
          label="Email Address"
          type="email"
          value={formData.customerEmail}
          onChange={(e) => handleInputChange('customerEmail', e.target.value)}
          placeholder="Enter your email"
          required
          icon="Mail"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Size
            </label>
            <select
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all duration-200"
            >
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleInputChange('quantity', Math.max(1, formData.quantity - 1))}
                className="w-10 h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="Minus" size={16} />
              </button>
              <span className="w-12 text-center font-medium text-lg">
                {formData.quantity}
              </span>
              <button
                type="button"
                onClick={() => handleInputChange('quantity', Math.min(10, formData.quantity + 1))}
                className="w-10 h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="Plus" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-surface rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Unit Price:</span>
            <span>${campaign?.pricing || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Quantity:</span>
            <span>{formData.quantity}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          icon="ShoppingCart"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Preorder'}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <ApperIcon name="Shield" size={16} className="inline mr-1" />
          Your order will only be charged when the campaign reaches its minimum quantity
        </div>
      </form>
    </Card>
  )
}

export default OrderForm