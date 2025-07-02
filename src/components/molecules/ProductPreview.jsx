import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const ProductPreview = ({ 
  design, 
  productType = 'tshirt',
  view = 'front',
  onViewChange,
  className = '' 
}) => {
  const views = productType === 'tshirt' 
    ? ['front', 'back'] 
    : ['front', 'back', 'side']

  const getProductImage = () => {
    if (productType === 'tshirt') {
      return view === 'front' 
        ? '/api/placeholder/300/350' 
        : '/api/placeholder/300/350'
    } else {
      return view === 'front' 
        ? '/api/placeholder/280/280'
        : view === 'back' 
        ? '/api/placeholder/280/280'
        : '/api/placeholder/280/280'
    }
  }

  const renderDesignOnProduct = () => {
    if (!design.elements || design.elements.length === 0) return null

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative"
          style={{
            width: productType === 'tshirt' ? '120px' : '100px',
            height: productType === 'tshirt' ? '140px' : '80px'
          }}
        >
          {design.elements.map((element, index) => (
            <div
              key={element.id || index}
              className="absolute"
              style={{
                left: `${(element.position?.x || 0) * 0.3}px`,
                top: `${(element.position?.y || 0) * 0.3}px`,
                transform: 'scale(0.3)',
                transformOrigin: 'top left'
              }}
            >
              {element.type === 'text' && (
                <div
                  style={{
                    color: element.color,
                    fontSize: `${element.fontSize}px`,
                    fontWeight: element.fontWeight || 'normal',
                    fontFamily: element.fontFamily || 'Inter'
                  }}
                >
                  {element.content}
                </div>
              )}
              
              {element.type === 'image' && (
                <img
                  src={element.src}
                  alt="Design element"
                  style={{
                    width: element.width || 100,
                    height: element.height || 100,
                    objectFit: 'contain'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* View Selector */}
      <div className="flex items-center justify-center border-b border-gray-200 p-3">
        <div className="flex space-x-1 bg-surface rounded-lg p-1">
          {views.map((viewOption) => (
            <button
              key={viewOption}
              onClick={() => onViewChange(viewOption)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                view === viewOption
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Preview */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <img
            src={getProductImage()}
            alt={`${productType} ${view} view`}
            className="w-full h-full object-contain"
          />
          
          {/* Design Overlay */}
          {renderDesignOnProduct()}
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-secondary">
              {productType === 'tshirt' ? 'Premium T-Shirt' : 'Ceramic Mug'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {productType === 'tshirt' ? '100% Cotton, Unisex' : '11oz Capacity, Dishwasher Safe'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              ${productType === 'tshirt' ? '24.99' : '19.99'}
            </p>
            <p className="text-xs text-gray-500">Base Price</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPreview