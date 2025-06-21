import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface PlannerCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: 'primary' | 'success' | 'warning' | 'danger'
  onClick: () => void
}

export function PlannerCard({ title, description, icon: Icon, color, onClick }: PlannerCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success-500 hover:bg-success-600'
      case 'warning':
        return 'bg-warning-500 hover:bg-warning-600'
      case 'danger':
        return 'bg-danger-500 hover:bg-danger-600'
      default:
        return 'bg-primary-500 hover:bg-primary-600'
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card text-left hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${getColorClasses()}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </motion.button>
  )
}