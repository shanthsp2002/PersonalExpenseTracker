import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, Trophy, Clock, AlertCircle } from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { GoalCard } from '../components/GoalCard'
import { GoalForm } from '../components/GoalForm'

export function Goals() {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  
  const { goals } = useExpenseStore()
  
  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true
    return goal.status === filter
  })

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const totalGoalAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-500">Track your financial objectives</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{activeGoals.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-600" />
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
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedGoals.length}</p>
            </div>
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-success-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Overview */}
      {activeGoals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Saved: ${totalSaved.toLocaleString()}</span>
              <span>Target: ${totalGoalAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((totalSaved / totalGoalAmount) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-500">
              {totalGoalAmount > 0 ? ((totalSaved / totalGoalAmount) * 100).toFixed(1) : 0}% Complete
            </p>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { value: 'all', label: 'All Goals' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
          { value: 'paused', label: 'Paused' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredGoals.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? 'Create your first financial goal to start saving'
                  : `You don't have any ${filter} goals at the moment`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  Create Goal
                </button>
              )}
            </motion.div>
          ) : (
            filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <GoalCard goal={goal} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Goal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <GoalForm onClose={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}