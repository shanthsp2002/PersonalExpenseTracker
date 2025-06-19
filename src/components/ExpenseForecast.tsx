import { motion } from 'framer-motion'
import { TrendingUp, Calendar, AlertTriangle, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExpenseStore } from '../store/expenseStore'
import { addMonths, format } from 'date-fns'

export function ExpenseForecast() {
  const { expenses } = useExpenseStore()

  // Calculate historical monthly averages
  const monthlyAverages = expenses
    .filter(e => e.type === 'expense')
    .reduce((acc, expense) => {
      const month = format(new Date(expense.date), 'yyyy-MM')
      acc[month] = (acc[month] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

  const avgMonthlyExpense = Object.values(monthlyAverages).length > 0 
    ? Object.values(monthlyAverages).reduce((sum, val) => sum + val, 0) / Object.values(monthlyAverages).length
    : 0

  // Generate forecast for next 6 months
  const forecastData = Array.from({ length: 6 }, (_, i) => {
    const date = addMonths(new Date(), i + 1)
    const seasonalMultiplier = getSeasonalMultiplier(date.getMonth())
    const trendMultiplier = 1 + (i * 0.02) // 2% monthly increase trend
    
    return {
      month: format(date, 'MMM yyyy'),
      predicted: Math.round(avgMonthlyExpense * seasonalMultiplier * trendMultiplier),
      conservative: Math.round(avgMonthlyExpense * seasonalMultiplier * trendMultiplier * 0.9),
      aggressive: Math.round(avgMonthlyExpense * seasonalMultiplier * trendMultiplier * 1.1)
    }
  })

  function getSeasonalMultiplier(month: number): number {
    // Adjust for seasonal spending patterns
    const seasonalFactors = {
      0: 1.1,  // January - New Year expenses
      1: 0.95, // February
      2: 1.0,  // March
      3: 1.05, // April - Spring activities
      4: 1.1,  // May
      5: 1.15, // June - Summer activities
      6: 1.2,  // July - Peak summer
      7: 1.15, // August
      8: 1.05, // September - Back to school
      9: 1.1,  // October
      10: 1.2, // November - Holiday shopping
      11: 1.3  // December - Holiday season
    }
    return seasonalFactors[month as keyof typeof seasonalFactors] || 1.0
  }

  const insights = [
    {
      title: 'Holiday Season Impact',
      description: 'Expect 20-30% higher expenses in November and December due to holiday spending.',
      impact: 'high'
    },
    {
      title: 'Summer Spending Spike',
      description: 'Travel and entertainment expenses typically increase by 15% during summer months.',
      impact: 'medium'
    },
    {
      title: 'Inflation Adjustment',
      description: 'Consider a 2-3% monthly increase in expenses due to inflation trends.',
      impact: 'medium'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Forecast Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Expense Forecast</h3>
        
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line 
                type="monotone" 
                dataKey="conservative" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Conservative"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Predicted"
              />
              <Line 
                type="monotone" 
                dataKey="aggressive" 
                stroke="#EF4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Aggressive"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-success-50 rounded-lg">
            <p className="text-sm text-success-600 font-medium">Conservative</p>
            <p className="text-lg font-bold text-success-700">
              ${forecastData[0]?.conservative.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-600 font-medium">Most Likely</p>
            <p className="text-lg font-bold text-primary-700">
              ${forecastData[0]?.predicted.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-danger-50 rounded-lg">
            <p className="text-sm text-danger-600 font-medium">Aggressive</p>
            <p className="text-lg font-bold text-danger-700">
              ${forecastData[0]?.aggressive.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forecast Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Insights</h3>
        
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                insight.impact === 'high' ? 'border-l-danger-500 bg-danger-50' :
                'border-l-warning-500 bg-warning-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  insight.impact === 'high' ? 'text-danger-600' : 'text-warning-600'
                }`} />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-700">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Budget Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Recommendations</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-primary-600" />
              <h4 className="font-semibold text-gray-900">Emergency Fund Target</h4>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Based on your forecast, maintain an emergency fund of ${(avgMonthlyExpense * 6).toLocaleString()} 
              (6 months of expenses).
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current emergency fund:</span>
              <span className="font-semibold text-primary-600">$0</span>
            </div>
          </div>

          <div className="p-4 bg-warning-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="w-5 h-5 text-warning-600" />
              <h4 className="font-semibold text-gray-900">Seasonal Budget Adjustment</h4>
            </div>
            <p className="text-sm text-gray-700">
              Consider increasing your budget by 20% for November and December to account for holiday expenses.
            </p>
          </div>

          <div className="p-4 bg-success-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-success-600" />
              <h4 className="font-semibold text-gray-900">Savings Opportunity</h4>
            </div>
            <p className="text-sm text-gray-700">
              If you can reduce expenses by 10%, you could save an additional ${(avgMonthlyExpense * 0.1 * 12).toLocaleString()} 
              annually.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}