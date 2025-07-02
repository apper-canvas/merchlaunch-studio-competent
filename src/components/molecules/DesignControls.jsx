import { useState } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ColorPicker from '@/components/atoms/ColorPicker'
import ApperIcon from '@/components/ApperIcon'

const DesignControls = ({ 
  design, 
  onDesignChange,
  onAddText,
  onAddImage,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('text')
  const [textContent, setTextContent] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(24)

  const handleAddText = () => {
    if (!textContent.trim()) return

    const newElement = {
      id: Date.now().toString(),
      type: 'text',
      content: textContent,
      color: textColor,
      fontSize: fontSize,
      fontWeight: 'normal',
      position: { x: 50, y: 50 }
    }

    const updatedDesign = {
      ...design,
      elements: [...(design.elements || []), newElement]
    }

    onDesignChange(updatedDesign)
    setTextContent('')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const newElement = {
        id: Date.now().toString(),
        type: 'image',
        src: e.target.result,
        width: 100,
        height: 100,
        position: { x: 50, y: 50 }
      }

      const updatedDesign = {
        ...design,
        elements: [...(design.elements || []), newElement]
      }

      onDesignChange(updatedDesign)
    }
    reader.readAsDataURL(file)
  }

  const tabs = [
    { id: 'text', label: 'Text', icon: 'Type' },
    { id: 'image', label: 'Image', icon: 'Image' },
    { id: 'templates', label: 'Templates', icon: 'Layout' }
  ]

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <ApperIcon name={tab.icon} size={16} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'text' && (
          <div className="space-y-4">
            <Input
              label="Text Content"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your text..."
            />
            
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Text Color"
                value={textColor}
                onChange={setTextColor}
              />
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center text-sm text-gray-600 mt-1">
                  {fontSize}px
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleAddText}
              variant="primary"
              className="w-full"
              icon="Plus"
              disabled={!textContent.trim()}
            >
              Add Text
            </Button>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <ApperIcon name="Upload" size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <ApperIcon name="Palette" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-secondary mb-2">
                Design Templates
              </h3>
              <p className="text-gray-600 mb-4">
                Pre-made designs to get you started quickly
              </p>
              <Button variant="outline" icon="Sparkles">
                Coming Soon
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DesignControls