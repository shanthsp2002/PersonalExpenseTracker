import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { format } from 'date-fns'
import { AmountDisplay } from './AmountDisplay'

export function RecentTransactions() {
  const { expenses } = useExpenseStore()
  const recentExpenses = expenses.slice(0, 5)

  if (recentExpenses.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-primary-600 text-sm font-medium">View All</button>
      </div>
      
      <div className="space-y-3">
        {recentExpenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                expense.type === 'income' ? 'bg-success-100' : 'bg-danger-100'
              }`}>
                {expense.type === 'income' ? (
                  <ArrowUpRight className="w-5 h-5 text-success-600" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-danger-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{expense.description}</p>
                <p className="text-sm text-gray-500">{expense.category}</p>
              </div>
            </div>
            
            <div className="text-right">
              <AmountDisplay
                amount={expense.amount}
                color={expense.type === 'income' ? 'success' : 'danger'}
                prefix={expense.type === 'income' ? '+' : '-'}
              />
              <p className="text-sm text-gray-500">
                {format(new Date(expense.date), 'MMM dd')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}