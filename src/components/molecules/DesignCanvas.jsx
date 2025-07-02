import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const DesignCanvas = ({ 
  design, 
  onDesignChange, 
  productType = 'tshirt',
  className = '' 
}) => {
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef(null)

  const handleElementClick = (elementId) => {
    setSelectedElement(elementId)
  }

  const handleDragStart = (elementId) => {
    setSelectedElement(elementId)
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handlePositionChange = (elementId, newPosition) => {
    const updatedDesign = {
      ...design,
      elements: design.elements.map(element =>
        element.id === elementId 
          ? { ...element, position: newPosition }
          : element
      )
    }
    onDesignChange(updatedDesign)
  }

  const handleDeleteElement = (elementId) => {
    const updatedDesign = {
      ...design,
      elements: design.elements.filter(element => element.id !== elementId)
    }
    onDesignChange(updatedDesign)
    setSelectedElement(null)
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={canvasRef}
        className="design-canvas relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
        style={{ 
          width: productType === 'tshirt' ? '400px' : '350px',
          height: productType === 'tshirt' ? '480px' : '320px',
          minHeight: '320px'
        }}
      >
        {/* Design Area Indicator */}
        <div className="absolute inset-4 border border-gray-200 rounded-md bg-white/20 pointer-events-none" />
        
        {/* Design Elements */}
        {design.elements?.map((element) => (
          <motion.div
            key={element.id}
            drag
            dragMomentum={false}
            onDragStart={() => handleDragStart(element.id)}
            onDragEnd={handleDragEnd}
            onDrag={(event, info) => {
              const newPosition = {
                x: element.position.x + info.delta.x,
                y: element.position.y + info.delta.y
              }
              handlePositionChange(element.id, newPosition)
            }}
            className={`absolute cursor-move select-none ${
              selectedElement === element.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{
              left: element.position.x,
              top: element.position.y,
              zIndex: selectedElement === element.id ? 10 : 1
            }}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.1 }}
            onClick={() => handleElementClick(element.id)}
          >
            {element.type === 'text' && (
              <div
                className="drag-handle px-2 py-1 bg-white/90 rounded shadow-sm border"
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
              <div className="drag-handle">
                <img
                  src={element.src}
                  alt="Design element"
                  className="max-w-none rounded shadow-sm"
                  style={{
                    width: element.width || 100,
                    height: element.height || 100,
                    objectFit: 'contain'
                  }}
                />
              </div>
            )}
            
            {/* Delete button for selected element */}
            {selectedElement === element.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteElement(element.id)
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <ApperIcon name="X" size={12} />
              </button>
            )}
          </motion.div>
        ))}
        
        {/* Empty state */}
        {(!design.elements || design.elements.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <ApperIcon name="Image" size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Drop elements here to start designing</p>
            </div>
          </div>
        )}
      </div>
      
{/* Canvas Info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        {productType === 'tshirt' ? 'T-Shirt Design Area' : 'Mug Design Area'} • Click and drag to move • Drop clipart here
      </div>
    </div>
  )
}

export default DesignCanvas