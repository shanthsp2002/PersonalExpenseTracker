import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  Edit,
  Camera,
  DollarSign,
  Target
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import toast from 'react-hot-toast'

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const { user, setUser, expenses, budgets, goals } = useExpenseStore()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD',
    monthlyIncome: user?.monthlyIncome || 0,
    savingsGoal: user?.savingsGoal || 0,
    riskTolerance: user?.riskTolerance || 'moderate'
  })

  const handleSave = () => {
    if (user) {
      setUser({ ...user, ...formData })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    }
  }

  const handleExportData = () => {
    const data = {
      user,
      expenses,
      budgets,
      goals,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully!')
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.type === 'expense' ? exp.amount : 0), 0)
  const totalIncome = expenses.reduce((sum, exp) => sum + (exp.type === 'income' ? exp.amount : 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
        <p className="text-gray-500">{user?.email}</p>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary mt-4 flex items-center space-x-2 mx-auto"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </motion.div>

      {/* Edit Form */}
      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="input"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
              <input
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Savings Goal</label>
              <input
                type="number"
                value={formData.savingsGoal}
                onChange={(e) => setFormData({ ...formData, savingsGoal: Number(e.target.value) })}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
              <select
                value={formData.riskTolerance}
                onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value as any })}
                className="input"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            
            <button
              onClick={handleSave}
              className="btn-primary w-full"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-xl font-semibold text-gray-900">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-danger-600" />
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
              <p className="text-gray-500 text-sm">Active Goals</p>
              <p className="text-xl font-semibold text-gray-900">
                {goals.filter(g => g.status === 'active').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        
        <div className="card space-y-4">
          <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Notifications</span>
            </div>
            <div className="w-5 h-5 bg-primary-600 rounded-full"></div>
          </button>
          
          <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Privacy & Security</span>
            </div>
          </button>
          
          <button 
            onClick={handleExportData}
            className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Export Data</span>
            </div>
          </button>
          
          <button className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-danger-600">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Delete Account</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}