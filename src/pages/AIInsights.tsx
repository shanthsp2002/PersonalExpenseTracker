import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { AIInsightCard } from '../components/AIInsightCard'
import { generateAIInsights } from '../utils/aiInsights'

export function AIInsights() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [filter, setFilter] = useState('all')
  
  const { insights, expenses, budgets, addInsight, clearInsights } = useExpenseStore()
  
  const filteredInsights = insights.filter(insight => {
    if (filter === 'all') return true
    return insight.type === filter
  })

  const generateInsights = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newInsights = generateAIInsights(expenses, budgets)
    
    // Clear old insights and add new ones
    clearInsights()
    newInsights.forEach(insight => addInsight(insight))
    
    setIsGenerating(false)
  }

  useEffect(() => {
    // Generate initial insights if none exist
    if (insights.length === 0 && expenses.length > 0) {
      generateInsights()
    }
  }, [])

  const insightTypes = [
    { value: 'all', label: 'All Insights', icon: Brain },
    { value: 'spending_pattern', label: 'Spending Patterns', icon: TrendingUp },
    { value: 'budget_alert', label: 'Budget Alerts', icon: AlertTriangle },
    { value: 'saving_opportunity', label: 'Savings', icon: Lightbulb },
    { value: 'prediction', label: 'Predictions', icon: Target },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="w-7 h-7 mr-3 text-primary-600" />
            AI Insights
          </h1>
          <p className="text-gray-500">Personalized financial intelligence</p>
        </div>
        <button
          onClick={generateInsights}
          disabled={isGenerating}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* AI Status Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">AI Analysis Status</h3>
            <p className="text-primary-100">
              {isGenerating ? 'Analyzing your financial data...' : 'Analysis complete'}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-primary-100 text-sm">Insights Generated</p>
            <p className="text-2xl font-bold">{insights.length}</p>
          </div>
          <div>
            <p className="text-primary-100 text-sm">High Priority</p>
            <p className="text-2xl font-bold">
              {insights.filter(i => i.impact === 'high').length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {insightTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{type.label}</span>
            </button>
          )
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {isGenerating ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredInsights.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No insights available' : `No ${filter.replace('_', ' ')} insights`}
            </h3>
            <p className="text-gray-500 mb-4">
              {expenses.length === 0 
                ? 'Add some expenses to get personalized AI insights'
                : 'Click refresh to generate new insights based on your latest data'
              }
            </p>
            {expenses.length > 0 && (
              <button
                onClick={generateInsights}
                className="btn-primary"
              >
                Generate Insights
              </button>
            )}
          </motion.div>
        ) : (
          filteredInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AIInsightCard insight={insight} detailed />
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}