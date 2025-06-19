import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  PieChart, 
  BarChart3,
  Download,
  Filter
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { ExpenseChart } from '../components/ExpenseChart'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { SpendingTrends } from '../components/SpendingTrends'
import { MonthlyComparison } from '../components/MonthlyComparison'

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [chartType, setChartType] = useState('pie')
  
  const { getExpensesByCategory } = useExpenseStore()
  const expensesByCategory = getExpensesByCategory()

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Insights into your spending patterns</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2 overflow-x-auto">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedPeriod === period.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="flex space-x-2">
        <button
          onClick={() => setChartType('pie')}
          className={`btn-secondary flex items-center space-x-2 ${
            chartType === 'pie' ? 'bg-primary-100 text-primary-700' : ''
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Pie Chart</span>
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={`btn-secondary flex items-center space-x-2 ${
            chartType === 'bar' ? 'bg-primary-100 text-primary-700' : ''
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Bar Chart</span>
        </button>
        <button
          onClick={() => setChartType('trend')}
          className={`btn-secondary flex items-center space-x-2 ${
            chartType === 'trend' ? 'bg-primary-100 text-primary-700' : ''
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trends</span>
        </button>
      </div>

      {/* Main Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Spending Overview - {periods.find(p => p.value === selectedPeriod)?.label}
        </h3>
        {chartType === 'pie' && <ExpenseChart />}
        {chartType === 'bar' && <CategoryBreakdown />}
        {chartType === 'trend' && <SpendingTrends />}
      </motion.div>

      {/* Category Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(expensesByCategory).map(([category, amount]) => {
            const total = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0)
            const percentage = total > 0 ? (amount / total) * 100 : 0
            
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Monthly Comparison */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Comparison</h3>
        <MonthlyComparison />
      </motion.div>

      {/* Key Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-2">Highest Spending Category</h4>
          <p className="text-2xl font-bold text-primary-600">
            {Object.entries(expensesByCategory).length > 0 
              ? Object.entries(expensesByCategory).reduce((a, b) => a[1] > b[1] ? a : b)[0]
              : 'No data'
            }
          </p>
        </div>
        
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-2">Average Daily Spending</h4>
          <p className="text-2xl font-bold text-primary-600">
            ${(Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0) / 30).toFixed(2)}
          </p>
        </div>
      </motion.div>
    </div>
  )
}