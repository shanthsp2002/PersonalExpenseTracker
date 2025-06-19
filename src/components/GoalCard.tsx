import { motion } from 'framer-motion'
import { Calendar, Play, Pause, CheckCircle } from 'lucide-react'
import { Goal, useExpenseStore } from '../store/expenseStore'
import { format, differenceInDays } from 'date-fns'
import { AmountDisplay } from './AmountDisplay'

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const { updateGoal } = useExpenseStore()
  
  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const daysLeft = differenceInDays(new Date(goal.deadline), new Date())
  const isCompleted = goal.status === 'completed'
  const isOverdue = daysLeft < 0 && !isCompleted

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return CheckCircle
      case 'paused':
        return Pause
      default:
        return Play
    }
  }

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'text-success-600 bg-success-100'
      case 'paused':
        return 'text-warning-600 bg-warning-100'
      default:
        return 'text-primary-600 bg-primary-100'
    }
  }

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high':
        return 'bg-danger-100 text-danger-700'
      case 'medium':
        return 'bg-warning-100 text-warning-700'
      default:
        return 'bg-primary-100 text-primary-700'
    }
  }

  const StatusIcon = getStatusIcon()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900">{goal.title}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
              {goal.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500">{goal.category}</p>
        </div>
        
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStatusColor()}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <AmountDisplay amount={goal.currentAmount} size="sm" />
            <AmountDisplay amount={goal.targetAmount} size="sm" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-success-500' : 'bg-primary-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-1">
            {progress.toFixed(1)}% Complete
          </p>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(goal.deadline), 'MMM dd, yyyy')}</span>
          </div>
          
          <span className={`text-sm font-medium ${
            isOverdue ? 'text-danger-600' : 
            daysLeft <= 7 ? 'text-warning-600' : 'text-gray-600'
          }`}>
            {isOverdue ? `${Math.abs(daysLeft)} days overdue` : 
             daysLeft === 0 ? 'Due today' :
             `${daysLeft} days left`}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => updateGoal(goal.id, { 
              status: goal.status === 'active' ? 'paused' : 'active' 
            })}
            className="btn-secondary flex-1 text-sm"
          >
            {goal.status === 'active' ? 'Pause' : 'Resume'}
          </button>
          
          {!isCompleted && (
            <button
              onClick={() => updateGoal(goal.id, { 
                currentAmount: goal.targetAmount,
                status: 'completed'
              })}
              className="btn-success flex-1 text-sm"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}