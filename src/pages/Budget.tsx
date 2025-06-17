import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { BudgetCard } from '../components/BudgetCard'
import { BudgetForm } from '../components/BudgetForm'

export function Budget() {
  const [showForm, setShowForm] = useState(false)
  const { budgets, getBudgetStatus } = useExpenseStore()
  
  const budgetStatus = getBudgetStatus()
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-500">Monitor your spending limits</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Overall Budget Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Budget</h3>
          <div className={`flex items-center space-x-2 ${
            overallPercentage >= 90 ? 'text-danger-600' : 
            overallPercentage >= 75 ? 'text-warning-600' : 'text-success-600'
          }`}>
            {overallPercentage >= 90 ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{overallPercentage.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Spent: ${totalSpent.toLocaleString()}</span>
            <span>Budget: ${totalBudget.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                overallPercentage >= 90 ? 'bg-danger-500' : 
                overallPercentage >= 75 ? 'bg-warning-500' : 'bg-success-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Budget Categories */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-500 mb-4">Create your first budget to start tracking your spending</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Budget
            </button>
          </motion.div>
        ) : (
          budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BudgetCard budget={budget} />
            </motion.div>
          ))
        )}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <BudgetForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}