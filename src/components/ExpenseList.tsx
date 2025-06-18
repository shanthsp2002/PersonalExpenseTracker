import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft,
  Tag,
  Calendar
} from 'lucide-react'
import { Expense, useExpenseStore } from '../store/expenseStore'
import { format } from 'date-fns'
import { ExpenseForm } from './ExpenseForm'
import { AmountDisplay } from './AmountDisplay'
import toast from 'react-hot-toast'

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  
  const { deleteExpense } = useExpenseStore()

  const handleDelete = (expense: Expense) => {
    deleteExpense(expense.id)
    toast.success('Expense deleted successfully!')
    setActiveMenu(null)
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setShowEditForm(true)
    setActiveMenu(null)
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowDownLeft className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
        <p className="text-gray-500">Start tracking your expenses by adding your first transaction</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {expenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    expense.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
                  }`}>
                    {expense.type === 'income' ? (
                      <ArrowUpRight className="w-6 h-6 text-success-600" />
                    ) : (
                      <ArrowDownLeft className="w-6 h-6 text-danger-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {expense.description}
                      </h4>
                      <AmountDisplay
                        amount={expense.amount}
                        size="lg"
                        color={expense.type === 'income' ? 'success' : 'danger'}
                        prefix={expense.type === 'income' ? '+' : '-'}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Tag className="w-3 h-3" />
                        <span>{expense.category}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    
                    {expense.tags && expense.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {expense.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === expense.id ? null : expense.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  <AnimatePresence>
                    {activeMenu === expense.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                      >
                        <button
                          onClick={() => handleEdit(expense)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(expense)}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-b-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Form Modal */}
      <AnimatePresence>
        {showEditForm && selectedExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ExpenseForm 
                expense={selectedExpense}
                onClose={() => {
                  setShowEditForm(false)
                  setSelectedExpense(null)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}