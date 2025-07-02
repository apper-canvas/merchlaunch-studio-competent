import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary/10 to-indigo-100 text-primary border border-primary/20',
    success: 'bg-gradient-to-r from-success/10 to-emerald-100 text-success border border-success/20',
    warning: 'bg-gradient-to-r from-warning/10 to-amber-100 text-warning border border-warning/20',
    error: 'bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20',
    accent: 'bg-gradient-to-r from-accent/10 to-orange-100 text-accent border border-accent/20'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className="mr-1" 
        />
      )}
      {children}
    </span>
  )
}

export default Badge