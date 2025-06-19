import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Tag, Calendar } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { useForm } from 'react-hook-form'
import { CurrencyInput } from './CurrencyInput'
import toast from 'react-hot-toast'

interface BudgetFormProps {
  onClose: () => void
}

interface FormData {
  category: string
  limit: number
  period: 'monthly' | 'weekly' | 'yearly'
  alerts: boolean
}

export function BudgetForm({ onClose }: BudgetFormProps) {
  const { addBudget } = useExpenseStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [limit, setLimit] = useState(0)
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      limit: 0,
      period: 'monthly',
      alerts: true
    }
  })

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Groceries',
    'Other'
  ]

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      addBudget({
        ...data,
        limit,
        spent: 0
      })
      
      toast.success('Budget created successfully!')
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
        <h2 className="text-xl font-semibold text-gray-900">Create Budget</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Budget Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Limit</label>
          <CurrencyInput
            value={limit}
            onChange={(value) => {
              setLimit(value)
              setValue('limit', value)
            }}
            placeholder="0.00"
            required
          />
          {limit <= 0 && (
            <p className="text-danger-600 text-sm mt-1">Budget limit must be greater than 0</p>
          )}
        </div>

        {/* Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              {...register('period', { required: 'Period is required' })}
              className="input pl-10"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {errors.period && (
            <p className="text-danger-600 text-sm mt-1">{errors.period.message}</p>
          )}
        </div>

        {/* Alerts */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            {...register('alerts')}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Enable budget alerts
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || limit <= 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Creating...' : 'Create Budget'}
        </motion.button>
      </form>
    </div>
  )
}