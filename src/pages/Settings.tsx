import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Shield, 
  Download,
  DollarSign,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  ArrowLeft,
  Save
} from 'lucide-react'
import { useExpenseStore } from '../store/expenseStore'
import { CurrencySelector } from '../components/CurrencySelector'
import { CurrencyInput } from '../components/CurrencyInput'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function Settings() {
  const navigate = useNavigate()
  const { user, setUser } = useExpenseStore()
  const [isDirty, setIsDirty] = useState(false)
  
  const [settings, setSettings] = useState({
    currency: user?.currency || 'USD',
    monthlyIncome: user?.monthlyIncome || 0,
    savingsGoal: user?.savingsGoal || 0,
    riskTolerance: user?.riskTolerance || 'moderate',
    notifications: {
      budgetAlerts: true,
      goalReminders: true,
      weeklyReports: true,
      emailNotifications: false,
      pushNotifications: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false
    },
    appearance: {
      theme: 'light',
      language: 'en'
    }
  })

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as object),
        [key]: value
      }
    }))
    setIsDirty(true)
  }

  const handleDirectChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        currency: settings.currency,
        monthlyIncome: settings.monthlyIncome,
        savingsGoal: settings.savingsGoal,
        riskTolerance: settings.riskTolerance
      })
    }
    setIsDirty(false)
    toast.success('Settings saved successfully!')
  }

  const handleExportData = () => {
    // This would typically call an API
    toast.success('Data export started! You will receive an email when ready.')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deletion request submitted.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          </div>
          {isDirty && (
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Financial Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
            Financial Settings
          </h3>
          
          <div className="space-y-4">
            <CurrencySelector
              value={settings.currency}
              onChange={(currency) => handleDirectChange('currency', currency)}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
              <CurrencyInput
                value={settings.monthlyIncome}
                onChange={(value) => handleDirectChange('monthlyIncome', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Savings Goal</label>
              <CurrencyInput
                value={settings.savingsGoal}
                onChange={(value) => handleDirectChange('savingsGoal', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
              <select
                value={settings.riskTolerance}
                onChange={(e) => handleDirectChange('riskTolerance', e.target.value)}
                className="input"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary-600" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Budget Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when approaching budget limits</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.budgetAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'budgetAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications on your device</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Weekly reports and insights via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-primary-600" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                    settings.appearance.theme === 'light'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                    settings.appearance.theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={settings.appearance.language}
                  onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                  className="input pl-10"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary-600" />
            Privacy & Security
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Data Analytics</p>
                <p className="text-sm text-gray-500">Help improve the app with usage analytics</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.analytics}
                  onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Marketing Communications</p>
                <p className="text-sm text-gray-500">Receive tips and product updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.privacy.marketing}
                  onChange={(e) => handleSettingChange('privacy', 'marketing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
          
          <div className="space-y-3">
            <button 
              onClick={handleExportData}
              className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Export Data</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}