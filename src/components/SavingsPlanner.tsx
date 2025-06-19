import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'

export function SavingsPlanner() {
  const { goals, expenses } = useExpenseStore()

  const activeGoals = goals.filter(g => g.status === 'active')
  const monthlyExpenses = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0) / 12 // Rough monthly average

  const savingsStrategies = [
    {
      title: '50/30/20 Rule',
      description: 'Allocate 50% for needs, 30% for wants, and 20% for savings',
      monthlyAmount: 1000,
      difficulty: 'Easy'
    },
    {
      title: 'Aggressive Savings',
      description: 'Save 30% of income for faster goal achievement',
      monthlyAmount: 1500,
      difficulty: 'Hard'
    },
    {
      title: 'Conservative Approach',
      description: 'Start with 10% and gradually increase',
      monthlyAmount: 500,
      difficulty: 'Easy'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Savings Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Analysis</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-600 font-medium">Available for Savings</p>
            <p className="text-2xl font-bold text-primary-700">
              ${Math.max(5000 - monthlyExpenses, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per month</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-600 font-medium">Recommended (20%)</p>
            <p className="text-2xl font-bold text-success-700">
              $1,000
            </p>
            <p className="text-xs text-gray-500">per month</p>
          </div>
        </div>
      </motion.div>

      {/* Savings Strategies */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Strategies</h3>
        
        <div className="space-y-4">
          {savingsStrategies.map((strategy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{strategy.title}</h4>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  strategy.difficulty === 'Easy' ? 'bg-success-100 text-success-700' :
                  strategy.difficulty === 'Hard' ? 'bg-danger-100 text-danger-700' :
                  'bg-warning-100 text-warning-700'
                }`}>
                  {strategy.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Monthly savings:</span>
                <span className="font-bold text-primary-600">
                  ${strategy.monthlyAmount.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Goal Progress Projection */}
      {activeGoals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Achievement Timeline</h3>
          
          <div className="space-y-4">
            {activeGoals.slice(0, 3).map((goal) => {
              const remaining = goal.targetAmount - goal.currentAmount
              const monthsToComplete = Math.ceil(remaining / Math.max(1000, 100))
              const completionDate = new Date()
              completionDate.setMonth(completionDate.getMonth() + monthsToComplete)
              
              return (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    <span className="text-sm text-gray-500">
                      ${remaining.toLocaleString()} remaining
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Est. completion: {completionDate.toLocaleDateString()}</span>
                    </div>
                    <span className="text-sm font-medium text-primary-600">
                      {monthsToComplete} months
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Savings Tips */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Savings Tips</h3>
        
        <div className="space-y-3">
          {[
            'Automate your savings to make it effortless',
            'Start small and increase gradually',
            'Use the envelope method for discretionary spending',
            'Take advantage of high-yield savings accounts',
            'Review and adjust your savings plan monthly'
          ].map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}