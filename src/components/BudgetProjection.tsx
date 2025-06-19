import { motion } from 'framer-motion'
import { useExpenseStore } from '../store/expenseStore'

export function BudgetProjection() {
  const { expenses, budgets, user } = useExpenseStore()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear &&
           expense.type === 'expense'
  }).reduce((sum, expense) => sum + expense.amount, 0)

  const projectedMonthlyExpenses = monthlyExpenses * 1.1 // 10% buffer
  const monthlyIncome = user?.monthlyIncome || 0
  const projectedSavings = monthlyIncome - projectedMonthlyExpenses

  const recommendations = [
    {
      title: 'Optimize Food Spending',
      description: 'You could save $200/month by meal planning and cooking at home more often.',
      impact: 'medium',
      savings: 200
    },
    {
      title: 'Review Subscriptions',
      description: 'Cancel unused subscriptions to save approximately $50/month.',
      impact: 'low',
      savings: 50
    },
    {
      title: 'Transportation Optimization',
      description: 'Consider carpooling or public transport to reduce transportation costs by $150/month.',
      impact: 'high',
      savings: 150
    }
  ]

  return (
    <div className="space-y-6">
      {/* Current Month Projection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget Projection</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-600 font-medium">Projected Income</p>
            <p className="text-2xl font-bold text-success-700">${monthlyIncome.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-danger-50 rounded-lg">
            <p className="text-sm text-danger-600 font-medium">Projected Expenses</p>
            <p className="text-2xl font-bold text-danger-700">${projectedMonthlyExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className={`text-center p-4 rounded-lg ${
          projectedSavings >= 0 ? 'bg-primary-50' : 'bg-warning-50'
        }`}>
          <p className={`text-sm font-medium ${
            projectedSavings >= 0 ? 'text-primary-600' : 'text-warning-600'
          }`}>
            Projected Net Income
          </p>
          <p className={`text-2xl font-bold ${
            projectedSavings >= 0 ? 'text-primary-700' : 'text-warning-700'
          }`}>
            ${Math.abs(projectedSavings).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {projectedSavings >= 0 ? 'Available for savings' : 'Budget deficit'}
          </p>
        </div>
      </motion.div>

      {/* Budget Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                rec.impact === 'high' ? 'border-l-success-500 bg-success-50' :
                rec.impact === 'medium' ? 'border-l-warning-500 bg-warning-50' :
                'border-l-primary-500 bg-primary-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                  <p className="text-sm text-gray-700">{rec.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success-600">+${rec.savings}</p>
                  <p className="text-xs text-gray-500">per month</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Total Potential Savings</span>
            <span className="text-xl font-bold text-success-600">
              +${recommendations.reduce((sum, rec) => sum + rec.savings, 0)}/month
            </span>
          </div>
        </div>
      </motion.div>

      {/* Budget Categories Status */}
      {budgets.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Categories Status</h3>
          
          <div className="space-y-3">
            {budgets.map((budget) => {
              const spent = expenses
                .filter(e => e.category === budget.category && e.type === 'expense')
                .reduce((sum, e) => sum + e.amount, 0)
              
              const percentage = (spent / budget.limit) * 100
              const status = percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : 'good'
              
              return (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'danger' ? 'bg-danger-500' :
                      status === 'warning' ? 'bg-warning-500' : 'bg-success-500'
                    }`} />
                    <span className="font-medium text-gray-900">{budget.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      status === 'danger' ? 'text-danger-600' :
                      status === 'warning' ? 'text-warning-600' : 'text-success-600'
                    }`}>
                      {percentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}