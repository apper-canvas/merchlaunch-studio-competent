import { useState } from 'react'
import { motion } from 'framer-motion'

const ColorPicker = ({ 
  value = '#000000',
  onChange,
  label,
  colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
  ],
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleColorSelect = (color) => {
    onChange(color)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{ backgroundColor: value }}
      />
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50"
        >
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform ${
                  value === color ? 'border-primary' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <div className="border-t pt-3">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-8 rounded border border-gray-200 cursor-pointer"
            />
          </div>
        </motion.div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ColorPicker