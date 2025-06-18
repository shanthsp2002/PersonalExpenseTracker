import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Tag, Calendar, FileText } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { useForm } from 'react-hook-form'
import { CurrencyInput } from './CurrencyInput'
import toast from 'react-hot-toast'

interface ExpenseFormProps {
  onClose: () => void
  expense?: any
}

interface FormData {
  amount: number
  category: string
  description: string
  date: string
  type: 'expense' | 'income'
  tags: string
}

export function ExpenseForm({ onClose, expense }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenseStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [amount, setAmount] = useState(expense?.amount || 0)
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      amount: expense?.amount || 0,
      category: expense?.category || '',
      description: expense?.description || '',
      date: expense?.date || new Date().toISOString().split('T')[0],
      type: expense?.type || 'expense',
      tags: expense?.tags?.join(', ') || ''
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
      const expenseData = {
        ...data,
        amount,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        date: data.date
      }

      if (expense) {
        updateExpense(expense.id, expenseData)
        toast.success('Expense updated successfully!')
      } else {
        addExpense(expenseData)
        toast.success('Expense added successfully!')
      }
      
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
        <h2 className="text-xl font-semibold text-gray-900">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="expense"
                {...register('type', { required: 'Type is required' })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-900">Expense</span>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="income"
                {...register('type', { required: 'Type is required' })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-900">Income</span>
            </label>
          </div>
          {errors.type && (
            <p className="text-danger-600 text-sm mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <CurrencyInput
            value={amount}
            onChange={(value) => {
              setAmount(value)
              setValue('amount', value)
            }}
            placeholder="0.00"
            required
          />
          {amount <= 0 && (
            <p className="text-danger-600 text-sm mt-1">Amount must be greater than 0</p>
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              {...register('description', { required: 'Description is required' })}
              className="input pl-10 h-20 resize-none"
              placeholder="What was this for?"
            />
          </div>
          {errors.description && (
            <p className="text-danger-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="input pl-10"
            />
          </div>
          {errors.date && (
            <p className="text-danger-600 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (optional)</label>
          <input
            type="text"
            {...register('tags')}
            className="input"
            placeholder="work, lunch, client meeting (comma separated)"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || amount <= 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </motion.button>
      </form>
    </div>
  )
}