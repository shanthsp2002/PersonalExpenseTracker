import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  Brain,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { AIInsight } from '../store/expenseStore'

interface AIInsightCardProps {
  insight: AIInsight
  detailed?: boolean
}

export function AIInsightCard({ insight, detailed = false }: AIInsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case 'spending_pattern':
        return TrendingUp
      case 'budget_alert':
        return AlertTriangle
      case 'saving_opportunity':
        return Lightbulb
      case 'prediction':
        return Target
      default:
        return Brain
    }
  }

  const getColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'border-l-danger-500 bg-danger-50'
      case 'medium':
        return 'border-l-warning-500 bg-warning-50'
      case 'low':
        return 'border-l-primary-500 bg-primary-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getIconColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'text-danger-600'
      case 'medium':
        return 'text-warning-600'
      case 'low':
        return 'text-primary-600'
      default:
        return 'text-gray-600'
    }
  }

  const Icon = getIcon()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border-l-4 ${getColor()} transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${getIconColor()}`}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{insight.description}</p>
            
            {detailed && (
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'high' ? 'bg-danger-100 text-danger-700' :
                    insight.impact === 'medium' ? 'bg-warning-100 text-warning-700' :
                    'bg-primary-100 text-primary-700'
                  }`}>
                    {insight.impact.toUpperCase()} IMPACT
                  </span>
                  
                  <span className="text-xs text-gray-500">
                    {new Date(insight.date).toLocaleDateString()}
                  </span>
                </div>
                
                {insight.actionable && (
                  <button className="flex items-center space-x-1 text-primary-600 text-sm font-medium hover:text-primary-700">
                    <span>Take Action</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {!detailed && insight.actionable && (
          <button className="text-primary-600 hover:text-primary-700">
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}