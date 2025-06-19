import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Brain,
  Zap,
  ArrowRight
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { QuickActions } from '../components/QuickActions'
import { ExpenseChart } from '../components/ExpenseChart'
import { RecentTransactions } from '../components/RecentTransactions'
import { AIInsightCard } from '../components/AIInsightCard'
import { AmountDisplay } from '../components/AmountDisplay'

export function Dashboard() {
  const { 
    goals, 
    insights,
    getTotalExpenses, 
    getTotalIncome
  } = useExpenseStore()

  const totalExpenses = getTotalExpenses()
  const totalIncome = getTotalIncome()
  const netIncome = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0

  const activeGoals = goals.filter(g => g.status === 'active')
  const recentInsights = insights.slice(0, 2)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Good morning!</h2>
            <p className="text-primary-100">Here's your financial overview</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-primary-100 text-sm">Net Income</p>
            <div className="text-2xl font-bold">
              <AmountDisplay 
                amount={netIncome} 
                size="xl" 
                className="text-white"
              />
            </div>
          </div>
          <div>
            <p className="text-primary-100 text-sm">Savings Rate</p>
            <p className="text-2xl font-bold">
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <AmountDisplay amount={totalExpenses} size="xl" color="danger" />
            </div>
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger-600" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Income</p>
              <AmountDisplay amount={totalIncome} size="xl" color="success" />
            </div>
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights Preview */}
      {recentInsights.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary-600" />
              AI Insights
            </h3>
            <button className="text-primary-600 text-sm font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {recentInsights.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <QuickActions />
      </motion.div>

      {/* Expense Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Overview</h3>
        <ExpenseChart />
      </motion.div>

      {/* Active Goals Preview */}
      {activeGoals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Active Goals
            </h3>
            <button className="text-primary-600 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {activeGoals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  <span className="text-sm text-gray-500">
                    <AmountDisplay amount={goal.currentAmount} size="sm" /> / <AmountDisplay amount={goal.targetAmount} size="sm" />
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <RecentTransactions />
      </motion.div>
    </div>
  )
}