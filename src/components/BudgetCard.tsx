import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react'
import { Budget, useExpenseStore } from '../store/expenseStore'
import { AmountDisplay } from './AmountDisplay'

interface BudgetCardProps {
  budget: Budget
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const { expenses } = useExpenseStore()
  
  const spent = expenses
    .filter(e => e.category === budget.category && e.type === 'expense')
    .reduce((total, expense) => total + expense.amount, 0)
  
  const percentage = (spent / budget.limit) * 100
  const remaining = budget.limit - spent
  
  let status: 'good' | 'warning' | 'danger' = 'good'
  if (percentage >= 90) status = 'danger'
  else if (percentage >= 75) status = 'warning'

  const getStatusColor = () => {
    switch (status) {
      case 'danger':
        return 'text-danger-600'
      case 'warning':
        return 'text-warning-600'
      default:
        return 'text-success-600'
    }
  }

  const getProgressColor = () => {
    switch (status) {
      case 'danger':
        return 'bg-danger-500'
      case 'warning':
        return 'bg-warning-500'
      default:
        return 'bg-success-500'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-900">{budget.category}</h4>
          <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
        </div>
        
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          {status === 'danger' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Spent: <AmountDisplay amount={spent} size="sm" /></span>
          <span>Budget: <AmountDisplay amount={budget.limit} size="sm" /></span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            remaining >= 0 ? 'text-success-600' : 'text-danger-600'
          }`}>
            {remaining >= 0 ? (
              <>
                <AmountDisplay amount={remaining} size="sm" color="success" /> remaining
              </>
            ) : (
              <>
                <AmountDisplay amount={Math.abs(remaining)} size="sm" color="danger" /> over budget
              </>
            )}
          </span>
          
          <div className="flex space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}