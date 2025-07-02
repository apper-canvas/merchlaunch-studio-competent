import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import DesignCanvas from '@/components/molecules/DesignCanvas'
import ProductPreview from '@/components/molecules/ProductPreview'
import DesignControls from '@/components/molecules/DesignControls'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { campaignService } from '@/services/api/campaignService'

const DesignStudio = () => {
  const [currentCampaign, setCurrentCampaign] = useState(null)
  const [design, setDesign] = useState({ elements: [] })
  const [productType, setProductType] = useState('tshirt')
  const [previewView, setPreviewView] = useState('front')
  const [pricing, setPricing] = useState(24.99)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Initialize with empty design
    setDesign({ elements: [] })
  }, [])

  const handleDesignChange = (newDesign) => {
    setDesign(newDesign)
  }

  const handleProductTypeChange = (newType) => {
    setProductType(newType)
    setPricing(newType === 'tshirt' ? 24.99 : 19.99)
    setPreviewView('front')
  }

  const handleSaveCampaign = async () => {
    if (!design.elements || design.elements.length === 0) {
      toast.error('Please add some design elements before saving')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const campaignData = {
        productType,
        designData: design,
        pricing,
        createdAt: new Date().toISOString(),
        shareUrl: `${window.location.origin}/product/${Date.now()}`
      }

      const savedCampaign = await campaignService.create(campaignData)
      setCurrentCampaign(savedCampaign)
      toast.success('Campaign saved successfully!')
    } catch (error) {
      setError('Failed to save campaign. Please try again.')
      toast.error('Failed to save campaign')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateNewCampaign = () => {
    setCurrentCampaign(null)
    setDesign({ elements: [] })
    setProductType('tshirt')
    setPreviewView('front')
    setPricing(24.99)
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={() => setError(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-secondary">
            Design Studio
          </h1>
          <p className="text-gray-600 mt-1">
            Create custom merchandise designs and start collecting preorders
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {currentCampaign && (
            <Button
              onClick={handleCreateNewCampaign}
              variant="outline"
              icon="Plus"
            >
              New Design
            </Button>
          )}
          <Button
            onClick={handleSaveCampaign}
            variant="primary"
            loading={isSaving}
            icon="Save"
          >
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </div>

      {/* Product Type Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary mb-4">
          Choose Product Type
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProductTypeChange('tshirt')}
            className={`p-6 rounded-lg border-2 transition-all ${
              productType === 'tshirt'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <ApperIcon name="Shirt" size={32} className="mx-auto mb-3 text-primary" />
              <h4 className="font-semibold text-secondary mb-1">T-Shirt</h4>
              <p className="text-sm text-gray-600 mb-2">100% Cotton, Unisex</p>
              <Badge variant="primary">$24.99</Badge>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProductTypeChange('mug')}
            className={`p-6 rounded-lg border-2 transition-all ${
              productType === 'mug'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <ApperIcon name="Coffee" size={32} className="mx-auto mb-3 text-primary" />
              <h4 className="font-semibold text-secondary mb-1">Mug</h4>
              <p className="text-sm text-gray-600 mb-2">11oz Ceramic, Dishwasher Safe</p>
              <Badge variant="primary">$19.99</Badge>
            </div>
          </motion.button>
        </div>
      </Card>

      {/* Design Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Design Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary">
                Design Canvas
              </h3>
              <Badge variant="accent" icon="Edit">
                {productType === 'tshirt' ? 'T-Shirt' : 'Mug'} Design
              </Badge>
            </div>
            
            <div className="flex justify-center">
              <DesignCanvas
                design={design}
                onDesignChange={handleDesignChange}
                productType={productType}
              />
            </div>
          </Card>

          {/* Design Controls */}
          <DesignControls
            design={design}
            onDesignChange={handleDesignChange}
          />
        </div>

        {/* Product Preview */}
        <div className="space-y-6">
          <ProductPreview
            design={design}
            productType={productType}
            view={previewView}
            onViewChange={setPreviewView}
          />

          {/* Campaign Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-secondary mb-4">
              Campaign Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Selling Price
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">$</span>
                  <input
                    type="number"
                    value={pricing}
                    onChange={(e) => setPricing(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: ${productType === 'tshirt' ? '24.99' : '19.99'}
                </p>
              </div>

              <div className="bg-surface rounded-lg p-4">
                <h4 className="font-medium text-secondary mb-2">Profit Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Selling Price:</span>
                    <span>${pricing.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Production Cost:</span>
                    <span>${(productType === 'tshirt' ? 12.00 : 8.00).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee (10%):</span>
                    <span>${(pricing * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-bold text-success">
                    <span>Your Profit:</span>
                    <span>${(pricing - (productType === 'tshirt' ? 12.00 : 8.00) - (pricing * 0.1)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DesignStudio