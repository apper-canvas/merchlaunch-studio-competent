import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200'
  
  const variants = {
    default: 'border border-gray-200 shadow-md',
    elevated: 'shadow-lg border border-gray-100',
    premium: 'shadow-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50',
    outline: 'border-2 border-gray-200',
    ghost: 'bg-surface/50 border border-gray-100'
  }
  
  const hoverEffects = hover ? 'hover:shadow-lg hover:scale-[1.01]' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${baseClasses} ${variants[variant]} ${hoverEffects} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card