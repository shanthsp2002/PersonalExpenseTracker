import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Target, DollarSign, Calendar, Tag } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface GoalFormProps {
  onClose: () => void
}

interface FormData {
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: 'low' | 'medium' | 'high'
}

export function GoalForm({ onClose }: GoalFormProps) {
  const { addGoal } = useExpenseStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      currentAmount: 0,
      priority: 'medium'
    }
  })

  const categories = [
    'Emergency Fund',
    'Vacation',
    'Car Purchase',
    'Home Down Payment',
    'Education',
    'Retirement',
    'Investment',
    'Debt Payoff',
    'Other'
  ]

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      addGoal({
        ...data,
        status: 'active'
      })
      
      toast.success('Goal created successfully!')
      onClose()
    } catch (error) {
      toast.error('Something went wrong!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Create New Goal</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              {...register('title', { required: 'Goal title is required' })}
              className="input pl-10"
              placeholder="e.g., Emergency Fund"
            />
          </div>
          {errors.title && (
            <p className="text-danger-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              step="0.01"
              {...register('targetAmount', { 
                required: 'Target amount is required',
                min: { value: 0.01, message: 'Target amount must be greater than 0' }
              })}
              className="input pl-10"
              placeholder="0.00"
            />
          </div>
          {errors.targetAmount && (
            <p className="text-danger-600 text-sm mt-1">{errors.targetAmount.message}</p>
          )}
        </div>

        {/* Current Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              step="0.01"
              {...register('currentAmount', { 
                min: { value: 0, message: 'Current amount cannot be negative' }
              })}
              className="input pl-10"
              placeholder="0.00"
            />
          </div>
          {errors.currentAmount && (
            <p className="text-danger-600 text-sm mt-1">{errors.currentAmount.message}</p>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              {...register('deadline', { required: 'Target date is required' })}
              className="input pl-10"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors.deadline && (
            <p className="text-danger-600 text-sm mt-1">{errors.deadline.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              {...register('category', { required: 'Category is required' })}
              className="input pl-10"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <p className="text-danger-600 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {['low', 'medium', 'high'].map((priority) => (
              <label key={priority} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value={priority}
                  {...register('priority', { required: 'Priority is required' })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-900 capitalize">{priority}</span>
              </label>
            ))}
          </div>
          {errors.priority && (
            <p className="text-danger-600 text-sm mt-1">{errors.priority.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Creating...' : 'Create Goal'}
        </motion.button>
      </form>
    </div>
  )
}