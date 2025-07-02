import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ApperIcon from "@/components/ApperIcon";
import ColorPicker from "@/components/atoms/ColorPicker";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Card from "@/components/atoms/Card";

const ClipartItem = ({ item }) => {
  return (
    <div className="aspect-square bg-gray-100 rounded border flex items-center justify-center cursor-pointer hover:bg-gray-200">
      <ApperIcon name="Image" size={16} className="text-gray-400" />
    </div>
  );
};

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
  
  // Template state
  const [templatesSubTab, setTemplatesSubTab] = useState('templates')
  const [templateSearch, setTemplateSearch] = useState('')
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('all')
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [selectedClipartCategory, setSelectedClipartCategory] = useState('all')
  const [clipartLoading, setClipartLoading] = useState(false)

  // Mock data
  const templateCategories = ['all', 'business', 'creative', 'minimal', 'colorful']
  const clipartCategories = ['all', 'icons', 'shapes', 'illustrations', 'decorative']
  
  const filteredTemplates = [
    { Id: 1, name: 'Business Card', category: 'business' },
    { Id: 2, name: 'Creative Flyer', category: 'creative' },
    { Id: 3, name: 'Minimal Poster', category: 'minimal' }
  ]
  
  const filteredClipart = [
    { Id: 1, name: 'Star Icon', category: 'icons' },
    { Id: 2, name: 'Circle Shape', category: 'shapes' },
    { Id: 3, name: 'Arrow Icon', category: 'icons' }
  ]

  const handleApplyTemplate = (template) => {
    console.log('Applying template:', template.name)
    // Template application logic would go here
  }
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
    <DndProvider backend={HTML5Backend}>
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
              {/* Sub-tabs for Templates and Clipart */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setTemplatesSubTab('templates')}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    templatesSubTab === 'templates'
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Templates
                </button>
                <button
                  onClick={() => setTemplatesSubTab('clipart')}
                  className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                    templatesSubTab === 'clipart'
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Clipart
                </button>
              </div>

              {templatesSubTab === 'templates' && (
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="space-y-3">
                    <Input
                      placeholder="Search templates..."
                      value={templateSearch}
                      onChange={(e) => setTemplateSearch(e.target.value)}
                      icon="Search"
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      {templateCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedTemplateCategory(category)}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            selectedTemplateCategory === category
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {category === 'all' ? 'All' : category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Templates Grid */}
                  {templatesLoading ? (
                    <Loading size="sm" />
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {filteredTemplates.map(template => (
                        <Card key={template.Id} className="p-3" hover>
                          <div className="space-y-2">
                            <div className="aspect-video bg-gray-100 rounded border flex items-center justify-center">
                              <ApperIcon name="Layout" size={24} className="text-gray-400" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-secondary">{template.name}</h4>
                              <p className="text-xs text-gray-600">{template.category}</p>
                            </div>
                            <Button
                              onClick={() => handleApplyTemplate(template)}
                              variant="primary"
                              size="sm"
                              className="w-full"
                              icon="Download"
                            >
                              Apply
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {templatesSubTab === 'clipart' && (
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {clipartCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedClipartCategory(category)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedClipartCategory === category
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? 'All' : category}
                      </button>
                    ))}
                  </div>

                  {/* Clipart Grid */}
                  {clipartLoading ? (
                    <Loading size="sm" />
                  ) : (
                    <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto">
                      {filteredClipart.map(item => (
                        <ClipartItem key={item.Id} item={item} />
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 text-center">
                    Drag clipart to canvas or click to add
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

export default DesignControls