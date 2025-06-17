import React from 'react'
import { Plus, Scan, Receipt, Target, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      icon: Plus,
      label: 'Add Expense',
      color: 'bg-primary-500',
      onClick: () => navigate('/expenses')
    },
    {
      icon: Scan,
      label: 'Scan Receipt',
      color: 'bg-success-500',
      onClick: () => toast.success('Receipt scanning coming soon!')
    },
    {
      icon: Target,
      label: 'Set Goal',
      color: 'bg-warning-500',
      onClick: () => navigate('/goals')
    },
    {
      icon: TrendingUp,
      label: 'View Analytics',
      color: 'bg-purple-500',
      onClick: () => navigate('/analytics')
    }
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">{action.label}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}