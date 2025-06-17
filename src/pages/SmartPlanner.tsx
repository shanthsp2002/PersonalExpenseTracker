import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { PlannerCard } from '../components/PlannerCard'
import { BudgetProjection } from '../components/BudgetProjection'
import { SavingsPlanner } from '../components/SavingsPlanner'
import { ExpenseForecast } from '../components/ExpenseForecast'

export function SmartPlanner() {
  const [activeTab, setActiveTab] = useState('overview')
  const { expenses, budgets, goals, user } = useExpenseStore()

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'budget', label: 'Budget Plan', icon: Target },
    { id: 'savings', label: 'Savings Plan', icon: TrendingUp },
    { id: 'forecast', label: 'Forecast', icon: Zap },
  ]

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.type === 'expense' ? exp.amount : 0), 0)
  const totalIncome = expenses.reduce((sum, exp) => sum + (exp.type === 'income' ? exp.amount : 0), 0)
  const projectedSavings = (user?.monthlyIncome || 0) - totalExpenses

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-7 h-7 mr-3 text-primary-600" />
          Smart Planner
        </h1>
        <p className="text-gray-500">AI-powered financial planning for {currentMonth}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Projected Savings</p>
              <p className={`text-xl font-semibold ${
                projectedSavings >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                ${Math.abs(projectedSavings).toLocaleString()}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              projectedSavings >= 0 ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              <DollarSign className={`w-5 h-5 ${
                projectedSavings >= 0 ? 'text-success-600' : 'text-danger-600'
              }`} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Budget Health</p>
              <p className="text-xl font-semibold text-gray-900">
                {budgets.length > 0 ? 'Good' : 'Setup Needed'}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              budgets.length > 0 ? 'bg-success-100' : 'bg-warning-100'
            }`}>
              {budgets.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-success-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning-600" />
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Monthly Overview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="text-2xl font-bold text-success-600">
                    ${(user?.monthlyIncome || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Expenses</p>
                  <p className="text-2xl font-bold text-danger-600">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Active Goals Progress */}
            {goals.filter(g => g.status === 'active').length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
                <div className="space-y-3">
                  {goals.filter(g => g.status === 'active').slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{goal.title}</p>
                        <p className="text-sm text-gray-500">
                          ${goal.currentAmount} / ${goal.targetAmount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary-600">
                          {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <PlannerCard
                title="Optimize Budget"
                description="AI suggestions to improve your spending"
                icon={Target}
                color="primary"
                onClick={() => setActiveTab('budget')}
              />
              <PlannerCard
                title="Savings Plan"
                description="Personalized savings strategies"
                icon={TrendingUp}
                color="success"
                onClick={() => setActiveTab('savings')}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BudgetProjection />
          </motion.div>
        )}

        {activeTab === 'savings' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SavingsPlanner />
          </motion.div>
        )}

        {activeTab === 'forecast' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ExpenseForecast />
          </motion.div>
        )}
      </div>
    </div>
  )
}