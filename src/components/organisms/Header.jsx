import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Design Studio', href: '/', icon: 'Palette' },
    { name: 'My Campaigns', href: '/campaigns', icon: 'FolderOpen' },
    { name: 'Orders', href: '/orders', icon: 'ShoppingBag' },
    { name: 'Share', href: '/share', icon: 'Share' }
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Shirt" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-secondary">
                MerchLaunch
              </h1>
              <p className="text-xs text-gray-600 -mt-1">Studio</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={item.icon} size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" icon="HelpCircle">
              Help
            </Button>
            <Button variant="primary" size="sm" icon="Plus">
              New Campaign
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-secondary hover:bg-gray-50"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? 'X' : 'Menu'} 
              size={20} 
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Button variant="outline" size="sm" icon="HelpCircle" className="w-full">
                Help & Support
              </Button>
              <Button variant="primary" size="sm" icon="Plus" className="w-full">
                New Campaign
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header